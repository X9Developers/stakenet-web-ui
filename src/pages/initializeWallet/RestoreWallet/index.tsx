import { useForm } from 'hooks/useForm';
import Logo from '../../../assets/svg/logo_white.svg'
import React, { useState } from 'react'
import SeedPhraseInputGrid from 'components/SeedPhrase/SeedPhraseInputGrid';
import { useHistory } from 'react-router';
import { StyledLink, LabelBack, ArrowLeft, ContainerTitle, ContainerSubtitle, FormRow, FormColumn, InputField, Container, LogoStakenet, CheckboxContainer, Checkbox, ErrorDiv, Button, ContainerActions } from '../styleds';
import { AppDispatch, AppState } from 'state';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserHasWallet, updateUserOnBoarding, updateUserSeedPhraseBackup, updateUserVault } from 'state/user/actions';
import { addKeyring } from 'state/keyring/actions';
import { encryptObject } from 'utils/Encrypter';
import { createNewKeyring } from 'utils/keyring';
import { UserState } from 'state/user/reducer';
// import { Wallet } from '@ethersproject/wallet';
import { validatePasswords, validateSeedPhrase } from '../../../utils/validation';
import { NUMBER_OF_WORDS } from 'constants/seedPhrase';

export default function RestoreWallet() {

  const history = useHistory()

  const dispatch = useDispatch<AppDispatch>()

  const userState: UserState = useSelector((state: AppState) => state.user)

  const [formValues, handleInputChange]: any = useForm({
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const [error, setError] = useState('');

  const [inputWords, setInputWords] = useState(new Array(NUMBER_OF_WORDS).fill(''))

  const [isWaiting, setIsWaiting] = useState(false);

  const handleInputWordChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = inputWords.map((word, i) => (i === index) ? e.target.value : word)
    setInputWords([...newArray])
  }

  const { password, confirmPassword, acceptTerms } = formValues;

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setError("")
    setIsWaiting(true)
    const validationError = validateForm()
    if (!validationError) {
      const keyring = createNewKeyring()
      // Create the wallet when needed 
      // const wallet = Wallet.fromMnemonic(keyring.data.mnemonic, keyring.data.hdPath);
      encryptObject(password, keyring)
        .then((vault: string) => {
          dispatch(updateUserVault({ vault: vault }))
          dispatch(updateUserHasWallet({ hasWallet: true }))
          dispatch(updateUserOnBoarding({ onBoarding: true }))
          dispatch(updateUserSeedPhraseBackup({ seedPhraseBackup: true }))
          dispatch(addKeyring({ keyring: keyring }))
          setIsWaiting(false);
          history.push("/wallet")
        }).catch((error: Error) => {
          setError(error.message)
          setIsWaiting(false)
        })
    } else {
      setError(validationError)
      setIsWaiting(false)
    }
  }

  const validateForm = () => {
    const result = validatePasswords(password, confirmPassword)
    const validatedSeedPhrase = validateSeedPhrase(inputWords)
    if (result) {
      return result
    } else if (!acceptTerms) {
      return "You must Agree Terms & Coditions"
    } else if (validatedSeedPhrase) {
      return validatedSeedPhrase
    } else {
      return ""
    }
  }

  const returnTo = (userState.hasWallet) ? '/wallet/unlock' : '/wallet/add-wallet'

  return (
    <Container>
      <StyledLink to={{ pathname: returnTo }}>
        <LabelBack><ArrowLeft></ArrowLeft>Back</LabelBack>
      </StyledLink>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Secret Phrase</ContainerTitle>
      <ContainerSubtitle>Type your secret phrase</ContainerSubtitle>
      <form onSubmit={handleSubmit}>
        <SeedPhraseInputGrid inputWords={inputWords} handleInputWordChange={handleInputWordChange} />
        <FormRow>
          <FormColumn>
            <InputField
              type="password"
              placeholder="password"
              autoComplete="off"
              name="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
              value={password}
              onChange={handleInputChange}
            />
            <InputField
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              name="confirmPassword"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
              value={confirmPassword}
              onChange={handleInputChange}
            />
            <CheckboxContainer>
              <Checkbox type="checkbox" name="acceptTerms" checked={acceptTerms} onChange={handleInputChange} />
                I Agree Terms & Coditions
            </CheckboxContainer>
          </FormColumn>
        </FormRow>
        {(error) ? (<ErrorDiv> {error} </ErrorDiv>) : ''}
        <ContainerActions flexDirection={'row'}>
          <Button type="submit" disabled={isWaiting}  >Accept</Button>
        </ContainerActions>
      </form>
    </Container>

  )
}
