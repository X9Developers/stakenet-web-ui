import React from 'react'
import { Button } from './styleds';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { updateUserOnBoarding } from 'state/user/actions';
import Logo from '../../../assets/svg/logo_white.svg'
import SeedPhraseGrid from 'components/SeedPhrase/SeedPhraseGrid';
import { Container, ContainerTitle, LogoStakenet, StyledLink, ContainerSubtitle, ContainerActions } from '../styleds';
import { KeyringState } from 'state/keyring/reducer';

export default function SeedPhrase() {
  const keyringState: KeyringState = useSelector((state: AppState) => state.keyring)

  const dispatch = useDispatch<AppDispatch>()

  const history = useHistory()

  const userSeedPhrase = keyringState.keyring?.data.mnemonic || ''

  const handleClick = () => {
    dispatch(updateUserOnBoarding({ onBoarding: true }))
    history.push("/wallet")
  }

  return (
    <Container>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Secret Phrase</ContainerTitle>
      <ContainerSubtitle>Save your secret phrase</ContainerSubtitle>
      <SeedPhraseGrid seedPhrase={userSeedPhrase} />
      <ContainerActions flexDirection={'row'}>
        <Button onClick={handleClick}>Remeber Later</Button>
        <StyledLink to={{ pathname: "/wallet/confirm-Seed-phrase" }}>
          <Button >Next</Button>
        </StyledLink>
      </ContainerActions>
    </Container>
  )
}
