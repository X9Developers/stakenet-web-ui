import React from 'react';
import { InputAmount, InputContainerCurrency, InputCurrency, ModalContainer } from './styleds';
import Modal from '../../components/Modal/index';
import { RowBetween } from 'components/Row';
import { PaddedColumn, Separator } from 'components/SearchModal/styleds';
import { CloseIcon } from 'theme';
import { Text } from 'rebass'
import { ButtonLight } from 'components/Button';

interface ConfirmInterchangeModalProps {
  onDismiss: () => void
  onInterchange: () => void
  modalOpen: boolean
  inputCurrency: string
  inputAmount: string
  outputCurrency: string
  outputAmount: string
}

export const ConfirmInterchangeModal = ({ onDismiss, modalOpen, inputCurrency, inputAmount, outputCurrency, outputAmount, onInterchange }: ConfirmInterchangeModalProps) => {

  const handleInterchange = () => {
    onDismiss()
    onInterchange()
  }

  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={40}>
      <ModalContainer>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={18}>
              Confirm Interchange
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Separator />
          <Text fontWeight={500} fontSize={16}>
            From:
          </Text>
          <InputContainerCurrency>
            <InputCurrency
              readOnly={true}
              value={inputAmount}
              type="text"
              placeholder="0.0"
              pattern="^[0-9]*[.]?[0-9]*$" />
            <InputAmount>
              {(inputCurrency) ? inputCurrency : '-'}
            </InputAmount>
          </InputContainerCurrency>
          <Text fontWeight={500} fontSize={16}>
            To:
          </Text>
          <InputContainerCurrency>
            <InputCurrency
              readOnly={true}
              value={outputAmount}
              type="text"
              placeholder="0.0"
              pattern="^[0-9]*[.]?[0-9]*$" />
            <InputAmount>
              {(outputCurrency) ? outputCurrency : '-'}
            </InputAmount>
          </InputContainerCurrency>
          <ButtonLight onClick={handleInterchange}>Confirm Interchange</ButtonLight>
        </PaddedColumn>
      </ModalContainer>
    </Modal >
  )
}
