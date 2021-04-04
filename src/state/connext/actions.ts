import { createAction } from '@reduxjs/toolkit'

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

export const setConnextTransferAmountUi = createAction<{ }

// OLD

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
