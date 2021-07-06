import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_TRADING_PAIR, TokenCurrency, TradingPair, TRADING_PAIRS } from 'constants/liquidity-pool/tradingPairs'
import {
  setIndependetField,
  IndependentFieldMap,
  setInputCurrency,
  setOutputCurrency,
  setTradingPair,
  switchCurrencies,
  setInputCurrencyAmount,
  setOutputCurrencyAmount,
  setInputCurrencyToken,
  setOutputCurrencyToken,
  setInputCurrencyAmountUsd,
  setOutputCurrencyAmountUsd,
  setTypedValue,
} from './actions'

export interface Currency {
  currencyToken: TokenCurrency,
  currencyAmount: string
  currencyAmountUsd: string
}

export interface SwapTradingPair {
  tradingPair: TradingPair,
  independentField: IndependentFieldMap,
  typedValue: string,
  inputCurrency: Currency,
  outputCurrency: Currency
}

const initialState: SwapTradingPair = {
  tradingPair: TRADING_PAIRS[DEFAULT_TRADING_PAIR],
  independentField: IndependentFieldMap.CLIENT,
  typedValue: '',
  inputCurrency: {
    currencyToken: { name: '', urlIcon: '' },
    currencyAmount: '',
    currencyAmountUsd: ''
  },
  outputCurrency: {
    currencyToken: { name: '', urlIcon: '' },
    currencyAmount: '',
    currencyAmountUsd: ''
  },
}

export default createReducer<SwapTradingPair>(initialState, builder =>
  builder
    .addCase(setTradingPair, (state, { payload: { tradingPair } }) => {
      state.tradingPair = tradingPair
    })
    .addCase(setIndependetField, (state, { payload: { independentField } }) => {
      state.independentField = independentField
    })
    .addCase(setTypedValue, (state, { payload: { typedValue } }) => {
      state.typedValue = typedValue
    })
    .addCase(setInputCurrency, (state, { payload: { inputCurrencyToken, inputCurrencyAmount, inputCurrencyAmountUsd } }) => {
      state.inputCurrency = {
        currencyToken: inputCurrencyToken,
        currencyAmount: inputCurrencyAmount,
        currencyAmountUsd: inputCurrencyAmountUsd
      }
    })
    .addCase(setOutputCurrency, (state, { payload: { outputCurrencyToken, outputCurrencyAmount, outputCurrencyAmountUsd } }) => {
      state.outputCurrency = {
        currencyToken: outputCurrencyToken,
        currencyAmount: outputCurrencyAmount,
        currencyAmountUsd: outputCurrencyAmountUsd
      }
    })
    .addCase(switchCurrencies, state => {
      const currencyTmp = state.inputCurrency
      const updateIndependentField = (state.independentField === IndependentFieldMap.CLIENT) ? IndependentFieldMap.POOL : IndependentFieldMap.CLIENT
      return {
        ...state,
        independentField: updateIndependentField,
        inputCurrency: state.outputCurrency,
        outputCurrency: currencyTmp
      }
    })
    .addCase(setInputCurrencyAmount, (state, { payload: { inputCurrencyAmount } }) => {
      state.inputCurrency.currencyAmount = inputCurrencyAmount
    })
    .addCase(setInputCurrencyAmountUsd, (state, { payload: { inputCurrencyAmountUsd } }) => {
      state.inputCurrency.currencyAmountUsd = inputCurrencyAmountUsd
    })
    .addCase(setInputCurrencyToken, (state, { payload: { inputCurrencyToken } }) => {
      state.inputCurrency.currencyToken = inputCurrencyToken
    })
    .addCase(setOutputCurrencyAmount, (state, { payload: { outputCurrencyAmount } }) => {
      state.outputCurrency.currencyAmount = outputCurrencyAmount
    })
    .addCase(setOutputCurrencyAmountUsd, (state, { payload: { outputCurrencyAmountUsd } }) => {
      state.outputCurrency.currencyAmountUsd = outputCurrencyAmountUsd
    })
    .addCase(setOutputCurrencyToken, (state, { payload: { outputCurrencyToken } }) => {
      state.outputCurrency.currencyToken = outputCurrencyToken
    })
)
