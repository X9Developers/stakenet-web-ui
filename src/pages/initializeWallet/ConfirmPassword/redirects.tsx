import React, { } from 'react'
import { useSelector } from 'react-redux';
import { UserState } from 'state/user/reducer';
import { AppState } from 'state';
import { Route, Redirect } from 'react-router-dom';
import ConfirmPassword from './index';

export default function RedirectConfirmPassword({ ...props }) {
  const userState: UserState = useSelector((state: AppState) => state.user)

  return (
    <>
      <Route  {...props} component={({ ...props }) => {
        if (userState.hasWallet) {
          return <Redirect to="/wallet" />
        } else {
          return <ConfirmPassword {...props} />
        }
      }}
      />
    </>
  )
}