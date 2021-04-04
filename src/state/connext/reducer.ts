import { CHAIN_DETAIL } from '@connext/vector-sdk'
import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

export interface ConnextState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly chain: CHAIN_DETAIL | undefined
    readonly assetId: string | undefined
    readonly assetUserBalance: string | undefined
    readonly assetChannelBalance: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly chain: CHAIN_DETAIL | undefined
    readonly assetId: string | undefined
    readonly assetChannelBalance: string | undefined
  }
  
  readonly inputTransferAmountUi: string // --> HOOK
  readonly outputTransferAmountUi: string // --> HOOK
  readonly transferFee: string // --> HOOK
  // readonly transferQuote: TransferQuote // --> HOOK

  readonly successOutputAmount: string

  readonly outputTx: string
  readonly txError: string
  readonly txAmountError: string
}

const initialState: ConnextState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    chain: undefined,
    assetId: undefined,
    assetUserBalance: undefined,
    assetChannelBalance: undefined,
  },
  [Field.OUTPUT]: {
    chain: undefined,
    assetId: undefined,
    assetChannelBalance: undefined,
  },
  
  inputTransferAmountUi: '', // --> HOOK
  outputTransferAmountUi: '', // --> HOOK
  transferFee: '', // --> HOOK
  // transferQuote: TransferQuote // --> HOOK

  successOutputAmount: '',

  outputTx: '',
  txError: '',
  txAmountError: '',
}

export default createReducer<ConnextState>(initialState, builder =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId
          },
          independentField: field,
          typedValue: typedValue,
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
