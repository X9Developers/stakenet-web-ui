import React from 'react'
import { GridContainer, GridItem, Word } from './styleds';

interface SeedPhraseGridProps {
  seedPhrase: string
}

export default function SeedPhraseGrid({ seedPhrase }: SeedPhraseGridProps) {
  return (
    <GridContainer>
      {seedPhrase.split(' ').map((word) =>
        <GridItem key={word}>
          <Word>
            {word}
          </Word>
        </GridItem>
      )}
    </GridContainer>
  )
}