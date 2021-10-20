import { PROMISE_MAX_TIMEOUT, tradingPairsStr } from 'constants/liquidity-pool/tradingPairs';
import { getHistoryTrades, promiseTimeout, subscribe } from "services/liquidityPoolApi";
import { GetHistoricTradesResponse, SubscribeResponse } from "models/protos/commands_pb";
import { SwapTradingPair } from "state/connext/reducer";
import { useActiveWeb3React } from 'hooks/index';
import { useWebSocketMarketOrder, webSocketObject } from '../../hooks/webSocket/useWebSocket';
import { useEffect, useRef, useState } from "react";
import { createCustomWebSocket } from "../../hooks/webSocket/createCustomWebSocket";

interface UseConnextRequestsProps {
  swapTradingPair: SwapTradingPair
  setCurrencyPrice: (val: string) => void
}


export const UseMarketOrderRequests = ({
  swapTradingPair,
  setCurrencyPrice
}: UseConnextRequestsProps) => {

  const webSocketMarketOrder = useWebSocketMarketOrder()

  const { tradingPair }: SwapTradingPair = swapTradingPair

  const { account } = useActiveWeb3React()

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
  const handleSuscribe = async () => {
    try {
      const TRADING_PAIR = tradingPairsStr(tradingPair)
      const promise = subscribe(
        webSocketMarketOrder.webSocketSubject,
        webSocketMarketOrder.webSocketListener,
        TRADING_PAIR)
      const promise2 = getHistoryTrades(
        webSocketMarketOrder.webSocketSubject,
        webSocketMarketOrder.webSocketListener,
        TRADING_PAIR)
      const resp: SubscribeResponse.AsObject = await promiseTimeout(promise, PROMISE_MAX_TIMEOUT)
      if (resp.summarybidsList.length > 0) {
        setCurrencyPrice(resp.summarybidsList[0].price?.value!)
      }
      else {
        throw new Error("Error Getting Price")
      }
      const resp2: GetHistoricTradesResponse.AsObject = await promiseTimeout(promise2, PROMISE_MAX_TIMEOUT)
      console.log('SubscribeResponse', resp)
      console.log('GetHistoricTradesResponse', resp2)

    } catch (error) {
      console.log(error)
      // throw error
    }
  }

  return {
    handleSuscribe
  }
}