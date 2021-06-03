import React, { useState } from 'react';
import { Button, ContainerRestore, ContainerRestoreText, ContainerRestoreTitle } from './styleds';
import Logo from '../../../assets/svg/logo_white.svg'
import { useForm } from 'hooks/useForm';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state';
import { useSelector } from 'react-redux';
import { UserState } from 'state/user/reducer';
import { AppState } from 'state';
import { Container, ContainerTitle, ErrorDiv, FormColumn, FormRow, LogoStakenet, ContainerActions, InputField } from '../styleds';
import { addKeyring, Keyring } from 'state/keyring/actions';
import { decryptObject } from 'utils/Encrypter';
// import { Wallet } from '@ethersproject/wallet';
import { isPassword } from '../../../utils/validation';

export default function UnlockWallet() {
  const userState: UserState = useSelector((state: AppState) => state.user)

  const [formValues, handleInputChange]: any = useForm({
    password: ''
  })

  const [isWaiting, setIsWaiting] = useState(false);

  const { password } = formValues

  const history = useHistory()

  const dispatch = useDispatch<AppDispatch>()

  const [error, setError] = useState('');

  const onHandleSubmit = (e: any) => {
    e.preventDefault()
    setIsWaiting(true)
    setError('')
    const validationError = validateForm()
    if (!validationError) {
      decryptObject(password, userState.vault)
        .then((vault: Keyring) => {
          dispatch(addKeyring({ keyring: vault }))
          // Create the wallet when needed 
          // const wallet = Wallet.fromMnemonic(vault.data.mnemonic, vault.data.hdPath)
          setIsWaiting(false);
          history.push("/wallet")
        }).catch((error: any) => {
          setError(error.message);
          setIsWaiting(false)
        })
    } else {
      setError(validationError)
      setIsWaiting(false)
    }
  }

  const validateForm = () => {
    if (!password) {
      return "The password can't be empty"
    } else if (!isPassword(password)) {
      return "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
    } else {
      return ""
    }
  }

  return (
    <Container>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Welcome Back</ContainerTitle>
      <form onSubmit={onHandleSubmit}>
        <FormRow>
          <FormColumn>
            <InputField
              id="password"
              type="password"
              placeholder="password"
              autoComplete="off"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {(error) ? (<ErrorDiv width="250px"> {error} </ErrorDiv>) : ''}
          </FormColumn>
        </FormRow>
        <ContainerActions>
          <Button type="submit" disabled={isWaiting} onSubmit={onHandleSubmit}>Unlock</Button>
        </ContainerActions>
      </form>
      <ContainerRestore>
        <ContainerRestoreTitle>Restore account</ContainerRestoreTitle>
        <Link to="/wallet/restore-wallet"><ContainerRestoreText>Restore account from seed phrase</ContainerRestoreText></Link>
      </ContainerRestore>
    </Container>
  )
}