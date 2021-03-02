import { Currency, Pair, Trade } from '@uniswap/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { lighten } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'
import { AutoColumn } from 'components/Column'
import TradePrice from 'components/swap/TradePrice'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ disabled: boolean, selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const CurrencyPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  flex: 1;
  max-width: 420px;
  min-width: 300px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    min-width: 100%;
    max-width: initial;
  `};
`

const CurrencySelector = styled.button<{ selected: boolean }>`
  align-items: center;
  justify-content: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => (theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 8px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 1rem;
  height: 85px;

  :focus,
  :hover {
    background-color: ${({ theme }) => (lighten(0.05, theme.primary1))};
  }
`

const PercButton = styled.button<{ selected: boolean }>`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding-left: 6px;
  padding-right: 6px;
  line-height: 26px;
  flex: 1;
  margin: 6px;

  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  :disabled {
    opacity: 0.4;
    cursor: auto; 
    &:hover {
      border: 1px solid ${({ theme }) => theme.primary5};
    }
  }
`

const BottomSectionRow = styled(AutoRow)`
  height: 40px;
`

const EmptyPercButtonRow = styled.div`
  width: 100%;
  height: 40px;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
  flex: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary1};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  ' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`
const CurrencyAndBalanceText = styled.div`
  margin: 0 0.25rem 0 1rem;
  text-align: left;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onSetPerc?: (value: number) => void
  showPercButtons: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  trade?: Trade
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onSetPerc,
  showPercButtons,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  trade,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <CurrencyPanel>
      <AutoColumn gap='sm'>
        <CurrencySelector 
          selected={!!currency}
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setModalOpen(true)
            }
          }}
          id={id + '_selector'}>
          <AutoRow justify='space-between'>
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'48px'} hexRounding={'sm'} />
              ) : null}
              <CurrencyAndBalanceText>
                <AutoColumn gap='sm'>
                  {pair ? (
                    <StyledTokenName className="pair-name-container">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </StyledTokenName>
                  ) : (
                    <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          '...' +
                          currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || t('selectToken')}
                    </StyledTokenName>
                  )}
                  {account && (
                    <TYPE.body
                      color={theme.text2}
                      fontWeight={500}
                      fontSize={14}
                      style={{ display: 'inline' }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance
                        ? selectedCurrencyBalance?.toSignificant(6)
                        : ' -'}
                    </TYPE.body>
                  )}
                </AutoColumn>
              </CurrencyAndBalanceText>
            </Aligner>
            <StyledDropDown disabled={disableCurrencySelect} selected={!!currency} />
          </AutoRow>
        </CurrencySelector>
        <InputPanel id={id}>
          <Container hideInput={hideInput}>
            <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
              {!hideInput && (
                <>
                  <NumericalInput
                    className="token-amount-input"
                    value={value}
                    onUserInput={val => {
                      onUserInput(val)
                    }}
                  />
                  {/* {account && currency && showMaxButton && label !== 'To' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )} */}
                </>
              )}
            </InputRow>
          </Container>
          {!disableCurrencySelect && onCurrencySelect && (
            <CurrencySearchModal
              isOpen={modalOpen}
              onDismiss={handleDismissSearch}
              onCurrencySelect={onCurrencySelect}
              selectedCurrency={currency}
              otherSelectedCurrency={otherCurrency}
              showCommonBases={showCommonBases}
            />
          )}
        </InputPanel>
        <BottomSectionRow justify="space-between">
        { showPercButtons
          ? <>
              <PercButton
                disabled={!account || !currency}
                onClick={() => onSetPerc != null && onSetPerc(0)}
                selected={false}
                >
                  MIN
              </PercButton>
              <PercButton
                disabled={!account || !currency}
                onClick={() => onSetPerc != null && onSetPerc(0.5)}
                selected={false}
                >
                  HALF
              </PercButton>
              <PercButton
                disabled={!account || !currency}
                onClick={() => onSetPerc != null && onSetPerc(1)}
                selected={false}
                >
                  MAX
              </PercButton>
            </>
          : Boolean(trade)
          ? <>
              <Text fontWeight={500} fontSize={14} color={theme.text2}>
                Price
              </Text>
              <TradePrice
                price={trade?.executionPrice}
                showInverted={showInverted}
                setShowInverted={setShowInverted}
              />
            </>
          : <EmptyPercButtonRow/>
        }
        </BottomSectionRow>
      </AutoColumn>
    </CurrencyPanel>
  )
}
