import { AutoColumn } from 'components/Column'
import React from 'react'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { OnRampWalletCardWrapper, OnRampCardBackground, OnRampRevealableWrapper } from './styleds'
import { ButtonPrimary } from 'components/Button'

export default function LiquidityInfoCard() {
  return (
    <OnRampWalletCardWrapper className="pool-info-card" gap="lg">
        <OnRampCardBackground className="pool-img-background"/>
        <AutoColumn className="pool-info-text" justify="center" gap="sm" style={{ placeItems: 'center' }}>
            <Text fontSize={24} fontWeight={500} textAlign='center'>
                Stakenet Liquidity
            </Text>
            <Text fontSize={14} textAlign='center'>
                Liquidity providers and orderbook hosting masternodes split the 0.3% trading fee. At the current dex volume, liquidity providers earn 67.5% of the fee. Liquidity, volume, and fees are shared between the web app and light wallet dexes.
            </Text>
        </AutoColumn>
        <OnRampRevealableWrapper className="pool-info-revealable-button-row" justify="center">
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
        </OnRampRevealableWrapper>
    </OnRampWalletCardWrapper>
  )
}
