import React from 'react'

import { useSyntheticWallet } from '../../state/wallet/hooks'

import { GridPageWrapper } from 'components/Grid'
import WalletCard from './WalletCard'
import OnRampWalletCard from './OnRampWalletCard'

export default function Wallet() {
  const syntheticWalletTokens = useSyntheticWallet()

  return (
    <GridPageWrapper gap="36px" justify="center" cardWidth="360">
      <OnRampWalletCard/>
      { syntheticWalletTokens.map((currencyAmount, index) => (
        <WalletCard
          key={ index }
          currencyAmount={ currencyAmount }
        />
      ))}
    </GridPageWrapper>
  )
}
