import { CHAIN_DETAIL } from '@connext/vector-sdk'
import { createReducer } from '@reduxjs/toolkit'
import { Field } from 'state/swap/actions'
import { replaceConnextState, selectCurrency, switchCurrencies, typeInput, setSuccessOutputAmount, setOutputTx, setTxError, setTxAmountError } from './actions'

export interface ConnextAsset {
  readonly chain: CHAIN_DETAIL | undefined
  readonly assetId: string | undefined
}

export interface ConnextState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: ConnextAsset | undefined
  readonly [Field.OUTPUT]: ConnextAsset | undefined
  
  // readonly inputTransferAmountUi: string // --> HOOK
  // readonly outputTransferAmountUi: string // --> HOOK
  // readonly transferFee: string // --> HOOK
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
  },
  [Field.OUTPUT]: {
    chain: undefined,
    assetId: undefined,
  },
  
  // inputTransferAmountUi: '', // --> HOOK
  // outputTransferAmountUi: '', // --> HOOK
  // transferFee: '', // --> HOOK
  // transferQuote: TransferQuote // --> HOOK

  successOutputAmount: '',
  outputTx: '',
  txError: '',
  txAmountError: '',
}

const getOtherField = (field: Field): Field => {
  return field === Field.INPUT ? Field.OUTPUT : Field.INPUT
}

export default createReducer<ConnextState>(initialState, builder =>
  builder
    .addCase(
      replaceConnextState,
      (state, { payload: { independentField, typedValue, inputConnextAsset, outputConnextAsset, successOutputAmount, outputTx, txError, txAmountError } }) => ({
        independentField,
        typedValue,
        [Field.INPUT]: inputConnextAsset,
        [Field.OUTPUT]: outputConnextAsset,
        successOutputAmount,
        outputTx,
        txError,
        txAmountError,
      })
    )
    .addCase(
      selectCurrency,
      (state, { payload: { field, connextAsset } }) => {
        const otherField = getOtherField(field)
        if (connextAsset.assetId === state[otherField]?.assetId) {
          return {
            ...state,
            independentField: getOtherField(state.independentField),
            [field]: connextAsset,
            [otherField]: state[field],
          }
        }
        return {
          ...state,
          [field]: connextAsset
        }
      }
    )
    .addCase(switchCurrencies, state => ({
      ...state,
      independentField: getOtherField(state.independentField),
      [Field.INPUT]: state[Field.OUTPUT],
      [Field.OUTPUT]: state[Field.INPUT],
    }))
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(setSuccessOutputAmount, (state, { payload: { successOutputAmount } }) => ({
      ...state,
      successOutputAmount,
    }))
    .addCase(setOutputTx, (state, { payload: { outputTx } }) => ({
      ...state,
      outputTx,
    }))
    .addCase(setTxError, (state, { payload: { txError } }) => ({
      ...state,
      txError,
    }))
    .addCase(setTxAmountError, (state, { payload: { txAmountError } }) => ({
      ...state,
      txAmountError,
    }))
)
