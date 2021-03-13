import { Trade, TradeType } from '@uniswap/sdk'
import { SwapTopSection } from 'components/SwapWrappers'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencySwapPreviewPanel from './CurrencySwapPreviewPanel'
import SwapPreviewMultiChevron from './SwapPreviewMultiChevron'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  acceptChangesRequired,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  acceptChangesRequired: boolean
}) {
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn style={{ marginTop: '20px' }}>
      <SwapTopSection id='swap-top-section' minHeight={280}>
        <CurrencySwapPreviewPanel
          field={Field.INPUT}
          currencyAmount={trade.inputAmount}
          priceColor={
            acceptChangesRequired && trade.tradeType === TradeType.EXACT_OUTPUT
              ? theme.primary1
              : ''
          }
        />
        <SwapPreviewMultiChevron />
        <CurrencySwapPreviewPanel
          field={Field.OUTPUT}
          currencyAmount={trade.outputAmount}
          priceColor={
            priceImpactSeverity > 2
              ? theme.red1
              : acceptChangesRequired && trade.tradeType === TradeType.EXACT_INPUT
              ? theme.primary1
              : ''
          }
        />
      </SwapTopSection>
    </AutoColumn>
  )
}
