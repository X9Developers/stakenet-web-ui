import React from 'react'

import { useSyntheticWallet } from '../../state/wallet/hooks'

import { GridPageWrapper } from 'components/Grid'
import WalletCard from './WalletCard'

export default function Wallet() {
  // const syntheticPairs = useSyntheticLiquidityPairs()
  const syntheticWalletTokens = useSyntheticWallet()

  return (
    <>
      <GridPageWrapper gap="lg" justify="center" cardWidth="350">
        { syntheticWalletTokens.map((tokenAmount, index) => (
          <WalletCard
            key={ index }
            tokenAmount={ tokenAmount }
            onTradePressed={ (currency) => console.log('Trade Currency: ', currency) }
            onPoolPressed={ (currency) => console.log('Pool Currency: ', currency) }
          />
        ))}
      </GridPageWrapper>
    </>
  )
}
