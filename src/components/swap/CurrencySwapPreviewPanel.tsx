import React from 'react'
import styled from 'styled-components'
import { Field } from 'state/swap/actions'
import { CurrencyAmount } from '@uniswap/sdk'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Text } from 'rebass'
import { TruncatedText } from './styleds'
import GlowingCurrencyLogo from 'components/CurrencyLogo/GlowingCurrencyLogo'

const ReversibleAutoRow = styled(AutoRow)<{ input: boolean }>`
    display: flex;
    flex-direction: ${({ input }) => input ? 'row' : 'row-reverse'};
    justify-content: flex-end;
    align-items: center;
    ${({ theme, input }) => theme.mediaWidth.upToSmall`
        flex-direction: ${input ? 'row-reverse' : 'row'};
    `};
`

const PaddedAutoColumn = styled(AutoColumn)<{ input: boolean}>`
    margin-left: ${({ theme, input }) => input ? '0px' : '28px'};
    margin-right: ${({ theme, input }) => input ? '28px' : '0px'};
    ${({ theme, input }) => theme.mediaWidth.upToSmall`
        margin-left: ${input ? '28px' : '0px'};
        margin-right: ${input ? '0px' : '28px'};
    `};
`

const AlignedText = styled(Text)<{ input: boolean }>`
    text-align: ${({ input }) => input ? 'right' : 'left'};
    ${({ theme, input }) => theme.mediaWidth.upToSmall`
        text-align: ${input ? 'left' : 'right'};
    `};
`
const AlignedTruncatedText = styled(TruncatedText)<{ input: boolean }>`
    text-align: ${({ input }) => input ? 'right' : 'left'};
    width: unset;
    max-width: 220px;
    ${({ theme, input }) => theme.mediaWidth.upToSmall`
        text-align: ${input ? 'left' : 'right'};
    `};
`

export default function CurrencySwapPreviewPanel({
    field,
    currencyAmount,
    priceColor,
}: {
    field: Field,
    currencyAmount: CurrencyAmount,
    priceColor: string,
}) {
  const input = field === Field.INPUT
  return (
    <ReversibleAutoRow input={input}>
        <PaddedAutoColumn input={input} gap="8px">
            <AlignedText fontSize={18} fontWeight={500} input={input}>
                {currencyAmount.currency.symbol}
            </AlignedText>
            <AlignedTruncatedText
                fontSize={24}
                fontWeight={500}
                input={input}
                color={priceColor}
            >
                {currencyAmount.toSignificant(6)}
            </AlignedTruncatedText>
            <AlignedText fontSize={14} fontWeight={300} input={input}>
                ${(parseFloat(currencyAmount.toExact()) * 1800).toFixed(2)} USD
            </AlignedText>
        </PaddedAutoColumn>
        <GlowingCurrencyLogo currency={currencyAmount.currency} size="100px" hexRounding="md"/>
    </ReversibleAutoRow>
  )
}
