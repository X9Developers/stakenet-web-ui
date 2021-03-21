import { AutoColumn } from 'components/Column'
import React from 'react'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { OnRampWalletCardWrapper, OnRampCardBackground, OnRampRevealableWrapper } from './styleds'
import { ButtonPrimary } from 'components/Button'

export default function OnRampWalletCard() {
  return (
    <OnRampWalletCardWrapper className="on-ramp-wallet-card" gap="lg">
        <OnRampCardBackground className="on-ramp-img-background"/>
        <AutoColumn className="on-ramp-text" justify="center" gap="lg" style={{ placeItems: 'center', zIndex: 2 }}>
            <Text fontSize={24} fontWeight={500} textAlign='center'>
                Layer 2 On-Ramp
            </Text>
            <Text fontSize={14} textAlign='center'>
                The Stakenet Dex exists entirely within layer 2 state channels. To use the Dex, first add funds to your Stakenet Layer 2 Wallet.
            </Text>
        </AutoColumn>
        <OnRampRevealableWrapper className="on-ramp-revealable-button" justify="center">
            <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                to={`/onramp`}
                width="48%"
            >
                On-Ramp Funds
            </ButtonPrimary>
        </OnRampRevealableWrapper>
    </OnRampWalletCardWrapper>
  )
}
