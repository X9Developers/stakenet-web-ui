import { createAction } from '@reduxjs/toolkit'
import { TokenCurrency, TradingPair } from 'constants/liquidity-pool/tradingPairs'

export enum IndependentFieldMap {
  CLIENT = 0,
  POOL = 1,
}

export const switchCurrencies = createAction<void>('liquidityPool/switchCurrencies')
export const setIndependetField = createAction<{ independentField: IndependentFieldMap }>('liquidityPool/setIndependentField')
export const setTypedValue = createAction<{ typedValue: string }>('liquidityPool/setTypedValue')
export const setInputCurrency = createAction<{ inputCurrencyToken: TokenCurrency, inputCurrencyAmount: string, inputCurrencyAmountUsd: string }>('liquidityPool/inputCurrency')
export const setOutputCurrency = createAction<{ outputCurrencyToken: TokenCurrency, outputCurrencyAmount: string, outputCurrencyAmountUsd: string }>('liquidityPool/outputCurrency')
export const setTradingPair = createAction<{ tradingPair: TradingPair }>('liquidityPool/setTradingPair')
export const setInputCurrencyAmount = createAction<{ inputCurrencyAmount: string }>('liquidityPool/setInputCurrencyAmount')
export const setInputCurrencyAmountUsd = createAction<{ inputCurrencyAmountUsd: string }>('liquidityPool/setInputCurrencyAmountUsd')
export const setInputCurrencyToken = createAction<{ inputCurrencyToken: TokenCurrency }>('liquidityPool/setInputCurrencyToken')
export const setOutputCurrencyAmount = createAction<{ outputCurrencyAmount: string }>('liquidityPool/setOutputCurrencyAmount')
export const setOutputCurrencyAmountUsd = createAction<{ outputCurrencyAmountUsd: string }>('liquidityPool/setOutputCurrencyAmountUsd')
export const setOutputCurrencyToken = createAction<{ outputCurrencyToken: TokenCurrency }>('liquidityPool/setOutputCurrencyToken')