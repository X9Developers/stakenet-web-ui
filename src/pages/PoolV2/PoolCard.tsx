import React from 'react'
import { Pair } from '@uniswap/sdk'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { TruncatedText, WalletCardBottomSection, WalletCardWrapper } from './styleds'
import GlowingCurrencyLogo from 'components/CurrencyLogo/GlowingCurrencyLogo'
import { usePairUsdEquivalent } from 'hooks/Trades'
import { getUsdValue } from 'utils'
import { GradientDividerRow } from 'components/swap/styleds'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'

export default function PoolCard({
    pair,
}: {
    pair: Pair,
}) {

  const pairUsdEquivalency = usePairUsdEquivalent(pair)
  return (
    <WalletCardWrapper className="pool-card" gap="md">
        <AutoRow className="pool-card-top-row" justify='flex-start'>
            <AutoColumn gap="8px">
                <Text fontSize={18} fontWeight={500} textAlign='right'>
                    {pair.token0.symbol}
                </Text>
                <TruncatedText style={{ flexShrink: 0 }} fontSize={24} fontWeight={500} textAlign='right'>
                    {pair.reserve0.toSignificant(6)}
                </TruncatedText>
            </AutoColumn>
            <GlowingCurrencyLogo currency={pair.token0} size="120px" hexRounding="md"/>
        </AutoRow>
        <AutoRow className="pool-card-top-row" justify='flex-end'>
            <AutoColumn gap="8px">
                <Text fontSize={18} fontWeight={500} textAlign='left'>
                    {pair.token1.symbol}
                </Text>
                <TruncatedText style={{ flexShrink: 0 }} fontSize={24} fontWeight={500} textAlign='left'>
                    {pair.reserve1.toSignificant(6)}
                </TruncatedText>
            </AutoColumn>
            <GlowingCurrencyLogo currency={pair.token1} size="120px" hexRounding="md"/>
        </AutoRow>

        <Text fontSize={16} fontWeight={300} textAlign='right'>
            { getUsdValue(pairUsdEquivalency) }
        </Text>
        <WalletCardBottomSection className="pool-card-bottom-section" gap="0px">
            <GradientDividerRow width="100%" style={{ position: 'absolute', top: 0 }}/>
            <AutoRow justify='space-between' gap='md'>
                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/swap/${currencyId(pair.token0)}`}
                    width="48%"
                >
                    Remove
                </ButtonPrimary>

                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/pool/${currencyId(pair.token1)}`}
                    width="48%"
                >
                    Add
                </ButtonPrimary>
            </AutoRow>
        </WalletCardBottomSection>

    </WalletCardWrapper>
  )
}
