import React, { useContext } from 'react'
import { Pair } from '@uniswap/sdk'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { TruncatedText, PairCardBottomSection, PairCardWrapper, PairUsdValue } from './styleds'
import GlowingCurrencyLogo from 'components/CurrencyLogo/GlowingCurrencyLogo'
import { usePairUsdEquivalent } from 'hooks/Trades'
import { getUsdValue } from 'utils'
import { GradientDividerRow } from 'components/swap/styleds'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'

export default function PoolCard({
    pair,
}: {
    pair: Pair,
}) {
  const pairUsdEquivalency = usePairUsdEquivalent(pair)
  const theme = useContext(ThemeContext)

  return (
    <PairCardWrapper className="pair-card" gap="0px">
        <AutoColumn className="pair-card-currency-rows-wrapper" gap="0px" justify="flex-start">
            <AutoRow className="pair-card-currency-row-1" justify='flex-start'>
                <GlowingCurrencyLogo currency={pair.token0} size="110px" hexRounding="md"/>
                <AutoColumn gap="8px">
                    <Text fontSize={18} fontWeight={500} textAlign='left'>
                        {pair.token0.symbol}
                    </Text>
                    <TruncatedText style={{ flexShrink: 0 }} fontSize={24} fontWeight={500} textAlign='left'>
                        {pair.reserve0.toSignificant(6)}
                    </TruncatedText>
                </AutoColumn>
            </AutoRow>
            <AutoRow className="pair-card-plus-row" justify='center'>
                <Plus size="24" color={theme.text2} />
            </AutoRow>
            <AutoRow className="pair-card-currency-row-2" justify='flex-end'>
                <AutoColumn gap="8px">
                    <Text fontSize={18} fontWeight={500} textAlign='right'>
                        {pair.token1.symbol}
                    </Text>
                    <TruncatedText style={{ flexShrink: 0 }} fontSize={24} fontWeight={500} textAlign='right'>
                        {pair.reserve1.toSignificant(6)}
                    </TruncatedText>
                </AutoColumn>
                <GlowingCurrencyLogo currency={pair.token1} size="110px" hexRounding="md"/>
            </AutoRow>
        </AutoColumn>
        <PairUsdValue className="pair-usd-value" fontSize={16} fontWeight={300} textAlign='left'>
            { getUsdValue(pairUsdEquivalency) }
        </PairUsdValue>
        <PairCardBottomSection className="pair-card-bottom-section" gap="0px">
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
        </PairCardBottomSection>

    </PairCardWrapper>
  )
}
