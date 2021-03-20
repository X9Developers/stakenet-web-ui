import React from 'react'

import { useSyntheticWallet } from '../../state/wallet/hooks'

import { GridPageWrapper } from 'components/Grid'
import WalletCard from './WalletCard'

export default function Wallet() {
  const syntheticWalletTokens = useSyntheticWallet()

  return (
    <GridPageWrapper gap="36px" justify="center" cardWidth="360">
      { syntheticWalletTokens.map((currencyAmount, index) => (
        <WalletCard
          key={ index }
          currencyAmount={ currencyAmount }
          onTradePressed={ (currency) => console.log('Trade Currency: ', currency) }
          onPoolPressed={ (currency) => console.log('Pool Currency: ', currency) }
        />
      ))}
    </GridPageWrapper>
  )
}
