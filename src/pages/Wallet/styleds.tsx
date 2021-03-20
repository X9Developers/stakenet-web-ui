import { Text } from 'rebass'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'

export const WalletCardWrapper = styled(AutoColumn)`
  position: relative;
  background: ${({ theme }) => `linear-gradient(to right, ${theme.bg4}, ${theme.bg5});`};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 5px;
  padding: 18px;
  padding-top: 28px;
  padding-bottom: 28px;
  width: 100%;
  height: 326px;

  &.wallet-card > .wallet-card-top-row > .glowing-currency-logo {
    transition: all 300ms;
    transform-origin: center right;
  }
  &.wallet-card:hover > .wallet-card-top-row > .glowing-currency-logo {
    transform: scale(0.6);
  }

  &.wallet-card > .wallet-card-top-row > .wallet-card-text-info {
    transition: all 300ms;
    transform-origin: center left;
  }
  &.wallet-card:hover > .wallet-card-top-row > .wallet-card-text-info {
    transform: scale(0.8);
  }

  &.wallet-card > .wallet-card-top-row {
    transition: all 300ms;
    height: 270px;
  }
  &.wallet-card:hover > .wallet-card-top-row {
    height: 150px;
  }
  &.wallet-card:hover > .wallet-card-bottom-section {
    opacity: 1;
    bottom: 0;
    pointer-events: auto;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 220px;
    padding-top: 0px;
    &.wallet-card > .wallet-card-top-row > .glowing-currency-logo {
      transition: none 300ms;
      transform: scale(0.6);
    }

    &.wallet-card > .wallet-card-top-row > .wallet-card-text-info {
      transition: none 300ms;
    }
    &.wallet-card:hover > .wallet-card-top-row > .wallet-card-text-info {
      transform: scale(1);
    }

    &.wallet-card > .wallet-card-top-row {
      transition: none 300ms;
      height: 120px;
    }
    &.wallet-card:hover > .wallet-card-top-row {
      height: 70px;
      bottom: 0;
      opacity: 1;
      pointer-events: auto;
    }
    &.wallet-card > .wallet-card-bottom-section {
      transform: none;
      height: 70px;
      opacity: 1;
      bottom: 0;
      pointer-events: auto;
    }
`};
`

export const WalletCardBottomSection = styled(AutoColumn)`
  opacity: 0;
  height: 110px;
  transition: all 300ms;
  position: absolute;
  bottom: -50px;
  left: 0px;
  right: 0px;
  pointer-events: none;
  padding-left: 36px;
  padding-right: 36px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    opacity: 1;
    pointer-events: auto;
  `};
`

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  flex: 1;
  overflow: hidden;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
