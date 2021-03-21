import { Text } from 'rebass'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import PairInfoBackgroundImage from '../../assets/images/liquidity-provider-info-background.png'
import { AutoRow } from 'components/Row'
import { BaseWalletCardWrapper } from 'components/Grid'

export const LiquidityInfoCardWrapper = styled(BaseWalletCardWrapper)`
  overflow: hidden;
  padding-left: 64px;
  padding-right: 64px;

  &.pair-info-card {
    .pair-info-text {
      transition: all 300ms;
      height: 250px;
    }
    .pair-info-revealable-button-row {
      transition: all 300ms;
      opacity: 0;
      bottom: -30px;
      pointer-events: none;
    }
  }
  &.pair-info-card:hover {
    .pair-info-text {
      height: 200px;
    }
    .pair-info-revealable-button-row {
      opacity: 1;
      bottom: 20px;
      pointer-events: auto;
    }
    .pair-info-img-background {
      transform: scale(1);
    }
  }

  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 240px;
    &.on-ramp-pair-card > .on-ramp-img-background {
      transform: scale(1);
    }
    &.on-ramp-pair-card > .on-ramp-text {
      transform: none 300ms;
      height: 120px;
    }
    &.on-ramp-pair-card > .on-ramp-revealable-button {
      transition: none 300ms;
      opacity: 1;
      bottom: 0px;
      pointer-events: auto;
    }
    &.on-ramp-pair-card:hover > .on-ramp-revealable-button {
      opacity: 1;
      bottom: 0px;
      pointer-events: auto;
    }
  `}
`

export const LiquidityInfoCardBackground = styled.image`
  background-image: url(${PairInfoBackgroundImage});
  opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover; /* or contain depending on what you want */
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 5px;
  transform: scale(1.2);
  transform-origin: top center;
  transition: all 300ms;
  pointer-events: none;
`

export const LiquidityInfoRevealableWrapper = styled(AutoRow)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 64px;
  padding-left: 36px;
  padding-right: 36px;
`



export const PairCardWrapper = styled(BaseWalletCardWrapper)`
  padding-left: 36px;
  padding-right: 36px;
  height: 325px;
  transition: all 300ms;

  &.pair-card {
    .pair-card-currency-rows-wrapper {
      height: 270px;
      transition: height 300ms;

      .pair-card-currency-row-1 {
        transition: all 300ms;
        height: 120px;
        transform-origin: top left;
        .glowing-currency-logo {
          transition: all 300ms;
          transform-origin: center right;
        }
      }

      .pair-card-currency-row-2 {
        transition: all 300ms;
        height: 120px;
        transform-origin: top right;
        .glowing-currency-logo {
          transition: all 300ms;
          transform-origin: center left;
        }
      }
    }

    .pair-usd-value {
      bottom: 16px;
    }
  }


  &.pair-card:hover {
    .pair-card-currency-rows-wrapper {
      height: 220px;

      .pair-card-currency-row-1 {
        transform: translateX(-40px) translateY(-15px);
        height: 64px;
        .glowing-currency-logo {
          transform: scale(0.7);
        }
      }

      .pair-card-currency-row-2 {
        transform: translateX(40px) translateY(-30px);
        height: 84px;
        .glowing-currency-logo {
          transform: scale(0.7);
        }
      }
    }

    .pair-usd-value {
      bottom: 76px;
    }
  }


  &.pair-card:hover > .pair-card-bottom-section {
    opacity: 1;
    bottom: 0;
    pointer-events: auto;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 0px;
    &.pair-card > .pair-card-currency-row > .glowing-currency-logo {
      transition: none 300ms;
      transform: scale(0.6);
    }

    &.pair-card > .pair-card-currency-row > .pair-card-text-info {
      transition: none 300ms;
    }
    &.pair-card:hover > .pair-card-currency-row > .pair-card-text-info {
      transform: scale(1);
    }

    &.pair-card > .pair-card-currency-row {
      transition: none 300ms;
      height: 120px;
    }
    &.pair-card:hover > .pair-card-currency-row {
      height: 70px;
      bottom: 0;
      opacity: 1;
      pointer-events: auto;
    }
    &.pair-card > .pair-card-bottom-section {
      transform: none;
      height: 70px;
      opacity: 1;
      bottom: 0;
      pointer-events: auto;
    }
`};
`

export const PairCardBottomSection = styled(AutoColumn)`
  opacity: 0;
  height: 60px;
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

export const PairUsdValue = styled(Text) `
  position: absolute;
  transition: all 300ms;
  left: 16px;
  bottom: 16px;
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
