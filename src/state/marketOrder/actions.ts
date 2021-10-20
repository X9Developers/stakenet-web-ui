import { createAction } from '@reduxjs/toolkit'
import { TradingPair } from 'constants/liquidity-pool/tradingPairs'
import { TokenInfo } from 'services/customBrowserNode/types'

export enum IndependentFieldMap {
  CLIENT = 0,
  POOL = 1,
}

export const switchCurrencies = createAction<void>('marketOrder/switchCurrencies')
export const setIndependetField = createAction<{ independentField: IndependentFieldMap }>('marketOrder/setIndependentField')
export const setTypedValue = createAction<{ typedValue: string }>('marketOrder/setTypedValue')
export const setInputCurrency = createAction<{ inputCurrencyToken: TokenInfo, inputCurrencyAmount: string, inputCurrencyAmountUsd: string }>('marketOrder/inputCurrency')
export const setOutputCurrency = createAction<{ outputCurrencyToken: TokenInfo, outputCurrencyAmount: string, outputCurrencyAmountUsd: string }>('marketOrder/outputCurrency')
export const setTradingPair = createAction<{ tradingPair: TradingPair }>('marketOrder/setTradingPair')
export const setInputCurrencyAmount = createAction<{ inputCurrencyAmount: string }>('marketOrder/setInputCurrencyAmount')
export const setInputCurrencyAmountUsd = createAction<{ inputCurrencyAmountUsd: string }>('marketOrder/setInputCurrencyAmountUsd')
export const setInputCurrencyToken = createAction<{ inputCurrencyToken: TokenInfo }>('marketOrder/setInputCurrencyToken')
export const setOutputCurrencyAmount = createAction<{ outputCurrencyAmount: string }>('marketOrder/setOutputCurrencyAmount')
export const setOutputCurrencyAmountUsd = createAction<{ outputCurrencyAmountUsd: string }>('marketOrder/setOutputCurrencyAmountUsd')
export const setOutputCurrencyToken = createAction<{ outputCurrencyToken: TokenInfo }>('marketOrder/setOutputCurrencyToken')
export const setFee = createAction<{ fee: string }>('marketOrder/setFee')