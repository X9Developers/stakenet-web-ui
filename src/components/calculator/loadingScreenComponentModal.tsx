import React from 'react';
import { ModalContainer } from './styleds';
import Modal from '../../components/Modal/index';
import { PaddedColumn } from 'components/SearchModal/styleds';
import { Text } from 'rebass'
import Loader from '../../components/Loader'

interface LoadingScreenComponentModalProps {
  onDismiss: () => void
  modalOpen: boolean
  title: string
  subtitle: string
}

export const LoadingScreenComponentModal = ({ onDismiss, modalOpen, title, subtitle }: LoadingScreenComponentModalProps) => {
  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={35}>
      <ModalContainer>
        <PaddedColumn gap="16px" justify={"center"}>
          <Loader size={"150px"} />
          <Text fontWeight={500} fontSize={20}>
            {title}
          </Text>
          <Text fontWeight={500} fontSize={16}>
            {subtitle}
          </Text>
        </PaddedColumn>
      </ModalContainer>
    </Modal >
  )
}
