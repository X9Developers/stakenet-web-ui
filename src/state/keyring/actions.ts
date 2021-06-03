import { createAction } from '@reduxjs/toolkit'

export type Keyring = {
  type: string,
  data: {
    mnemonic: string,
    numberOfAccounts: number,
    hdPath: string
  }
}

export const addKeyring = createAction<{ keyring: Keyring }>('keyrings/addKeyring')