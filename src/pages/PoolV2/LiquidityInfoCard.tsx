import { AutoColumn } from 'components/Column'
import React from 'react'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { LiquidityInfoCardWrapper, LiquidityInfoCardBackground, LiquidityInfoRevealableWrapper } from './styleds'
import { ButtonPrimary } from 'components/Button'
import { AutoRow } from 'components/Row'

export default function LiquidityInfoCard() {
  return (
    <LiquidityInfoCardWrapper className="pair-info-card" gap="lg">
        <LiquidityInfoCardBackground className="pair-info-img-background"/>
        <AutoColumn className="pair-info-text" justify="center" gap="sm" style={{ placeItems: 'center' }}>
            <Text fontSize={24} fontWeight={500} textAlign='center'>
                Stakenet Liquidity
            </Text>
            <Text fontSize={14} textAlign='center'>
                Liquidity providers and orderbook hosting masternodes split the 0.3% trading fee. At the current dex volume, liquidity providers earn 67.5% of the fee. Liquidity, volume, and fees are shared between the web app and light wallet dexes.
            </Text>
        </AutoColumn>
        <LiquidityInfoRevealableWrapper className="pair-info-revealable-button-row" justify="center">
            <AutoRow justify='space-between' gap='md'>
                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/onramp`}
                    width="48%"
                >
                    Create A Pair
                </ButtonPrimary>
                <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/onramp`}
                    width="48%"
                >
                    Add Liquidity
                </ButtonPrimary>
            </AutoRow>
        </LiquidityInfoRevealableWrapper>
    </LiquidityInfoCardWrapper>
  )
}
