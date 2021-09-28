import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Container, FormColumnCurrency, StyledSwapHeader, ContainerButtons, HeaderTitle } from './styleds';
import { SwapBottomSection, SwapTopSection } from 'components/SwapWrappers';
import { AutoRow } from 'components/Row';
import { CardHeaderMenuIcon } from '../../components/Card/CardHeaderStyledComponents';
import BigSwapArrow from 'components/swap/BigSwapArrow';
import { SwapBottomSectionFiller } from '../../components/SwapWrappers/index';
import { ButtonLight } from 'components/Button';
import { InputCurrencyComponent } from './inputCurrencyComponent';
import { createCalculateTrade, promiseTimeout, createTrade, createConfirmTrade, getTradingPairs, awaitForTradeCompleted } from './liquidityPoolApi';
import { useWebSocket, webSocketObject } from './useWebSocket';
import { CalculateTradeResponse, ConfirmTradeResponse } from 'models/protos/commands_pb';
import useDebounce from '../../hooks/useDebounce';
import { SendingSide } from '../../models/protos/models_pb';
import { IndependentFieldMap, setFee, setIndependetField, setInputCurrency, setInputCurrencyAmount, setOutputCurrency, setOutputCurrencyAmount, setTradingPair } from 'state/connext/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { SwapTradingPair } from 'state/connext/reducer';
import { toSatoshiWithPrecision } from 'utils/satoshi';
import { useWalletModalToggle } from 'state/application/hooks';
import { InputTradingPairsComponent } from './inputTradingPairsComponent';
import { COMPLETED_TRADE_MAX_TIMEOUT, DEFAULT_TRADING_PAIR, PROMISE_MAX_TIMEOUT, TradingPair, tradingPairsStr, TRADING_PAIRS } from 'constants/liquidity-pool/tradingPairs';
import { switchCurrencies } from '../../state/connext/actions';
import { getUsdEquivalent } from 'utils/usdPrice';
import { useActiveWeb3React } from 'hooks';
import { ConfirmInterchangeComponent } from './confirmInterchangeComponent';
import { LoadingScreenComponent, LoadingScreenComponentProps } from './loadingScreenComponent';
import { ActionsConnext } from '../../constants/liquidity-pool/tradingPairs';
import { CustomBrowserNode } from 'services/customBrowserNode/customBrowserNode';
import { SettingsTab } from './settingsTab';
import { BigNumber } from 'ethers';
import { newBigInteger } from './helper/protobuf-factory';
import { TradeResponse, GetTradingPairsResponse } from '../../models/protos/commands_pb';
import { createTransferLoader, depositLoader, resolveTransferLoader } from 'constants/liquidity-pool/loadingMessagges';
import { ERROR_STATES, resetConnextError } from 'constants/liquidity-pool/connextErrors';
import { SuccessScreenModal } from './succesScreenModal';
import { handlePendingTransfer, initCustomBrowserNode } from './useConnext';
import { resetLoader } from '../../constants/liquidity-pool/loadingMessagges';
import { HandleErrorComponent } from './handleErrorComponent';
import { createCustomWebSocket } from './createCustomWebSocket';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import Big from 'big.js';

export const Connext = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { independentField, inputCurrency, outputCurrency, tradingPair, fee }: SwapTradingPair = useSelector((state: AppState) => state.liquidityPool)
  const { currencyToken: inputCurrencyToken, currencyAmount: inputCurrencyAmount } = inputCurrency
  const { currencyToken: outputCurrencyToken, currencyAmount: outputCurrencyAmount } = outputCurrency
  const [price, setPrice] = useState('')
  const [inputUsdState, setInputUsdState] = useState('')
  const [outputUsdState, setOutputUsdState] = useState('')
  const [typedValueState, setTypedValueState] = useState('')
  const [disabled, setDisabled] = useState(true)
  const typedValueDebounced: string = useDebounce(typedValueState, 500)
  const [actionConnext, setActionConnext] = useState({
    action: ActionsConnext.SWAP,
    updates: 0
  })
  const [connextError, setConnextError] = useState(resetConnextError)
  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenComponentProps>(resetLoader)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [updatePrice, setUpdatePrice] = useState(true)
  interface savedStateInterface {
    clientamount: string,
    poolamount: string,
    fee: string,
  }
  const [savedCalculateTrade, setSavedCalculateTrade] = useState<savedStateInterface | undefined>(undefined)

  const priceLabel = (inputTokenName: string, outputTokenName: string, price: string) => {
    const priceLabelTmp = `${price} ${inputTokenName}/${outputTokenName}`
    setPrice(priceLabelTmp)
  }

  const toggleWalletModal = useWalletModalToggle()

  const { account, library } = useActiveWeb3React()

  const { webSocketSubject, webSocketListener } = useWebSocket()

  const swapCurrency = () => {
    dispatch(switchCurrencies())
  }

  const cleanAllPrices = () => {
    setInputUsdState('-')
    setOutputUsdState('-')
    setPrice('')
  }

  const onFinished = (txHash: string, amountUi?: string, amountBn?: BigNumber) => {
    console.log("On finish ==>", txHash, 'successWithdrawalUi', amountUi, 'withdrawalAmount', amountBn)
    setTxHash(txHash)
  }

  const handleInputCurrencyToken = useCallback((newTradingPair: TradingPair) => {
    dispatch(setTradingPair({ tradingPair: newTradingPair }))
    const newInputToken = newTradingPair.principalCurrency
    const newOutputToken = newTradingPair.secondaryCurrency
    dispatch(setInputCurrency({ inputCurrencyToken: newInputToken, inputCurrencyAmount: '', inputCurrencyAmountUsd: '' }))
    dispatch(setOutputCurrency({ outputCurrencyToken: newOutputToken, outputCurrencyAmount: '', outputCurrencyAmountUsd: '' }))
    cleanAllPrices()
    setTypedValueState('')
  }, [dispatch])

  useEffect(() => {
    handleInputCurrencyToken(TRADING_PAIRS[DEFAULT_TRADING_PAIR])
  }, [handleInputCurrencyToken])

  const [customWebSocket, setCustomWebSocket] = useState<webSocketObject | undefined>(undefined)


  const saveCustomWebSocket = useRef(customWebSocket)

  useEffect(() => {
    if (account) {
      const walletId = account.replace(/0x/, "")
      const queryParams = `?walletId=${walletId.toLowerCase()}`
      setCustomWebSocket(createCustomWebSocket(queryParams))
    } else {
      setCustomWebSocket(undefined)
    }
    return () => {
      const ws = saveCustomWebSocket.current
      if (ws) {
        ws.webSocketSubject.complete()
      }

    }
  }, [account])

  useEffect(() => {
    saveCustomWebSocket.current = customWebSocket
  }, [customWebSocket])


  const handleConnext = async () => {
    try {
      if (!checkForWallet()) {
        return
      }
      const customBrowserNode = await initCustomBrowserNode(
        inputCurrencyToken,
        outputCurrencyToken,
        library!,
        setLoadingScreen,
        setConnextError
      )
      if (true) {
        console.log(handleGetPairs)
      }
      if (ActionsConnext.SWAP === actionConnext.action) {
        setUpdatePrice(false)
        // console.log(handleConnextSwap)
        const formattedInput = Number(inputCurrencyAmount).toFixed(6)
        console.log('formattedInput', formattedInput)
        const transferAmountBn = BigNumber.from(parseUnits(formattedInput, 6)).toString();
        console.log('transferAmountBn', transferAmountBn)
        handleConnextSwap(customBrowserNode)
        setUpdatePrice(true)
      }
      if (ActionsConnext.RECOVER === actionConnext.action) {
        await handlePendingTransfer(customBrowserNode,
          inputCurrencyToken,
          outputCurrencyToken,
          setLoadingScreen,
          setConnextError,
          account!,
          onFinished
        )
      }
    } catch (error) {
      setUpdatePrice(true)
      console.log(error)
    }
  }

  const checkForWallet = () => {
    console.log('wallet', account)
    if (!account) {
      setConnextError({
        type: ERROR_STATES.ERROR_WALLET_NOT_FOUND,
        message: 'You must connect to a wallet before to be able to use the app . Please connect to a wallet first'
      })
      return false;
    }
    return true
  }

  const handleConnextSwap = async (customBrowserNode: CustomBrowserNode) => {
    try {
      console.log('DEPOSITING')
      setLoadingScreen(depositLoader)
      // await customBrowserNode.deposit({
      //   transferAmount: '2',
      //   webProvider: library!
      // })
      setLoadingScreen(createTransferLoader)
      console.log('CREATING TRANSFER')
      const amountToSend = Number(inputCurrencyAmount).toFixed(6)
      const transferDeets = await customBrowserNode.createConditionalTranfer(amountToSend)
      console.log('transferDeets', transferDeets)
      console.log('HANDLING CREATE TRADE')
      const tradeId = await handleCreateTrade(transferDeets.transferId)
      await awaitForCompletedTrade()
      console.log('HANDLING CONFIRM TRADE')
      handleConfirmTrade(tradeId, transferDeets.transferId)
      setLoadingScreen(resolveTransferLoader)
      console.log('RESOLVING TRANSFER')
      await customBrowserNode.resolveConditionalTransfer(transferDeets.preImage)
      // console.log('WITHDRAWING')
      // await customBrowserNode.withdraw({
      //   recipientAddress: account!,
      //   onFinished: onFinished
      // });
      setLoadingScreen(resetLoader)
    } catch (error) {
      console.log(error)
      setConnextError({
        type: ERROR_STATES.ERROR_SWAP_FAILED,
        message: error.message
      })
      setLoadingScreen(resetLoader)
      // throw error
    }
  }

  const handleGetPairs = async () => {
    try {
      const resp = await handleGetTradingPairs()
      console.log(resp.tradingpairsList)
    } catch (error) {
      console.log(error)
      setLoadingScreen(resetLoader)
      throw error
    }
  }

  const handleInputFieldCurrency = (newInputCurrency: string) => {
    dispatch(setInputCurrencyAmount({ inputCurrencyAmount: newInputCurrency }))
    dispatch(setIndependetField({ independentField: IndependentFieldMap.CLIENT }))
    setTypedValueState(newInputCurrency)
  }

  const handleOutputFieldCurrency = (newOutputCurrency: string) => {
    dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: newOutputCurrency }))
    dispatch(setIndependetField({ independentField: IndependentFieldMap.POOL }))
    setTypedValueState(newOutputCurrency)
  }

  const usdPriceFormat = (usd: string) => `$${usd} USD`

  const inputUsd = (amount: string, tokenName: string) => {
    getUsdEquivalent(amount, tokenName)
      .then((newUsdPrice: string) => {
        const formattedUsd = (newUsdPrice && Number(newUsdPrice) !== 0) ? usdPriceFormat(newUsdPrice) : '-'
        setInputUsdState(formattedUsd)
      })
  }

  const outputUsd = (amount: string, tokenName: string) => {
    getUsdEquivalent(amount, tokenName)
      .then((newUsdPrice: string) => {
        const formattedUsd = (newUsdPrice && Number(newUsdPrice) !== 0) ? usdPriceFormat(newUsdPrice) : '-'
        setOutputUsdState(formattedUsd)
      })
  }

  const cleanOutputFields = () => {
    dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: '' }))
    setOutputUsdState('-')
  }

  const cleanInputFields = () => {
    dispatch(setInputCurrencyAmount({ inputCurrencyAmount: '' }))
    setInputUsdState('')
  }

  const handleInputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanOutputFields()
    if (!typedValueState || Number(typedValueState) === 0) {
      setInputUsdState('-')
      setDisabled(false)
      return
    }
    inputUsd(typedValueState, inputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(inputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = inputCurrencyToken.name
    calculateOutputCurrency(currencyToken, tradingPairStr, satoshi)
  }


  const saveCalculateTrade = (response: CalculateTradeResponse.AsObject) => {
    setSavedCalculateTrade({
      clientamount: response.clientamount!.value,
      poolamount: response.poolamount!.value,
      fee: response.fee!.value
    })
  }

  const calculateOutputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, satoshi, SendingSide.CLIENT)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      console.log('response', response)
      saveCalculateTrade(response)
      // const amount = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(response.poolamount?.value || '', 9))
      const poolAmount = formatUnits(response.poolamount!.value, outputCurrencyToken.decimals);
      dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: poolAmount }))
      // console.log('response.fee?.value', response.fee?.value)
      dispatch(setFee({ fee: response.fee!.value }))
      // const satoshiPrice = toSatoshi(response.clientamount!.value).div(response.poolamount!.value).toString()
      // const parsedPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(satoshiPrice, 9))

      // const price = Number(inputCurrencyAmount) / Number(poolAmount)
      const price = Big(inputCurrencyAmount).div(Big(poolAmount))
      outputUsd(poolAmount, outputCurrencyToken.name)
      // priceLabel(currencyToken, outputCurrencyToken.name, parsedPrice)
      priceLabel(currencyToken, outputCurrencyToken.name, price.toString())
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
      setSavedCalculateTrade(undefined)
    })
  }

  const handleOutputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanInputFields()
    if (!typedValueState || Number(typedValueState) === 0) {
      setOutputUsdState('-')
      setDisabled(false)
      return
    }
    outputUsd(typedValueState, outputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(outputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = outputCurrencyToken?.name as string
    calculateInputCurrency(currencyToken, tradingPairStr, satoshi)
  }

  const calculateInputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, satoshi, SendingSide.POOL)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      console.log('response', response)
      saveCalculateTrade(response)
      // const amount = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(response.clientamount?.value || '', 9))
      const clientAmount = formatUnits(response.clientamount!.value, inputCurrencyToken.decimals);
      dispatch(setInputCurrencyAmount({ inputCurrencyAmount: clientAmount }))
      // console.log('response.fee?.value', response.fee?.value)
      dispatch(setFee({ fee: response.fee!.value }))
      // const satoshiPrice = toSatoshi(response.clientamount!.value).div(response.poolamount!.value).toString()
      // const parsedPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(satoshiPrice, 9))
      // const price = Number(clientAmount) / Number(outputCurrencyAmount)
      const price = Big(clientAmount).div(Big(outputCurrencyAmount))
      priceLabel(inputCurrencyToken.name, outputCurrencyToken.name, price.toString())
      inputUsd(clientAmount, inputCurrencyToken.name)
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
      setSavedCalculateTrade(undefined)
    })
  }


  const handleGetTradingPairs = async () => {
    try {
      const promise = getTradingPairs(
        webSocketSubject,
        webSocketListener
      )
      const resp: GetTradingPairsResponse.AsObject = await promiseTimeout(promise, PROMISE_MAX_TIMEOUT)
      return resp
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const handleCreateTrade = async (transferId: string) => {
    try {
      console.log('fee: ', fee)
      if (!customWebSocket) {
        throw new Error('The client could not be authenticated ')
      }
      const { webSocketSubject, webSocketListener } = customWebSocket
      const promise = createTrade(
        webSocketSubject,
        webSocketListener,
        newBigInteger(savedCalculateTrade!.clientamount),
        inputCurrencyToken.name,
        newBigInteger(savedCalculateTrade!.poolamount),
        outputCurrencyToken.name,
        newBigInteger(savedCalculateTrade!.fee),
        transferId
      )
      const resp: TradeResponse.AsObject = await promiseTimeout(promise, PROMISE_MAX_TIMEOUT)
      return resp.transferid
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const awaitForCompletedTrade = async () => {
    try {
      if (!customWebSocket) {
        throw new Error('The client could not be authenticated ')
      }
      const { webSocketSubject, webSocketListener } = customWebSocket
      const promise = awaitForTradeCompleted(
        webSocketSubject,
        webSocketListener
      )
      const resp: ConfirmTradeResponse.AsObject = await promiseTimeout(promise, COMPLETED_TRADE_MAX_TIMEOUT)
      return resp.tradeid
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const handleConfirmTrade = async (tradeId: string, transferId: string) => {
    try {
      if (!customWebSocket) {
        throw new Error('The client could not be authenticated ')
      }
      const { webSocketSubject, webSocketListener } = customWebSocket
      const promise = createConfirmTrade(
        webSocketSubject,
        webSocketListener,
        tradeId,
        transferId
      )
      const resp: ConfirmTradeResponse.AsObject = await promiseTimeout(promise, PROMISE_MAX_TIMEOUT)
      return resp.tradeid
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const getTrade = () => {
    if (independentField === IndependentFieldMap.CLIENT) {
      handleInputCurrency()
    } else {
      handleOutputCurrency()
    }
  }

  const savedGetTrade = useRef(getTrade)

  useEffect(() => {
    savedGetTrade.current = getTrade
  });

  const [showSettings, setShowSettings] = useState(false)

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }
  useEffect(() => {
    if (!updatePrice) {
      return
    }
    savedGetTrade.current()
    const interval = setInterval(() => {
      savedGetTrade.current()
    }, 15000);
    return () => clearInterval(interval);
  }, [typedValueDebounced, independentField, updatePrice])

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    toggleWalletModal()
  }



  const firstUpdate = useRef(true)

  const savedHandleConnext = useRef(handleConnext)

  useEffect(() => {
    savedHandleConnext.current = handleConnext
  });

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    savedHandleConnext.current()
  }, [actionConnext])

  const recover = () => {
    setActionConnext({
      action: ActionsConnext.RECOVER,
      updates: actionConnext.updates + 1
    })
  }

  const handleInterchange = () => {
    setActionConnext({
      action: ActionsConnext.SWAP,
      updates: actionConnext.updates + 1
    })
  }

  const [slippage, setSlippage] = useState(20)

  return (
    <Container>
      <StyledSwapHeader>
        <AutoRow justify='space-between'>
          <HeaderTitle >Connext</HeaderTitle>
          <div style={{ cursor: "pointer" }}>
            <CardHeaderMenuIcon onClick={toggleSettings}></CardHeaderMenuIcon>
          </div>
        </AutoRow>
      </StyledSwapHeader>
      <AutoRow justify='center'>
        <InputTradingPairsComponent
          tradingPairs={TRADING_PAIRS}
          tradingPair={tradingPair as TradingPair}
          handleInputCurrency={handleInputCurrencyToken}
        />
      </AutoRow>
      <SwapTopSection id='swap-top-section' minHeight={(700 - 60) / 2}>
        <InputCurrencyComponent
          currency={inputCurrencyToken}
          inputFieldCurrency={inputCurrencyAmount}
          handleInputFieldCurrency={handleInputFieldCurrency}
          usdPrice={inputUsdState}
        />
        <FormColumnCurrency>
          <BigSwapArrow
            onPress={() => { swapCurrency() }}
            disabled={disabled}
          />
        </FormColumnCurrency>
        <InputCurrencyComponent
          currency={outputCurrencyToken}
          inputFieldCurrency={outputCurrencyAmount}
          handleInputFieldCurrency={handleOutputFieldCurrency}
          trade={price}
          usdPrice={outputUsdState}
        />
      </SwapTopSection>
      <SwapBottomSectionFiller />
      <SwapBottomSection trade={true} previewing={false}>
        <ContainerButtons>
          {(!account)
            ? <ButtonLight onClick={handleSubmit}>Connect Wallet</ButtonLight>
            :
            <ConfirmInterchangeComponent
              inputCurrency={inputCurrencyToken.name}
              inputAmount={inputCurrencyAmount}
              outputCurrency={outputCurrencyToken.name}
              outputAmount={outputCurrencyAmount}
              onInterchange={handleInterchange}
              disabled={!(inputCurrencyAmount && outputCurrencyAmount)}
            />
          }
          <LoadingScreenComponent {...loadingScreen} />
        </ContainerButtons>
      </SwapBottomSection>
      {(showSettings)
        &&
        <SettingsTab
          showSettings={showSettings}
          toggle={toggleSettings}
          recover={recover}
          slippage={slippage}
          setSlippage={setSlippage}
        ></SettingsTab>
      }
      < SuccessScreenModal
        onDismiss={() => {
          setShowSuccessScreen(false)
          handleInputCurrencyToken(tradingPair)
        }}
        modalOpen={showSuccessScreen}
        message={"Swap was completed successfully"}
        senderChain={inputCurrencyToken.name}
        receiverChain={outputCurrencyToken.name}
        addressAccount={account!}
        txUrl={txHash}
      />
      <HandleErrorComponent
        connextError={connextError}
        inputCurrencyToken={inputCurrencyToken}
        outputCurrencyToken={outputCurrencyToken}
        account={account!}
        setConnextError={setConnextError}
        retrySetup={handleConnext}
      />
    </Container >
  )
}
