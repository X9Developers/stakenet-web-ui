import React from 'react';
import { ContainerCurrency, InputContainerCurrency, InputCurrency, InputAmount, FormColumnCurrency, EmptyPercButtonRow, LogoInputCurrency } from './styleds';
import { AutoRow } from 'components/Row';
import Column from 'components/Column';
import { escapeRegExp } from '../../utils'
import { Text } from 'rebass'
import useTheme from '../../hooks/useTheme'
import { TokenCurrency } from 'constants/liquidity-pool/tradingPairs';

interface InputCurrencyComponentProps {
  handleInputFieldCurrency: (value: string) => void
  inputFieldCurrency: string
  currency: TokenCurrency
  trade?: string
  usdPrice: string
}

export const InputCurrencyComponent = ({ handleInputFieldCurrency, inputFieldCurrency, currency, trade, usdPrice }: InputCurrencyComponentProps) => {

  const theme = useTheme()
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      handleInputFieldCurrency(nextUserInput)
    }
  }

  return (
    <>
      <FormColumnCurrency>
        <ContainerCurrency >
          <AutoRow justify='space-between'>
            <Column>
              <AutoRow style={{ gap: '20px' }}>
                <LogoInputCurrency src={currency.urlIcon} alt={""} />
                <div >{currency.name}</div>
              </AutoRow>
            </Column>
          </AutoRow>
        </ContainerCurrency>
        <InputContainerCurrency>
          <InputCurrency
            onChange={event => { enforcer(event.target.value.replace(/,/g, '.')) }}
            value={inputFieldCurrency}
            type="text"
            placeholder="0.0"
            pattern="^[0-9]*[.]?[0-9]*$" />
          <InputAmount>
            {(usdPrice) ? usdPrice : '-'}
          </InputAmount>
        </InputContainerCurrency>
        <AutoRow justify='space-between' style={{ height: '40px' }}>
          {Boolean(trade)
            ? <>
              <Text fontWeight={500} fontSize={14} color={theme.text2}>
                Price
              </Text>
              <Text fontWeight={500} fontSize={14} color={theme.text2}>
                {trade}
              </Text>
            </>
            : <EmptyPercButtonRow />
          }
        </AutoRow>
      </FormColumnCurrency>
    </ >
  )
}
