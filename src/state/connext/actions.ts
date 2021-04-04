import { createAction } from '@reduxjs/toolkit'
import { Field } from 'state/swap/actions';
import { ConnextAsset } from './reducer';

export const ERROR_STATES = {
  ERROR_SETUP: "ERROR_SETUP",
  ERROR_TRANSFER: "ERROR_TRANSFER",
  ERROR_NETWORK: "ERROR_NETWORK",
} as const;
export type ErrorStates = keyof typeof ERROR_STATES;

export const SCREEN_STATES = {
  LOADING: "LOADING",
  EXISTING_BALANCE: "EXISTING_BALANCE",
  SWAP: "SWAP",
  RECOVERY: "RECOVERY",
  LISTENER: "LISTENER",
  STATUS: "STATUS",
  SUCCESS: "SUCCESS",
  ...ERROR_STATES,
} as const;
export type ScreenStates = keyof typeof SCREEN_STATES;

export const selectCurrency = createAction<{
  field: Field;
  connextAsset: ConnextAsset }
>('connext/selectCurrency')
export const switchCurrencies = createAction<void>('connext/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('connext/typeInput')
export const setSuccessOutputAmount = createAction<{ successOutputAmount: string }>('connext/setSuccessOutputAmount')
export const setOutputTx = createAction<{ outputTx: string }>('connext/setOutputTx')
export const setTxError = createAction<{ txError: string }>('connext/setTxError')
export const setTxAmountError = createAction<{ txAmountError: string }>('connext/setTxAmountError')



export const replaceConnextState = createAction<{
  independentField: Field
  typedValue: string
  inputConnextAsset: ConnextAsset
  outputConnextAsset: ConnextAsset
  successOutputAmount: string,
  outputTx: string,
  txError: string,
  txAmountError: string,
}>('connext/replaceConnextState')
