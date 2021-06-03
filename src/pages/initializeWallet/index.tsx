import React, { } from 'react'
import { useSelector } from 'react-redux';
import { UserState } from 'state/user/reducer';
import { AppState } from 'state';
import { Route, Redirect } from 'react-router-dom';
import Wallet from 'pages/Wallet';
import { KeyringState } from 'state/keyring/reducer';

export default function InitilizeWallet({ ...rest }) {
  const userState: UserState = useSelector((state: AppState) => state.user)
  const keyringState: KeyringState = useSelector((state: AppState) => state.keyring)

  return (
    <>
      <Route  {...rest} component={({ ...props }) => {
        if (userState.hasWallet && userState.onBoarding && keyringState.isUnlocked) {
          return <Wallet {...props} />
        } else if (userState.hasWallet && !keyringState.isUnlocked) {
          return <Redirect to="/wallet/unlock" />
        } else if (userState.hasWallet && !userState.onBoarding) {
          return <Redirect to="/wallet/seed-phrase" />
        } else {
          return <Redirect to="/wallet/add-wallet" />
        }
      }}
      />
    </>
  )
}