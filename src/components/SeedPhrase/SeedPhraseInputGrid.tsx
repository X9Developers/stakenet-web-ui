import React from 'react'
import { GridContainer, GridItem, InputWord } from './styleds';

interface SeedPhraseInputGridProps {
  inputWords: string[]
  handleInputWordChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SeedPhraseInputGrid({ inputWords, handleInputWordChange }: SeedPhraseInputGridProps) {
  return (
    <GridContainer>
      {
        inputWords.map((word, index) => (
          <GridItem key={`word${index + 1}`}>
            <InputWord
              pattern="[a-zA-Z]*"
              name={`word${index + 1}`}
              placeholder={(index + 1).toString()}
              value={word}
              onChange={(e) => handleInputWordChange(index, e)}
            />
          </GridItem>
        ))
      }
    </GridContainer>
  )
}