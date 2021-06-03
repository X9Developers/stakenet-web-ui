import React, { } from 'react'
import { useSelector } from 'react-redux';
import { AppState } from 'state';
import { Route, Redirect } from 'react-router-dom';
import { KeyringState } from 'state/keyring/reducer';
import UnlockWallet from './index';

export default function RedirectUnlockWallet({ ...props }) {
  const keyringState: KeyringState = useSelector((state: AppState) => state.keyring)

  return (
    <>
      <Route  {...props} component={({ ...props }) => {
        if (!keyringState.isUnlocked) {
          return <UnlockWallet {...props} />
        } else {
          return <Redirect to="/wallet" />
        }
      }}
      />
    </>
  )
}