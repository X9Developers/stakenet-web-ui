import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
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
import { Slider, Tooltip, ValueLabelProps, withStyles } from '@material-ui/core'

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
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  height: 85px;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
  flex: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  ' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`
const CurrencyAndBalanceText = styled.div`
  margin: 0 0.25rem 0 0.75rem;
  text-align: left;
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`


const StakenetSlider = withStyles({
  root: {
    color: '#52af77',
    height: 4,
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -7,
    marginLeft: -9,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
    fontSize: '0.875rem',
    fontWeight: 500,
    height: 28,
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: '0.5rem',
    color: 'red',
  },
  track: {
    borderRadius: 4,
    height: 4,
  },
  mark: {
    height: 4,
    width: 4,
    marginLeft: -2,
    borderRadius: 2,
  },
  markLabel: {
    left: 'calc(-50% + 4px)',
    fontSize: '0.875rem',
    fontWeight: 500,
    height: 28,
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: '0.5rem',
    color: 'red',
    verticalAlign: 'center',
    lineHeight: '28px',
    paddingLeft: 6,
    paddingRight: 6,
    ":hover": {
      // border: 1px solid ${({ theme }) => theme.primary1},
    },
    ":focus": {
      // border: 1px solid ${({ theme }) => theme.primary1},
      outline: 'none',
    },
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
})(Slider);

function SliderTooltip(props: ValueLabelProps) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
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
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const sliderMarks = [
    {
      value: 0,
      label: 'MIN',
    },
    {
      value: 50,
      label: 'HALF',
    },
    {
      value: 100,
      label: 'MAX',
    },
  ];
  function sliderText(value: number) {
    return `${value}%`;
  }

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
                <CurrencyLogo currency={currency} size={'24px'} />
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
                  {account && currency && showMaxButton && label !== 'To' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )}
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
        <StakenetSlider
          defaultValue={0}
          valueLabelFormat={sliderText}
          ValueLabelComponent={SliderTooltip}
          step={10}
          valueLabelDisplay="auto"
          marks={sliderMarks}
          disabled={!account || !currency}
        />
      </AutoColumn>
    </CurrencyPanel>
  )
}
