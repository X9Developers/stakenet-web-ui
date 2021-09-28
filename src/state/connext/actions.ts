import { createAction } from '@reduxjs/toolkit'
import { TradingPair } from 'constants/liquidity-pool/tradingPairs'
import { TokenInfo } from 'services/customBrowserNode/types'

export enum IndependentFieldMap {
  CLIENT = 0,
  POOL = 1,
}

export const switchCurrencies = createAction<void>('liquidityPool/switchCurrencies')
export const setIndependetField = createAction<{ independentField: IndependentFieldMap }>('liquidityPool/setIndependentField')
export const setTypedValue = createAction<{ typedValue: string }>('liquidityPool/setTypedValue')
export const setInputCurrency = createAction<{ inputCurrencyToken: TokenInfo, inputCurrencyAmount: string, inputCurrencyAmountUsd: string }>('liquidityPool/inputCurrency')
export const setOutputCurrency = createAction<{ outputCurrencyToken: TokenInfo, outputCurrencyAmount: string, outputCurrencyAmountUsd: string }>('liquidityPool/outputCurrency')
export const setTradingPair = createAction<{ tradingPair: TradingPair }>('liquidityPool/setTradingPair')
export const setInputCurrencyAmount = createAction<{ inputCurrencyAmount: string }>('liquidityPool/setInputCurrencyAmount')
export const setInputCurrencyAmountUsd = createAction<{ inputCurrencyAmountUsd: string }>('liquidityPool/setInputCurrencyAmountUsd')
export const setInputCurrencyToken = createAction<{ inputCurrencyToken: TokenInfo }>('liquidityPool/setInputCurrencyToken')
export const setOutputCurrencyAmount = createAction<{ outputCurrencyAmount: string }>('liquidityPool/setOutputCurrencyAmount')
export const setOutputCurrencyAmountUsd = createAction<{ outputCurrencyAmountUsd: string }>('liquidityPool/setOutputCurrencyAmountUsd')
export const setOutputCurrencyToken = createAction<{ outputCurrencyToken: TokenInfo }>('liquidityPool/setOutputCurrencyToken')
export const setFee = createAction<{ fee: string }>('liquidityPool/setFee')