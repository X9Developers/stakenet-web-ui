import { createReducer } from '@reduxjs/toolkit'
import { addKeyring, Keyring } from './actions'

export interface KeyringState {
  isUnlocked: boolean,
  keyring?: Keyring,
}

export const initialState: KeyringState = {
  isUnlocked: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(addKeyring, (state, action) => {
      state.isUnlocked = true
      state.keyring = action.payload.keyring
    })
)
