import React, { useState } from 'react'
import styled from 'styled-components'
import { ArrowLeft, ArrowRight } from 'react-feather'

const ArrowWrapper = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  margin: 28px;
  margin-bottom: 52px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 20px;
    margin-bottom: 20px;
  `};
`

const HexRounding = styled.div<{ border: boolean }>`
  position: absolute;
  top: ${({ border }) => border ? 0 : 2}px;
  left: ${({ border }) => border ? 0 : 2}px;
  width: ${({ border }) => border ? 120 : 116}px;
  height: ${({ border }) => border ? 120 : 116}px;
  filter: url('#hexRoundingLG');
`

const HexShape = styled.div<{ border: boolean }>`
  width: ${({ border }) => border ? 120 : 116}px;
  height: ${({ border }) => border ? 120 : 116}px;
  background: ${({ border, theme }) => border ? theme.primary1 : theme.bg1};
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
  display: grid;
  place-items: center;
`

const ArrowsBlur = styled.div`
    position: absolute;
    top: 50px;
    left: 40px;
    width: 40px;
    height: 20px;
    border-radius: 30px;
    filter: blur(20px);
    opacity: 0.4;
    background: white;
`

const ArrowsWrapper = styled.div<{ rotations: number }>`
    transition: all 400ms;
    position: relative;
    width: 30px;
    height: 30px;
    background: none;
    transform: rotate(${({ rotations }) => (rotations * 180)}deg);
    ${({ theme, rotations }) => theme.mediaWidth.upToSmall`
        transform: rotate(${(90 + (rotations * 180))}deg);
    `};
`

const StyledArrowLeft = styled(ArrowLeft)`
    position: absolute;
    top: 3px;
    left: -11px;
`
const StyledArrowRight = styled(ArrowRight)`
    position: absolute;
    top: -4px;
    left: 9px;
`

export default function BigSwapArrow({ onPress, disabled }: { onPress: () => void, disabled?: boolean }) {
  const [rotations, setRotations] = useState(0)

  const handlePress = () => {
    if (!disabled) {
      onPress()
      setRotations(rotations + 1)
    }
  }

  return (
    <ArrowWrapper onClick={handlePress}>
        <HexRounding border={true}>
            <HexShape border={true}/>
        </HexRounding>
        <HexRounding border={false}>
            <HexShape border={false}>
                <ArrowsBlur/>
                <ArrowsWrapper rotations={rotations}>
                    <StyledArrowLeft size={'32'} />
                    <StyledArrowRight size={'32'} />
                </ArrowsWrapper>
            </HexShape>
        </HexRounding>
    </ArrowWrapper>
  )
}
