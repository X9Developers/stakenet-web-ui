import React, { useState } from 'react'
import { Button } from './styleds';
import Logo from '../../../assets/svg/logo_white.svg'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { updateUserOnBoarding, updateUserSeedPhraseBackup } from '../../../state/user/actions';
import { useHistory } from 'react-router';
import SeedPhraseInputGrid from 'components/SeedPhrase/SeedPhraseInputGrid';
import { Container, StyledLink, LabelBack, ArrowLeft, LogoStakenet, ContainerTitle, ErrorDiv, ContainerSubtitle, ContainerActions } from '../styleds';
import { KeyringState } from 'state/keyring/reducer';
import { validateSeedPhrase } from '../../../utils/validation';
import { NUMBER_OF_WORDS } from 'constants/seedPhrase';

export default function ConfirmSeedPhrase() {
  const dispatch = useDispatch<AppDispatch>()

  const keyringState: KeyringState = useSelector((state: AppState) => state.keyring)

  const history = useHistory()

  const [inputWords, setInputWords] = useState(new Array(NUMBER_OF_WORDS).fill(''))

  const [error, setError] = useState('');

  const [isWaiting, setIsWaiting] = useState(false);

  const handleInputWordChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = inputWords.map((word, i) => (i === index) ? e.target.value : word)
    setInputWords([...newArray])
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setError('')
    setIsWaiting(true)
    const validationError = validateForm()
    if (!validationError) {
      dispatch(updateUserOnBoarding({ onBoarding: true }))
      dispatch(updateUserSeedPhraseBackup({ seedPhraseBackup: true }))
      setIsWaiting(false)
      history.push("/wallet")
    } else {
      setError(validationError)
      setIsWaiting(false)
    }
  }

  const validateForm = () => {
    const validationError = validateSeedPhrase(inputWords);
    const seedPhrase = inputWords.join(' ')
    if (validationError) {
      return validationError
    } else if (!checkSeedPhrase(seedPhrase)) {
      return 'The seedPhrase is not correct'
    } else {
      return '';
    }
  }

  const checkSeedPhrase = (seedPhrase: string): boolean => seedPhrase === keyringState.keyring?.data.mnemonic

  return (
    <Container>
      <StyledLink to={{ pathname: "/wallet/seed-phrase" }}>
        <LabelBack><ArrowLeft></ArrowLeft>Back</LabelBack>
      </StyledLink>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Secret Phrase</ContainerTitle>
      <ContainerSubtitle>Type your secret phrase</ContainerSubtitle>
      <form onSubmit={handleSubmit}>
        <SeedPhraseInputGrid inputWords={inputWords} handleInputWordChange={handleInputWordChange} />
        {(error) ? (<ErrorDiv > {error} </ErrorDiv>) : ''}
        <ContainerActions flexDirection={'row'}>
          <Button type="submit" disabled={isWaiting}>Accept</Button>
        </ContainerActions>
      </form>
    </Container>
  )
}
