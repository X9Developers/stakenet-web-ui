import React from 'react';
import { ModalContainer, CurrencyListItem, ColumnListItem, LogoInputCurrency } from './styleds';
import Modal from '../../components/Modal/index';
import { RowBetween } from 'components/Row';
import { PaddedColumn, Separator } from 'components/SearchModal/styleds';
import { CloseIcon } from 'theme';
import { Text } from 'rebass'
import Column from 'components/Column';
import { TradingPair, tradingPairDictionaty, tradingPairsStr } from 'constants/liquidity-pool/tradingPairs';

interface InputTradingPairsModalProps {
  onDismiss: () => void
  modalOpen: boolean
  tradingPairs: tradingPairDictionaty<TradingPair>
  tradingPair: TradingPair
  handletradingPair: (index: TradingPair) => void
}

export const InputTradingPairsModal = ({ onDismiss, modalOpen, tradingPairs, tradingPair, handletradingPair }: InputTradingPairsModalProps) => {
  return (
    <Modal isOpen={modalOpen} onDismiss={onDismiss} maxHeight={80} minHeight={40}>
      <ModalContainer>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select a Trading Pair
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </PaddedColumn>
        <Separator />
        <ColumnListItem>
          {
            Object.entries(tradingPairs).map(([key, pair]) => (
              < div key={key}
                onClick={
                  (tradingPair !== pair)
                    ?
                    () => {
                      handletradingPair(pair);
                      onDismiss();
                    }
                    : undefined
                }>
                <CurrencyListItem disabled={(tradingPair === pair)}>
                  <div>
                    <LogoInputCurrency src={pair.principalCurrency.logo!} alt={""} width={'30px'} height={'30px'} />
                    <LogoInputCurrency src={pair.secondaryCurrency.logo!} alt={""} width={'30px'} height={'30px'} />
                  </div>
                  <Column>
                    <Text fontWeight={500} fontSize={20}>
                      {tradingPairsStr(pair)}
                    </Text>
                  </Column>
                </CurrencyListItem>
                <Separator />
              </div>
            ))
          }
        </ColumnListItem>
      </ModalContainer>
    </Modal >
  )
}
