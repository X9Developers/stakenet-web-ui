import { CurrencyAmount } from '@uniswap/sdk'
import { useUsdEquivalent } from 'hooks/Trades'
import React, { useEffect } from 'react'
import styled from 'styled-components'

const InvisDiv = styled.div`
  width: 0px;
  height: 0px;
  pointer-events: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`

interface USDTokenBalanceAccumulatorProps {
  currencyAmount: CurrencyAmount | undefined
  incrementUSDWalletBalance: (usdIncrementor: CurrencyAmount | undefined) => void
  decrementUSDWalletBalance: (usdDecrementor: CurrencyAmount | undefined) => void
}

export default function USDTokenBalanceAccumulator({ currencyAmount, incrementUSDWalletBalance, decrementUSDWalletBalance }: USDTokenBalanceAccumulatorProps) {
  const usdEquivalent = useUsdEquivalent(currencyAmount)
  useEffect(() => {
    const updaterInterval = setInterval(() => {
      console.log(currencyAmount?.currency.name, currencyAmount, usdEquivalent)
      incrementUSDWalletBalance(usdEquivalent)
    }, 3000)
    return () => clearInterval(updaterInterval)
  }, [usdEquivalent, currencyAmount?.currency.name, currencyAmount?.raw])
  return <InvisDiv/>
}
