import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  vertical?: boolean
}

export default function TradePrice({ price, showInverted, vertical, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const labels = showInverted
    ? [price?.quoteCurrency?.symbol, 'per', price?.baseCurrency?.symbol]
    : [price?.baseCurrency?.symbol, 'per', price?.quoteCurrency?.symbol]

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: vertical ? 'flex-end' : 'center', display: 'flex', flexDirection: vertical ? 'column' : 'row' }}
      textAlign={vertical ? 'right' : 'center'}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {vertical && <br/>} {labels.join(' ')}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
