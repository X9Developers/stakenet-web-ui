import styled from 'styled-components'

export const SwapTopSection = styled.div<{minHeight: number}>`
display: flex;
flex: 1;
flex-direction: row;
min-height: ${({ minHeight }) => minHeight}px;
width: 100%;
padding: 0px 32px;
justify-content: space-around;
align-items: center;

${({ theme }) => theme.mediaWidth.upToSmall`
    display: grid;
    grid-auto-rows: auto;
    grid-auto-columns: 1fr;
    grid-row-gap: 12px;
    justify-items: center;
    align-items: center;
    padding: 16px;
    margin-bottom: 32px;
`};
`

export const SwapBottomSectionFiller = styled.div`
width: 100%;
height: 320px;
${({ theme }) => theme.mediaWidth.upToSmall`
    height: 250px;
`};
`

export const SwapBottomSection = styled.div<{ trade: boolean, previewing: boolean }>`
transition: all 600ms;
position: absolute;
top: ${({previewing}) => previewing ? '0px' : 'calc(100% - 320px)'};
left: 0px;
right: 0px;
bottom: 0px;
display: flex;
flex: 1;
padding: 0px 24px;
padding-bottom: ${({ trade, previewing }) => (previewing ? 40 : trade ? (320 / 2) - 90 : (320 / 2) - 30)}px;
flex-direction: column;
width: 100%;
min-height: ${((700 - 60) / 2)}px;
justify-content: flex-end;
align-items: center;
background: ${({ theme }) => `linear-gradient(to right, ${theme.bg4}, ${theme.bg5}, ${theme.bg4});`};
z-index: 2;
overflow: hidden;
${({ theme, previewing }) => theme.mediaWidth.upToSmall`
    top: ${previewing ? '0px' : 'calc(100% - 250px)'};
    padding-bottom: 40px;
    min-height: 250px;
`};
`

export const SwapBottomRevealable = styled.div<{ previewing: boolean }>`
transition: all 600ms;
position: absolute;
top: 0;
left: 0;
right: 0;
display: grid;
opacity: ${({ previewing: expanded }) => expanded ? 1 : 0};
`

export const PercButton = styled.button<{ selected: boolean }>`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding-left: 6px;
  padding-right: 6px;
  line-height: 26px;
  flex: 1;
  margin: 6px;

  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  :disabled {
    opacity: 0.4;
    cursor: auto; 
    &:hover {
      border: 1px solid ${({ theme }) => theme.primary5};
    }
  }
`
