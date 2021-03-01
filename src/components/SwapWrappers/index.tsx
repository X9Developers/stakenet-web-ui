import styled from 'styled-components'

export const SwapTopSection = styled.div`
display: flex;
flex: 1;
flex-direction: row;
width: 100%;
padding: 32px;
padding-top: 80px;
padding-bottom: 80px;
min-height: 400px;
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
