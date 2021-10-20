import { ConnextError, ERROR_STATES } from "constants/liquidity-pool/connextErrors";
import { checkingPendingTransferLoader, recoverAmountLoader, resetLoader } from "constants/liquidity-pool/loadingMessagges";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { CustomBrowserNode } from "services/customBrowserNode/customBrowserNode";
import { TokenInfo } from "services/customBrowserNode/types";
import { LoadingScreenComponentProps } from 'components/calculator/loadingScreenComponent';
import { HUB_PUBLIC_IDENTIFIER } from 'constants/liquidity-pool/publicIdentifiers';
import { Web3Provider } from '@ethersproject/providers';
import { settingUpChannelsLoader } from 'constants/liquidity-pool/loadingMessagges';


export const initCustomBrowserNode = async (
  inputCurrencyToken: TokenInfo,
  outputCurrencyToken: TokenInfo,
  library: Web3Provider,
  setLoadingScreen: (loadingScreenComponentProps: LoadingScreenComponentProps) => void,
  setConnextError: (connextError: ConnextError) => void,
) => {
  const params = {
    publicIdentifier: HUB_PUBLIC_IDENTIFIER,
    senderChain: inputCurrencyToken,
    recipientChain: outputCurrencyToken
  }
  try {
    const network = await library?.getNetwork()
    console.log('Network: ', network)
    if (1 !== network?.chainId) {
      console.log('Please change network')
      throw new Error('Please change network');
    }
    const customBrowserNode = new CustomBrowserNode(params)
    console.log(customBrowserNode)
    setLoadingScreen(settingUpChannelsLoader)
    await customBrowserNode.init()
    setLoadingScreen(resetLoader)
    return customBrowserNode
  } catch (error) {
    setLoadingScreen(resetLoader)
    setConnextError({
      type: ERROR_STATES.ERROR_SETUP,
      message: error.message
    })
    throw new Error(error.message);
  }
}


export const handlePendingTransfer = async (customBrowserNode: CustomBrowserNode,
  senderChainInfo: TokenInfo,
  receiverChainInfo: TokenInfo,
  setLoadingScreen: (loadingScreenComponentProps: LoadingScreenComponentProps) => void,
  setConnextError: (connextError: ConnextError) => void,
  account: string,
  onFinished: (txHash: string, amountUi?: string, amountBn?: BigNumber) => void
) => {
  console.log("Looking for pending Transfers...");
  let response;
  try {
    setLoadingScreen(checkingPendingTransferLoader)
    response = await customBrowserNode!.checkPendingTransfer();
    setLoadingScreen(resetLoader)
  } catch (e) {
    const message = "Failed at Pending Tranfer Check";
    setConnextError({
      type: ERROR_STATES.ERROR_RECOVER,
      message: message
    })
    console.log(e, message);
    return;
  }
  const offChainDepositAssetBalance: BigNumber = response.offChainSenderChainAssetBalanceBn;
  const offChainWithdrawAssetBalance: BigNumber = response.offChainRecipientChainAssetBalanceBn;
  if (offChainDepositAssetBalance.gt(0) && offChainWithdrawAssetBalance.gt(0)) {
    console.warn("Balance exists in both channels, transferring first, then withdrawing");
  }
  if (offChainDepositAssetBalance.eq(0) && offChainWithdrawAssetBalance.eq(0)) {
    console.warn("Balance not found in state channels");
    const message = "Balance not found in state channels";
    setConnextError({
      type: ERROR_STATES.ERROR_BALANCE_NOT_FOUND,
      message: message
    })
    return
  }
  if (offChainDepositAssetBalance.gt(0)) {
    try {
      const existingBalance = formatUnits(offChainDepositAssetBalance.toString(), senderChainInfo.decimals!);
      console.log(`existingBalance`, existingBalance)
      setLoadingScreen(recoverAmountLoader)
      customBrowserNode.recover({
        recipientAddress: account!,
        assetId: senderChainInfo.assetId
      })
      setLoadingScreen(resetLoader)
    } catch (e) {
      setLoadingScreen(resetLoader)
      const message = "Error at withdraw";
      console.log(e, message);
      return
    }
  }
  if (offChainWithdrawAssetBalance.gt(0)) {
    try {
      setLoadingScreen(recoverAmountLoader)
      await customBrowserNode!.withdraw({
        recipientAddress: account!,
        onFinished: onFinished
      });
      setLoadingScreen(resetLoader)
    } catch (e) {
      setLoadingScreen(resetLoader)
      const message = "Error at withdraw";
      console.log(e, message);
      return;
    }
  }
}