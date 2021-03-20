import React from 'react'
import { Currency, CurrencyAmount } from '@uniswap/sdk'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { TruncatedText, WalletCardBottomSection, WalletCardWrapper } from './styleds'
import GlowingCurrencyLogo from 'components/CurrencyLogo/GlowingCurrencyLogo'
import { useUsdEquivalent } from 'hooks/Trades'
import { getUsdValue } from 'utils'
import { GradientDividerRow } from 'components/swap/styleds'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'




interface WalletCardProps {
    currencyAmount: CurrencyAmount,
    onTradePressed: (currency: Currency) => void,
    onPoolPressed: (currency: Currency) => void,
}

export default function WalletCard({
    currencyAmount,
    onTradePressed,
    onPoolPressed,
}: WalletCardProps) {

  const usdEquivalency = useUsdEquivalent(currencyAmount)
  return (
    <WalletCardWrapper className="wallet-card" gap="lg">
        <AutoRow className="wallet-card-top-row" justify='space-between'>
            <AutoColumn gap="8px">
                <Text fontSize={18} fontWeight={500}>
                    {currencyAmount.currency.symbol}
                </Text>
                <TruncatedText style={{ flexShrink: 0 }} fontSize={24} fontWeight={500}>
                    {currencyAmount.toSignificant(6)}
                </TruncatedText>
                <Text fontSize={16} fontWeight={300}>
                    { getUsdValue(usdEquivalency) }
                </Text>
            </AutoColumn>
            <GlowingCurrencyLogo currency={currencyAmount.currency} size="140px" hexRounding="md"/>
        </AutoRow>
        <WalletCardBottomSection className="wallet-card-bottom-section" gap="0px">
            <GradientDividerRow width="100%" style={{ position: 'absolute', top: 0 }}/>
            <AutoRow justify='space-between' gap='md'>
                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/swap/${currencyId(currencyAmount.currency)}`}
                    width="48%"
                >
                    Swap
                </ButtonPrimary>

                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/pool/${currencyId(currencyAmount.currency)}`}
                    width="48%"
                >
                    Pool
                </ButtonPrimary>
            </AutoRow>
        </WalletCardBottomSection>

    </WalletCardWrapper>
  )
}
