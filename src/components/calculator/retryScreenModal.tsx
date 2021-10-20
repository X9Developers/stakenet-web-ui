import React from 'react';
import { ModalContainer, TextLabel } from './styleds';
import Modal from '../../components/Modal/index';
import { RowBetween } from 'components/Row';
import { PaddedColumn, Separator } from 'components/SearchModal/styleds';
import { CloseIcon } from 'theme';
import { Text } from 'rebass'
import { ButtonLight } from 'components/Button';
import Row from 'components/Row';

interface RetryScreenModalProps {
  onDismiss: () => void
  retry?: () => void
  modalOpen: boolean
  title?: string
  error: string
  senderChain: string
  receiverChain: string
  addressAccount: string
}

export const RetryScreenModal = ({ onDismiss, modalOpen, retry, title, error, senderChain, receiverChain, addressAccount }: RetryScreenModalProps) => {

  const handleRetry = () => {
    onDismiss()
    if (retry) {
      retry()
    }
  }

  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={40}>
      <ModalContainer>
        <PaddedColumn gap="20px">
          <RowBetween>
            <Text fontWeight={500} fontSize={18}>
              {(title) ? title : 'Error Setup'}
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Separator />
          <Text fontWeight={500} fontSize={14} color={"#FD4040"} textAlign={'center'}>
            {error}
          </Text>
          <Separator />
          {(retry) && <ButtonLight onClick={handleRetry}>Retry</ButtonLight>}
          <Separator />
          <Row justify={"space-evenly"}>
            <Text fontWeight={500} fontSize={16}>
              {senderChain}
            </Text>
            <Text fontWeight={500} fontSize={16}>
              {"->"}
            </Text>
            <Text fontWeight={500} fontSize={16}>
              {receiverChain}
            </Text>
          </Row>
          {(addressAccount) &&
            <>
              <Separator />
              <Text fontWeight={500} fontSize={16}>
                {"Receiver Address:"}
              </Text>
              <TextLabel  >
                {addressAccount}
              </TextLabel>
            </>
          }
        </PaddedColumn>
      </ModalContainer>
    </Modal >
  )
}
