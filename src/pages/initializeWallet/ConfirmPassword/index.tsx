import React, { useState } from 'react';
import Logo from '../../../assets/svg/logo_white.svg'
import { useForm } from 'hooks/useForm';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state';
import { updateUserHasWallet, updateUserVault } from 'state/user/actions';
import { encryptObject } from 'utils/Encrypter';
// import { Wallet } from "ethers";
import { ArrowLeft, Checkbox, CheckboxContainer, Container, ContainerTitle, ErrorDiv, FormColumn, FormRow, LabelBack, LogoStakenet, StyledLink, ContainerActions, Button, InputField } from '../styleds';
import { addKeyring } from 'state/keyring/actions';
import { createNewKeyring } from 'utils/keyring';
import { validatePasswords } from '../../../utils/validation';

export default function ConfirmPassword() {
  const dispatch = useDispatch<AppDispatch>()

  const [formValues, handleInputChange]: any = useForm({
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const [isWaiting, setIsWaiting] = useState(false);

  const { password, confirmPassword, acceptTerms } = formValues

  const [error, setError] = useState('');

  const history = useHistory()

  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    setError('');
    const validationError = validateForm();
    if (!validationError) {
      const keyring = createNewKeyring()
      // Create the wallet when needed 
      // const wallet = Wallet.fromMnemonic(keyring.data.mnemonic, keyring.data.hdPath)
      encryptObject(password, keyring)
        .then((vault: string) => {
          dispatch(updateUserVault({ vault: vault }))
          dispatch(updateUserHasWallet({ hasWallet: true }))
          dispatch(addKeyring({ keyring: keyring }))
          history.push("/wallet/seed-phrase")
        }).catch((error: Error) => {
          setError(error.message);
          setIsWaiting(false);
        })
    } else {
      setError(validationError)
      setIsWaiting(false)
    }
  }

  const validateForm = () => {
    const validationError = validatePasswords(password, confirmPassword)
    if (validationError) {
      return validationError
    } else if (!acceptTerms) {
      return "You must Agree Terms & Coditions"
    } else {
      return ""
    }
  }

  return (
    <Container>
      <StyledLink to={{ pathname: "/wallet/add-wallet" }}>
        <LabelBack><ArrowLeft></ArrowLeft>Back</LabelBack>
      </StyledLink>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Create Password</ContainerTitle>
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
            <InputField
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
            />
            <CheckboxContainer>
              <Checkbox type="checkbox" name="acceptTerms" checked={acceptTerms} onChange={handleInputChange} />
                I Agree Terms & Coditions
            </CheckboxContainer>
            {(error) ? (<ErrorDiv width="250px"> {error} </ErrorDiv>) : ''}
          </FormColumn>
        </FormRow>
        <ContainerActions>
          <Button type="submit" disabled={isWaiting} >Next</Button>
        </ContainerActions>
      </form>
    </Container>
  )
}