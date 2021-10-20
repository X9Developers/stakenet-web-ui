import React from 'react';
import { ButtonErrorScreen, ModalContainer } from './styleds';
import Modal from '../../components/Modal/index';
import { RowBetween } from 'components/Row';
import { PaddedColumn, Separator } from 'components/SearchModal/styleds';
import { CloseIcon } from 'theme';
import { Text } from 'rebass'
import errorIcon from '../../assets/monitor/error-icon.svg'

interface ErrorScreenModalProps {
  onDismiss: () => void
  modalOpen: boolean
  error: string
}

export const ErrorScreenModal = ({ onDismiss, modalOpen, error }: ErrorScreenModalProps) => {


  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={30}>
      <ModalContainer>
        <PaddedColumn gap="20px">
          <RowBetween>
            <Text fontWeight={500} fontSize={18}>
              Error
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Separator />
          <img src={errorIcon} alt={errorIcon} style={{ height: "90px", width: "90px", margin: "0 auto" }} />
          <Text fontWeight={500} textAlign={"center"} fontSize={14} color={"#FD4040"}>
            {error}
          </Text>
          <Separator />
          <ButtonErrorScreen onClick={onDismiss}>Close</ButtonErrorScreen>
        </PaddedColumn>
      </ModalContainer>
    </Modal >
  )
}
