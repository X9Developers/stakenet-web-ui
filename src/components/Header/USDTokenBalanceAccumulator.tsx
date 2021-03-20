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
  adjustUSDWalletBalance: (adjustment: CurrencyAmount | undefined) => void
  subtractUSDWalletBalance: (amount: CurrencyAmount | undefined) => void
}

export default function USDTokenBalanceAccumulator({ currencyAmount, adjustUSDWalletBalance, subtractUSDWalletBalance }: USDTokenBalanceAccumulatorProps) {
  const usdEquivalent = useUsdEquivalent(currencyAmount)
  const [prevUsdEquivalent, setPrevUsdEquivalent] = React.useState<CurrencyAmount | undefined>(undefined)
  useEffect(() => {
    if (prevUsdEquivalent == null && usdEquivalent != null) {
      setPrevUsdEquivalent(usdEquivalent)
      adjustUSDWalletBalance(usdEquivalent)
    }
    const updaterInterval = setInterval(() => {
      if (prevUsdEquivalent != null && usdEquivalent != null && (usdEquivalent.divide(prevUsdEquivalent).greaterThan(ONE_HUNDRED_TWO_PERCENT) || prevUsdEquivalent.divide(usdEquivalent).greaterThan(ONE_HUNDRED_TWO_PERCENT))) {
        setPrevUsdEquivalent(usdEquivalent)
        adjustUSDWalletBalance(usdEquivalent.subtract(prevUsdEquivalent))
      }
    }, 3000)
    return () => {
      clearInterval(updaterInterval)
      if (usdEquivalent != null) {
        subtractUSDWalletBalance(usdEquivalent)
      }
    }
  }, [usdEquivalent, currencyAmount?.currency.name])
  return <InvisDiv/>
}
