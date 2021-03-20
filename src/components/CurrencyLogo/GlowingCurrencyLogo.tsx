import React from 'react'
import { Currency } from '@uniswap/sdk'
import styled from 'styled-components'
import CurrencyLogo from '.'


export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const Wrapper = styled.div`
position: relative;
`

const CurrencyLogoGlow = styled(CurrencyLogo)<{ size: string }>`
position: absolute;
width: ${({ size }) => size};
height: ${({ size }) => size};
top: 0;
left: 0;
opacity: 0.7;
filter: ${({ size }) => `blur(calc(${size} * 0.5))`};
border-radius: ${({ size }) => `calc(${size} * 0.5)`};
`

export default function GlowingCurrencyLogo({
  currency,
  size = '24px',
  hexRounding = 'none',
}: {
  currency?: Currency
  size?: string
  hexRounding?: 'none' | 'sm' | 'md' | 'lg'
}) {
  return (
    <Wrapper className="glowing-currency-logo">
        <CurrencyLogoGlow currency={currency} size={size} hexRounding={hexRounding} glow={true}/>
        <CurrencyLogo currency={currency} size={size} hexRounding={hexRounding}/>
    </Wrapper>
  )
}
