import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import Settings from 'components/Settings'
import { CardHeaderCloseIcon, StyledMenu } from 'components/Card/CardHeaderStyledComponents'

const StyledSwapHeader = styled.a<{ disabled: boolean }>`
  padding-left: 1.5rem;
  padding-right: 1rem;
  height: 60px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.text2};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`

const CloseIconWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  height: 35px;
  width: 35px;
`

export default function SwapHeader({
  inPreviewFlow = false,
  onCancelPreview,
}: {
  inPreviewFlow: boolean,
  onCancelPreview: () => void,
}) {
  return (
    <StyledSwapHeader disabled={!inPreviewFlow} onClick={onCancelPreview} id={'swap-cancel-preview-button'}>
      <RowBetween>
        <TYPE.black fontWeight={500}>{ inPreviewFlow ? 'Cancel' : 'Swap' }</TYPE.black>
        { inPreviewFlow
          ? <StyledMenu>
              <CloseIconWrapper >
                <CardHeaderCloseIcon/>
              </CloseIconWrapper>
            </StyledMenu>
          : <Settings />
        }
      </RowBetween>
    </StyledSwapHeader>
  )
}
