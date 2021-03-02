import React from 'react'
import styled from 'styled-components'
import { ChevronRight } from 'react-feather'

const ChevronsWrapper = styled.div`
  width: 60px;
  min-width: 60px;
  height: 30px;
  position: relative;
  margin: 28px 48px;
`
const ChevronsGlow = styled.div`
    position: absolute;
    top: 0px;
    left: -15px;
    width: 90px;
    min-width: 90px;
    height: 30px;
    border-radius: 30px;
    filter: blur(20px);
    opacity: 0.4;
    background: white;
`
const Chevron = styled(ChevronRight)<{ index: number }>`
  width: 30px;
  height: 30px;
  position: absolute;
  left: ${({ index }) => ((index * 10) - 15)}px;
  top: 0px;
`

export default function SwapPreviewMultiChevron() {
  return (
    <ChevronsWrapper>
      <ChevronsGlow/>
      <Chevron index={0}/>
      <Chevron index={1}/>
      <Chevron index={2}/>
      <Chevron index={3}/>
      <Chevron index={4}/>
      <Chevron index={5}/>
    </ChevronsWrapper>
  )
}
