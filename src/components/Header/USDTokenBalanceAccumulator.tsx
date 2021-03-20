import { CurrencyAmount } from '@uniswap/sdk'
import { ONE_HUNDRED_TWO_PERCENT } from '../../constants/index'
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
  incrementUSDWalletBalance: (adjustment: CurrencyAmount | undefined) => void
  decrementUSDWalletBalance: (amount: CurrencyAmount | undefined) => void
}

export default function USDTokenBalanceAccumulator({ currencyAmount, incrementUSDWalletBalance, decrementUSDWalletBalance }: USDTokenBalanceAccumulatorProps) {
  const usdEquivalent = useUsdEquivalent(currencyAmount)
  const [prevUsdEquivalent, setPrevUsdEquivalent] = React.useState<CurrencyAmount | undefined>(undefined)
  useEffect(() => {
    if (prevUsdEquivalent == null && usdEquivalent != null) {
      setPrevUsdEquivalent(usdEquivalent)
      incrementUSDWalletBalance(usdEquivalent)
    }
    const updaterInterval = setInterval(() => {
      if (prevUsdEquivalent != null && usdEquivalent != null) {
        if (usdEquivalent.divide(prevUsdEquivalent).greaterThan(ONE_HUNDRED_TWO_PERCENT)) {
          incrementUSDWalletBalance(usdEquivalent.subtract(prevUsdEquivalent))
        } else if (prevUsdEquivalent.divide(usdEquivalent).greaterThan(ONE_HUNDRED_TWO_PERCENT)) {
          decrementUSDWalletBalance(prevUsdEquivalent.subtract(usdEquivalent))
        }
        setPrevUsdEquivalent(usdEquivalent)
      }
    }, 3000)
    return () => {
      clearInterval(updaterInterval)
      if (usdEquivalent != null) {
        decrementUSDWalletBalance(usdEquivalent)
      }
    }
  }, [usdEquivalent, currencyAmount?.currency.name])
  return <InvisDiv/>
}
