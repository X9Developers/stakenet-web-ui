import React, { } from 'react'
import { useSelector } from 'react-redux';
import { UserState } from 'state/user/reducer';
import { AppState } from 'state';
import { Route, Redirect } from 'react-router-dom';
import AddWallet from './index';

export default function RedirectAddWallet({ ...props }) {
  const userState: UserState = useSelector((state: AppState) => state.user)

  return (
    <>
      <Route  {...props} component={({ ...props }) => {
        if (!userState.hasWallet) {
          return <AddWallet {...props} />
        } else {
          return <Redirect to="/wallet" />
        }
      }}
      />
    </>
  )
}