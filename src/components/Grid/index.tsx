import { AutoColumn } from 'components/Column'
import styled from 'styled-components'

export const GridPageWrapper = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  cardWidth?: string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  padding-bottom: 60px;
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-auto-rows: auto;
  grid-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  grid-template-columns: ${({ cardWidth }) => `repeat(auto-fit, minmax(${cardWidth ?? 350}px, 1fr))`};
  justify-items: ${({ justify }) => justify && justify};
`

export const BaseWalletCardWrapper = styled(AutoColumn)`
  position: relative;
  background: ${({ theme }) => `linear-gradient(to right, ${theme.bg4}, ${theme.bg5});`};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 5px;
  padding: 18px;
  padding-top: 28px;
  padding-bottom: 28px;
  width: 100%;
  height: 326px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 220px;
  `};
`
