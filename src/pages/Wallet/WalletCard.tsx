import React from 'react'
import { Currency, TokenAmount } from '@uniswap/sdk'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Text } from 'rebass'
import { TruncatedText, WalletCardWrapper } from './styleds'
import GlowingCurrencyLogo from 'components/CurrencyLogo/GlowingCurrencyLogo'
import { useUsdEquivalent } from 'hooks/Trades'




interface WalletCardProps {
    tokenAmount: TokenAmount,
    onTradePressed: (currency: Currency) => void,
    onPoolPressed: (currency: Currency) => void,
}

export default function WalletCard({
    tokenAmount,
    onTradePressed,
    onPoolPressed,
}: WalletCardProps) {

  const usdEquivalency = useUsdEquivalent(tokenAmount)
  return (
    <WalletCardWrapper gap="lg">
        <AutoRow>
            <AutoColumn gap="8px">
                <Text fontSize={18} fontWeight={500}>
                    {tokenAmount.currency.symbol}
                </Text>
                <TruncatedText fontSize={24} fontWeight={500}>
                    {tokenAmount.toSignificant(6)}
                </TruncatedText>
                <Text fontSize={14} fontWeight={300}>
                    {usdEquivalency}
                </Text>
            </AutoColumn>
            <GlowingCurrencyLogo currency={tokenAmount.currency} size="100px" hexRounding="md"/>
        </AutoRow>
        <AutoRow>

        </AutoRow>
    </WalletCardWrapper>
  )
}
