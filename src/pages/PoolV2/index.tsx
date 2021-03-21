import React from 'react'

import { useSyntheticPools } from '../../state/wallet/hooks'

import { GridPageWrapper } from 'components/Grid'
import PoolCard from './PoolCard'
import LiquidityInfoCard from './LiquidityInfoCard'

export default function PoolV2() {
  const syntheticPools = useSyntheticPools()

  return (
    <GridPageWrapper gap="36px" justify="center" cardWidth="360">
      <LiquidityInfoCard/>
      { syntheticPools.map((pool, index) => (
        <PoolCard
          key={ index }
          pair={ pool }
        />
      ))}
    </GridPageWrapper>
  )
}
