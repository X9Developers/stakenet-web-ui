import { handlePendingTransfer, initCustomBrowserNode } from "./useConnext"
import { ActionsConnext, PROMISE_MAX_TIMEOUT, COMPLETED_TRADE_MAX_TIMEOUT, ActionConnextState, savedStateInterface } from 'constants/liquidity-pool/tradingPairs';
import { awaitForTradeCompleted, createConfirmTrade, createTrade, getHistoryTrades, getTradingPairs, promiseTimeout, subscribe } from "services/liquidityPoolApi";
import { GetHistoricTradesResponse, GetTradingPairsResponse, SubscribeResponse } from "models/protos/commands_pb";
import { CustomBrowserNode } from "services/customBrowserNode/customBrowserNode";
import { ERROR_STATES } from "constants/liquidity-pool/connextErrors";
import { parseUnits } from "ethers/lib/utils";
import { ConfirmTradeResponse, TradeResponse } from 'models/protos/commands_pb';
import { newBigInteger } from "helpers/protobuf-factory";
import { BigNumber } from "ethers";
import { createTransferLoader, depositLoader, resolveTransferLoader } from "constants/liquidity-pool/loadingMessagges";
import { resetLoader } from 'constants/liquidity-pool/loadingMessagges';
import { SwapTradingPair } from "state/connext/reducer";
import { useActiveWeb3React } from 'hooks/index';
import { LoadingScreenComponentProps } from "components/calculator/loadingScreenComponent";
import { ConnextError } from 'constants/liquidity-pool/connextErrors';
import { useWebSocket, webSocketObject } from '../../hooks/webSocket/useWebSocket';
import { useEffect, useRef, useState } from "react";
import { createCustomWebSocket } from "../../hooks/webSocket/createCustomWebSocket";

interface UseConnextRequestsProps {
  setLoadingScreen: (LoadingScreenComponentProps: LoadingScreenComponentProps) => void
  setConnextError: (connextError: ConnextError) => void
  actionConnext: ActionConnextState
  setUpdatePrice: (val: boolean) => void
  savedCalculateTrade: savedStateInterface | undefined
  onFinished: (txHash: string, amountUi?: string, amountBn?: BigNumber) => void
  swapTradingPair: SwapTradingPair
}


export const UseConnextRequests = ({
  setLoadingScreen,
  setConnextError,
  actionConnext,
  setUpdatePrice,
  savedCalculateTrade,
  onFinished,
  swapTradingPair
}: UseConnextRequestsProps) => {

  const { inputCurrency, outputCurrency, fee }: SwapTradingPair = swapTradingPair
  const { currencyToken: inputCurrencyToken, currencyAmount: inputCurrencyAmount } = inputCurrency
  const { currencyToken: outputCurrencyToken } = outputCurrency

  const { account, library } = useActiveWeb3React()


  const { webSocketSubject, webSocketListener } = useWebSocket()

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
    console.log('customWebSocket', customWebSocket)
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
        // const formattedInput = Number(inputCurrencyAmount).toFixed(6)
        const formattedInput = Number(inputCurrencyAmount).toFixed(6)
        console.log('formattedInput', formattedInput)
        const transferAmountBn = BigNumber.from(parseUnits(formattedInput, 6)).toString();
        console.log('transferAmountBn', transferAmountBn)
        handleConnextSwap(customBrowserNode)
        setUpdatePrice(true)
      }
      if (ActionsConnext.RECOVER === actionConnext.action) {
        // await handlePendingTransfer(customBrowserNode,
        //   inputCurrencyToken,
        //   outputCurrencyToken,
        //   setLoadingScreen,
        //   setConnextError,
        //   account!,
        //   onFinished
        // )
        console.log(handlePendingTransfer)
        console.log(onFinished)
        console.log(handleSuscribe())
      }
    } catch (error) {
      setUpdatePrice(true)
      console.log(error)
    }
  }

  const handleSuscribe = async () => {
    try {

      console.log('fee: ', fee)
      // if (!customWebSocket) {
      //   throw new Error('The client could not be authenticated ')
      // }
      // const XSN_BTC = "XSN_BTC"
      const TRADING_PAIR = "ETH_USDC"
      // const LTC_BTC = "LTC_BTC"
      // const { webSocketSubject, webSocketListener } = customWebSocket
      const promise = subscribe(
        webSocketSubject,
        webSocketListener,
        TRADING_PAIR)
      const promise2 = getHistoryTrades(
        webSocketSubject,
        webSocketListener,
        TRADING_PAIR)
      // const promise = createTrade(
      //   webSocketSubject,
      //   webSocketListener,
      //   newBigInteger(savedCalculateTrade!.clientamount),
      //   inputCurrencyToken.name,
      //   newBigInteger(savedCalculateTrade!.poolamount),
      //   outputCurrencyToken.name,
      //   newBigInteger(savedCalculateTrade!.fee),
      //   transferId
      // )
      const resp: SubscribeResponse.AsObject = await promiseTimeout(promise, PROMISE_MAX_TIMEOUT)
      const resp2: GetHistoricTradesResponse.AsObject = await promiseTimeout(promise2, PROMISE_MAX_TIMEOUT)
      console.log('SubscribeResponse', resp)
      console.log('GetHistoricTradesResponse', resp2)
    } catch (error) {
      console.log(error)
      throw error
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
      // const amountToSend = Number(inputCurrencyAmount).toFixed(6)
      const amountToSend = savedCalculateTrade?.clientamount!
      const transferDeets = await customBrowserNode.createConditionalTranfer(amountToSend)
      console.log('transferDeets', transferDeets)
      console.log('HANDLING CREATE TRADE')
      const tradeId = await handleCreateTrade(transferDeets.transferId)
      console.log('tradeId', tradeId)
      console.log('AWAIT FOR COMPLETED TRADE')
      await awaitForCompletedTrade()
      console.log('HANDLING CONFIRM TRADE')
      // handleConfirmTrade(tradeId, transferDeets.transferId)
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
      console.log(`calling createTrade: `,
        savedCalculateTrade!.clientamount,
        inputCurrencyToken.name,
        savedCalculateTrade!.poolamount,
        outputCurrencyToken.name,
        transferId
      )
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
      console.log(`TradeResponse: `, resp)
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
  return {
    handleConnext,
    handleSuscribe,
    checkForWallet,
    handleConnextSwap,
    handleGetPairs,
    handleConfirmTrade
  }
}