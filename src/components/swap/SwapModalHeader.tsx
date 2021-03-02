import { Trade, TradeType } from '@uniswap/sdk'
import { SwapTopSection } from 'components/SwapWrappers'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
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
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <SwapTopSection id='swap-top-section' minHeight={180}>
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
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
