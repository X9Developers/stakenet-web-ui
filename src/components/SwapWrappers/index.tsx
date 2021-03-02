import styled from 'styled-components'

export const SwapTopSection = styled.div`
display: flex;
flex: 1;
flex-direction: row;
min-height: ${((700 - 60) / 2)}px;
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
`};
`

export const SwapBottomSectionFiller = styled.div`
width: 100%;
height: 320px;
`

export const SwapBottomSection = styled.div<{ expanded: boolean }>`
transition: all 300ms;
position: absolute;
top: ${({expanded}) => expanded ? '0px' : 'calc(100% - 320px)'};
left: 0px;
right: 0px;
bottom: 0px;
display: flex;
flex: 1;
flex-direction: column;
width: 100%;
padding: 0px 32px;
padding-top: 80px;
padding-bottom: 80px;
min-height: ${((700 - 60) / 2)}px;
justify-content: flex-end;
align-items: center;
background: ${({ theme }) => `linear-gradient(to right, ${theme.bg4}, ${theme.bg5}, ${theme.bg4});`};
z-index: 2;
`
