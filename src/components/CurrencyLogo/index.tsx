import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const HexWrapper = styled.div<{ size: string, hexRounding: 'none' | 'sm' | 'md' | 'lg', glow: boolean }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  ${({ glow, size, hexRounding }) => glow ? `
    position: absolute;
    width: ${size};
    height: ${size};
    top: 0;
    left: 0;
  ` : `
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    filter: ${(hexRounding === 'none' ? '' : `url('#hexRounding${hexRounding.toUpperCase()}')`)};
  `};
`

const StyledEthereumLogo = styled.img<{ size: string, glow: boolean }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  ${({ glow, size }) => glow ? `
    position: absolute;
    width: calc(${size} * 1.3);
    height: calc(${size} * 1.3);
    top: calc(${size} * -0.15);
    left: calc(${size} * -0.15);
    opacity: 0.7;
    filter: blur(calc(${size} * 0.35));
    border-radius: calc(${size} * 0.65);
  ` : `
    clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  `};
`

const StyledLogo = styled(Logo)<{ size: string, glow: boolean }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  background-color: ${({ theme }) => theme.white};
  ${({ glow, size }) => glow ? `
    position: absolute;
    width: calc(${size} * 1.3);
    height: calc(${size} * 1.3);
    top: calc(${size} * -0.15);
    left: calc(${size} * -0.15);
    opacity: 0.7;
    filter: blur(calc(${size} * 0.35));
    border-radius: calc(${size} * 0.65);
  ` : `
    clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  `};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  hexRounding = 'none',
  style,
  glow = false,
}: {
  currency?: Currency
  size?: string
  hexRounding?: 'none' | 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
  glow?: boolean
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  return (
    <HexWrapper size={size} hexRounding={hexRounding} style={style} glow={glow}>
      { currency === ETHER ?
        <StyledEthereumLogo src={EthereumLogo} size={size} style={style} glow={glow} /> :
        <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} glow={glow} />
      }
    </HexWrapper>
  )
}
