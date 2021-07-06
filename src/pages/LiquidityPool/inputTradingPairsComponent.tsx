import React, { useCallback, useState } from 'react';
import { ContainerTradingPair, FormColumnCurrency, StyledDropDown, LogoInputCurrency } from './styleds';
import { AutoRow } from 'components/Row';
import Column from 'components/Column';
import { InputTradingPairsModal } from './inputTradingPairsModal';
import { TradingPair, tradingPairDictionaty, tradingPairsStr } from 'constants/liquidity-pool/tradingPairs';

interface InputTradingPairsComponentProps {
  tradingPairs: tradingPairDictionaty<TradingPair>
  handleInputCurrency: (value: TradingPair) => void
  tradingPair: TradingPair
}

export const InputTradingPairsComponent = ({ tradingPairs, handleInputCurrency, tradingPair }: InputTradingPairsComponentProps) => {

  const [modalOpen, setModalOpen] = useState(false)
  // const currentPair: TradingPair = tradingPairs[tradingPair]

  const handleDismiss = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <>
      <InputTradingPairsModal
        onDismiss={handleDismiss}
        modalOpen={modalOpen}
        tradingPairs={tradingPairs}
        handletradingPair={handleInputCurrency}
        tradingPair={tradingPair}
      ></InputTradingPairsModal>
      <FormColumnCurrency>
        <ContainerTradingPair onClick={() => setModalOpen(true)} type="button">
          <AutoRow justify='space-between'>
            <Column>
              <AutoRow style={{ gap: '20px' }}>
                <div>
                  <LogoInputCurrency src={tradingPair.principalCurrency.urlIcon} alt={""} width={'30px'} height={'30px'} />
                  <LogoInputCurrency src={tradingPair.secondaryCurrency.urlIcon} alt={""} width={'30px'} height={'30px'} />
                </div>
                <div >{tradingPairsStr(tradingPair)}</div>
              </AutoRow>
            </Column>
            <Column>
              <StyledDropDown disabled={false} selected={true} />
            </Column>
          </AutoRow>
        </ContainerTradingPair>
      </FormColumnCurrency>
    </ >
  )
}
