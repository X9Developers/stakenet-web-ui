import React from 'react';
import Logo from '../../../assets/svg/logo_white.svg'
import { Container, LogoStakenet, ContainerTitle, StyledLink, ContainerActions, Button, ContainerText } from '../styleds';

export default function AddWallet() {
  return (
    <Container>
      <LogoStakenet src={Logo} alt="logo" />
      <ContainerTitle>Welcome to Stakenet</ContainerTitle>
      <ContainerText>Register a new Wallet or recover an existing wallet</ContainerText>
      <ContainerActions>
        <StyledLink to={{ pathname: "/wallet/confirm-password" }}>
          <Button>Register</Button>
        </StyledLink>
        <StyledLink to={{ pathname: "/wallet/restore-wallet" }}>
          <Button>Recover</Button>
        </StyledLink>
      </ContainerActions>
    </Container>
  )
}
