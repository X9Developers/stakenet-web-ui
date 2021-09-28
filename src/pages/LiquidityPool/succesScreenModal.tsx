import React from 'react';
import { MenuLinkItem, ModalContainer, TextLabel } from './styleds';
import Modal from '../../components/Modal/index';
import { RowBetween } from 'components/Row';
import { PaddedColumn, Separator } from 'components/SearchModal/styleds';
import { CloseIcon } from 'theme';
import { Text } from 'rebass'
import Row from 'components/Row';
import { Info } from 'react-feather';

interface SuccessScreenModalProps {
  onDismiss: () => void
  modalOpen: boolean
  message: string
  senderChain: string
  receiverChain: string
  addressAccount: string
  txUrl?: string
}

export const SuccessScreenModal = ({ onDismiss, modalOpen, message, senderChain, receiverChain, addressAccount, txUrl }: SuccessScreenModalProps) => {

  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={40}>
      <ModalContainer>
        <PaddedColumn gap="20px">
          <RowBetween>
            <Text fontWeight={500} fontSize={18}>
              Succces
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Separator />
          <Text fontWeight={500} fontSize={14} color={"#FD4040"}>
            {message}
          </Text>
          <Separator />
          <MenuLinkItem id="link" target="_blank" href={(txUrl) ? txUrl : "https://stakenet.io/"}>
            <Info size={14} />
            View Tx
          </MenuLinkItem>
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
          <Separator />
          <Text fontWeight={500} fontSize={16}>
            {"Receiver Address:"}
          </Text>
          <TextLabel  >
            {addressAccount}
          </TextLabel>
        </PaddedColumn>
      </ModalContainer>
    </Modal >
  )
}
