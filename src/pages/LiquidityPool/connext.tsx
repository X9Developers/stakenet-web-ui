import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Container, FormColumnCurrency, StyledSwapHeader, ContainerButtons, HeaderTitle } from './styleds';
import { SwapBottomSection, SwapTopSection } from 'components/SwapWrappers';
import { AutoRow } from 'components/Row';
import { CardHeaderMenuIcon } from '../../components/Card/CardHeaderStyledComponents';
import BigSwapArrow from 'components/swap/BigSwapArrow';
import { SwapBottomSectionFiller } from '../../components/SwapWrappers/index';
import { ButtonLight } from 'components/Button';
import { InputCurrencyComponent } from './inputCurrencyComponent';
import { createCalculateTrade, promiseTimeout } from './liquidityPoolApi';
import { useWebSocket } from './useWebSocket';
import { CalculateTradeResponse } from 'models/protos/commands_pb';
import useDebounce from '../../hooks/useDebounce';
import { SendingSide } from '../../models/protos/models_pb';
import { IndependentFieldMap, setIndependetField, setInputCurrency, setInputCurrencyAmount, setOutputCurrency, setOutputCurrencyAmount, setTradingPair } from 'state/connext/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { SwapTradingPair } from 'state/connext/reducer';
import { toSatoshiWithPrecision, satoshiToValueWithPrecision } from 'utils/satoshi';
import { useWalletModalToggle } from 'state/application/hooks';
import { InputTradingPairsComponent } from './inputTradingPairsComponent';
import { DEFAULT_TRADING_PAIR, PROMISE_MAX_TIMEOUT, TradingPair, tradingPairsStr, TRADING_PAIRS } from 'constants/liquidity-pool/tradingPairs';
import { switchCurrencies } from '../../state/connext/actions';
import { getUsdEquivalent } from 'utils/usdPrice';
import { removeDecimalTrailingZeroes } from 'utils/FormatterNumber';

export const Connext = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { independentField, inputCurrency, outputCurrency, tradingPair }: SwapTradingPair = useSelector((state: AppState) => state.liquidityPool)
  const { currencyToken: inputCurrencyToken, currencyAmount: inputCurrencyAmount } = inputCurrency
  const { currencyToken: outputCurrencyToken, currencyAmount: outputCurrencyAmount } = outputCurrency
  const [price, setPrice] = useState('')
  const [inputUsdState, setInputUsdState] = useState('')
  const [outputUsdState, setOutputUsdState] = useState('')
  const [typedValueState, setTypedValueState] = useState('')
  const [disabled, setDisabled] = useState(true)
  const typedValueDebounced: string = useDebounce(typedValueState, 500)

  const priceLabel = (inputTokenName: string, outputTokenName: string, price: string) => {
    const priceLabelTmp = `${price} ${inputTokenName}/${outputTokenName}`
    setPrice(priceLabelTmp)
  }

  const toggleWalletModal = useWalletModalToggle()

  const { webSocketSubject, webSocketListener } = useWebSocket()

  const swapCurrency = () => {
    dispatch(switchCurrencies())
  }

  const cleanAllPrices = () => {
    setInputUsdState('-')
    setOutputUsdState('-')
    setPrice('')
  }

  const handleInputCurrencyToken = useCallback((newTradingPair: TradingPair) => {
    dispatch(setTradingPair({ tradingPair: newTradingPair }))
    const newInputToken = newTradingPair.principalCurrency
    const newOutputToken = newTradingPair.secondaryCurrency
    dispatch(setInputCurrency({ inputCurrencyToken: newInputToken, inputCurrencyAmount: '', inputCurrencyAmountUsd: '' }))
    dispatch(setOutputCurrency({ outputCurrencyToken: newOutputToken, outputCurrencyAmount: '', outputCurrencyAmountUsd: '' }))
    cleanAllPrices()
    setTypedValueState('')
  }, [dispatch])

  useEffect(() => {
    handleInputCurrencyToken(TRADING_PAIRS[DEFAULT_TRADING_PAIR])
  }, [handleInputCurrencyToken])

  const handleInputFieldCurrency = (newInputCurrency: string) => {
    dispatch(setInputCurrencyAmount({ inputCurrencyAmount: newInputCurrency }))
    dispatch(setIndependetField({ independentField: IndependentFieldMap.CLIENT }))
    setTypedValueState(newInputCurrency)
  }

  const handleOutputFieldCurrency = (newOutputCurrency: string) => {
    dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: newOutputCurrency }))
    dispatch(setIndependetField({ independentField: IndependentFieldMap.POOL }))
    setTypedValueState(newOutputCurrency)
  }

  const usdPriceFormat = (usd: string) => `$${usd} USD`

  const inputUsd = (amount: string, tokenName: string) => {
    getUsdEquivalent(amount, tokenName)
      .then((newUsdPrice: string) => {
        const formattedUsd = (newUsdPrice && Number(newUsdPrice) !== 0) ? usdPriceFormat(newUsdPrice) : '-'
        setInputUsdState(formattedUsd)
      })
  }

  const outputUsd = (amount: string, tokenName: string) => {
    getUsdEquivalent(amount, tokenName)
      .then((newUsdPrice: string) => {
        const formattedUsd = (newUsdPrice && Number(newUsdPrice) !== 0) ? usdPriceFormat(newUsdPrice) : '-'
        setOutputUsdState(formattedUsd)
      })
  }

  const cleanOutputFields = () => {
    dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: '' }))
    setOutputUsdState('-')
  }

  const cleanInputFields = () => {
    dispatch(setInputCurrencyAmount({ inputCurrencyAmount: '' }))
    setInputUsdState('')
  }

  const habdleInputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanOutputFields()
    if (!typedValueState || Number(typedValueState) === 0) {
      setInputUsdState('-')
      setDisabled(false)
      return
    }
    inputUsd(typedValueState, inputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(inputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = inputCurrencyToken.name
    calculateOutputCurrency(currencyToken, tradingPairStr, satoshi)
  }

  const calculateOutputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, satoshi, SendingSide.CLIENT)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      const amount = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(response.poolamount?.value || '', 2))
      dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: amount }))
      const satoshiPrice = response.price?.value || ''
      const parsedPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(satoshiPrice, 9))
      outputUsd(amount, outputCurrencyToken.name)
      priceLabel(currencyToken, outputCurrencyToken.name, parsedPrice)
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
    })
  }

  const handleOutputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanInputFields()
    if (!typedValueState || Number(typedValueState) === 0) {
      setOutputUsdState('-')
      setDisabled(false)
      return
    }
    outputUsd(typedValueState, outputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(outputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = outputCurrencyToken?.name as string
    calculateInputCurrency(currencyToken, tradingPairStr, satoshi)
  }

  const calculateInputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, satoshi, SendingSide.POOL)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      const amount = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(response.clientamount?.value || '', 2))
      dispatch(setInputCurrencyAmount({ inputCurrencyAmount: amount }))
      const satoshiPrice = response.price?.value || ''
      const parsedPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(satoshiPrice, 9))
      priceLabel(inputCurrencyToken.name, outputCurrencyToken.name, parsedPrice)
      inputUsd(amount, inputCurrencyToken.name)
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
    })
  }

  const getTrade = () => {
    if (independentField === IndependentFieldMap.CLIENT) {
      habdleInputCurrency()
    } else {
      handleOutputCurrency()
    }
  }

  const savedGetTrade = useRef(getTrade)

  useEffect(() => {
    savedGetTrade.current = getTrade
  });

  useEffect(() => {
    savedGetTrade.current()
    const interval = setInterval(() => {
      savedGetTrade.current()
    }, 15000);
    return () => clearInterval(interval);
  }, [typedValueDebounced, independentField])

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    toggleWalletModal()
  }

  return (
    <Container>
      <StyledSwapHeader>
        <AutoRow justify='space-between'>
          <HeaderTitle >Connext</HeaderTitle>
          <CardHeaderMenuIcon></CardHeaderMenuIcon>
        </AutoRow>
      </StyledSwapHeader>
      <AutoRow justify='center'>
        <InputTradingPairsComponent
          tradingPairs={TRADING_PAIRS}
          tradingPair={tradingPair as TradingPair}
          handleInputCurrency={handleInputCurrencyToken}
        />
      </AutoRow>
      <SwapTopSection id='swap-top-section' minHeight={(700 - 60) / 2}>
        <InputCurrencyComponent
          currency={inputCurrencyToken}
          inputFieldCurrency={inputCurrencyAmount}
          handleInputFieldCurrency={handleInputFieldCurrency}
          usdPrice={inputUsdState}
        />
        <FormColumnCurrency>
          <BigSwapArrow
            onPress={() => { swapCurrency() }}
            disabled={disabled}
          />
        </FormColumnCurrency>
        <InputCurrencyComponent
          currency={outputCurrencyToken}
          inputFieldCurrency={outputCurrencyAmount}
          handleInputFieldCurrency={handleOutputFieldCurrency}
          trade={price}
          usdPrice={outputUsdState}
        />
      </SwapTopSection>
      <SwapBottomSectionFiller />
      <SwapBottomSection trade={true} previewing={false}>
        <ContainerButtons>
          <ButtonLight onClick={handleSubmit}>Connect Wallet</ButtonLight>
        </ContainerButtons>
      </SwapBottomSection>
    </Container >
  )
}
