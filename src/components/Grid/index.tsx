import styled from 'styled-components'

export const GridPageWrapper = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  cardWidth?: string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  padding-top: 150px;
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  grid-template-columns: ${({ cardWidth }) => `repeat(auto-fit, minmax(${cardWidth ?? 350}px, 1fr))`};
  justify-items: ${({ justify }) => justify && justify};
`
