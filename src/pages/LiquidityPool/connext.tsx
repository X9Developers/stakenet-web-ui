import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Container, FormColumnCurrency, StyledSwapHeader, ContainerButtons, HeaderTitle } from 'components/calculator/styleds';
import { SwapBottomSection, SwapTopSection } from 'components/SwapWrappers';
import { AutoRow } from 'components/Row';
import { CardHeaderMenuIcon } from 'components/Card/CardHeaderStyledComponents';
import BigSwapArrow from 'components/swap/BigSwapArrow';
import { SwapBottomSectionFiller } from 'components/SwapWrappers/index';
import { ButtonLight } from 'components/Button';
import { createCalculateTrade, promiseTimeout } from '../../services/liquidityPoolApi';
import { useWebSocket } from '../../hooks/webSocket/useWebSocket';
import { CalculateTradeResponse } from 'models/protos/commands_pb';
import useDebounce from 'hooks/useDebounce';
import { SendingSide } from 'models/protos/models_pb';
import { IndependentFieldMap, setFee, setIndependetField, setInputCurrency, setInputCurrencyAmount, setOutputCurrency, setOutputCurrencyAmount, setTradingPair } from 'state/connext/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { SwapTradingPair } from 'state/connext/reducer';
// import { toSatoshiWithPrecision } from 'utils/satoshi';
import { useWalletModalToggle } from 'state/application/hooks';
import { DEFAULT_TRADING_PAIR, PROMISE_MAX_TIMEOUT, savedStateInterface, TradingPair, tradingPairsStr, TRADING_PAIRS } from 'constants/liquidity-pool/tradingPairs';
import { switchCurrencies } from 'state/connext/actions';
import { getUsdEquivalent } from 'utils/usdPrice';
import { useActiveWeb3React } from 'hooks';
import { ConfirmInterchangeComponent } from 'components/calculator/confirmInterchangeComponent';
import { LoadingScreenComponent, LoadingScreenComponentProps } from 'components/calculator/loadingScreenComponent';
import { ActionsConnext } from 'constants/liquidity-pool/tradingPairs';
import { BigNumber } from 'ethers';
import { resetConnextError } from 'constants/liquidity-pool/connextErrors';
import { resetLoader } from 'constants/liquidity-pool/loadingMessagges';
// import { createCustomWebSocket } from './createCustomWebSocket';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import Big from 'big.js';
import { UseConnextRequests } from './useConnextRequests';
import { InputTradingPairsComponent } from 'components/calculator/inputTradingPairsComponent';
import { InputCurrencyComponent } from 'components/calculator/inputCurrencyComponent';
import { SuccessScreenModal } from 'components/calculator/succesScreenModal';
import { HandleErrorComponent } from 'components/calculator/handleErrorComponent';
import { SettingsTab } from 'components/calculator/settingsTab';

export const Connext = () => {

  const dispatch = useDispatch<AppDispatch>()
  const swapTradingPair: SwapTradingPair = useSelector((state: AppState) => state.liquidityPool)
  const { independentField, inputCurrency, outputCurrency, tradingPair }: SwapTradingPair = swapTradingPair
  const { currencyToken: inputCurrencyToken, currencyAmount: inputCurrencyAmount } = inputCurrency
  const { currencyToken: outputCurrencyToken, currencyAmount: outputCurrencyAmount } = outputCurrency
  const [price, setPrice] = useState('')
  const [inputUsdState, setInputUsdState] = useState('')
  const [outputUsdState, setOutputUsdState] = useState('')
  const [typedValueState, setTypedValueState] = useState('')
  const [disabled, setDisabled] = useState(true)
  const typedValueDebounced: string = useDebounce(typedValueState, 500)
  const [actionConnext, setActionConnext] = useState({
    action: ActionsConnext.SWAP,
    updates: 0
  })
  const [connextError, setConnextError] = useState(resetConnextError)
  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenComponentProps>(resetLoader)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [updatePrice, setUpdatePrice] = useState(true)
  const [savedCalculateTrade, setSavedCalculateTrade] = useState<savedStateInterface | undefined>(undefined)

  const priceLabel = (inputTokenName: string, outputTokenName: string, price: string) => {
    const priceLabelTmp = `${price} ${inputTokenName}/${outputTokenName}`
    setPrice(priceLabelTmp)
  }

  const toggleWalletModal = useWalletModalToggle()

  const { account } = useActiveWeb3React()

  const { webSocketSubject, webSocketListener } = useWebSocket()

  const swapCurrency = () => {
    dispatch(switchCurrencies())
  }

  const onFinished = (txHash: string, amountUi?: string, amountBn?: BigNumber) => {
    console.log("On finish ==>", txHash, 'successWithdrawalUi', amountUi, 'withdrawalAmount', amountBn)
    setTxHash(txHash)
  }


  const { handleConnext, } = UseConnextRequests({
    setLoadingScreen,
    setConnextError,
    actionConnext,
    setUpdatePrice,
    savedCalculateTrade,
    onFinished,
    swapTradingPair
  })

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

  const handleInputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanOutputFields()
    if (!typedValueState || Number(typedValueState) === 0) {
      setInputUsdState('-')
      setDisabled(false)
      return
    }
    inputUsd(typedValueState, inputCurrencyToken.name)
    const formattedInput = Number(inputCurrencyAmount).toFixed(6)
    console.log('formattedInput: ', formattedInput)
    const transferAmountBn = BigNumber.from(parseUnits(formattedInput, inputCurrencyToken.decimals)).toString();

    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = inputCurrencyToken.name
    calculateOutputCurrency(currencyToken, tradingPairStr, transferAmountBn)
  }


  const saveCalculateTrade = (response: CalculateTradeResponse.AsObject) => {
    setSavedCalculateTrade({
      clientamount: response.clientamount!.value,
      poolamount: response.poolamount!.value,
      fee: response.fee!.value
    })
  }

  const calculateOutputCurrency = (currencyToken: string, tradingPairStr: string, transferAmountBn: string) => {
    console.log('Calling createCalculateTrade: ', tradingPairStr, currencyToken, transferAmountBn, SendingSide.CLIENT)
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, transferAmountBn, SendingSide.CLIENT)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      console.log('CalculateTradeResponse: ', response)
      saveCalculateTrade(response)
      const poolAmount = formatUnits(response.poolamount!.value, outputCurrencyToken.decimals);
      if (Big(poolAmount).eq(0)) {
        throw new Error('poolAmount cannot be zero')
      }
      dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: poolAmount }))
      dispatch(setFee({ fee: response.fee!.value }))
      const price = Big(inputCurrencyAmount).div(Big(poolAmount))
      outputUsd(poolAmount, outputCurrencyToken.name)
      priceLabel(currencyToken, outputCurrencyToken.name, price.toString())
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
      setSavedCalculateTrade(undefined)
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
    const formattedInput = Number(outputCurrencyAmount).toFixed(6)
    console.log('formattedInput: ', formattedInput)
    const transferAmountBn = BigNumber.from(parseUnits(formattedInput, outputCurrencyToken.decimals)).toString();


    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = outputCurrencyToken?.name as string
    calculateInputCurrency(currencyToken, tradingPairStr, transferAmountBn)
  }

  const calculateInputCurrency = (currencyToken: string, tradingPairStr: string, transferAmountBn: string) => {
    console.log('Calling createCalculateTrade: ', tradingPairStr, currencyToken, transferAmountBn, SendingSide.POOL)
    const promise = createCalculateTrade(webSocketSubject, webSocketListener, tradingPairStr, currencyToken, transferAmountBn, SendingSide.POOL)
    promiseTimeout(promise, PROMISE_MAX_TIMEOUT).then((response: CalculateTradeResponse.AsObject) => {
      console.log('CalculateTradeResponse: ', response)
      saveCalculateTrade(response)
      const clientAmount = formatUnits(response.clientamount!.value, inputCurrencyToken.decimals);
      if (Big(clientAmount).eq(0)) {
        throw new Error('clientAmount cannot be zero')
      }
      dispatch(setInputCurrencyAmount({ inputCurrencyAmount: clientAmount }))
      dispatch(setFee({ fee: response.fee!.value }))
      const price = Big(clientAmount).div(Big(outputCurrencyAmount))
      priceLabel(inputCurrencyToken.name, outputCurrencyToken.name, price.toString())
      inputUsd(clientAmount, inputCurrencyToken.name)
      setDisabled(false)
    }).catch(error => {
      console.log(error)
      setDisabled(false)
      setSavedCalculateTrade(undefined)
    })
  }



  const getTrade = () => {
    if (independentField === IndependentFieldMap.CLIENT) {
      handleInputCurrency()
    } else {
      handleOutputCurrency()
    }
  }

  const savedGetTrade = useRef(getTrade)

  useEffect(() => {
    savedGetTrade.current = getTrade
  });

  const [showSettings, setShowSettings] = useState(false)

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }
  useEffect(() => {
    if (!updatePrice) {
      return
    }
    savedGetTrade.current()
    const interval = setInterval(() => {
      savedGetTrade.current()
    }, 15000);
    return () => clearInterval(interval);
  }, [typedValueDebounced, independentField, updatePrice])

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    toggleWalletModal()
  }



  const firstUpdate = useRef(true)

  const savedHandleConnext = useRef(handleConnext)

  useEffect(() => {
    savedHandleConnext.current = handleConnext
  });

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    savedHandleConnext.current()
  }, [actionConnext])

  const recover = () => {
    setActionConnext({
      action: ActionsConnext.RECOVER,
      updates: actionConnext.updates + 1
    })
  }

  const handleInterchange = () => {
    setActionConnext({
      action: ActionsConnext.SWAP,
      updates: actionConnext.updates + 1
    })
  }

  const [slippage, setSlippage] = useState(20)

  return (
    <Container>
      <StyledSwapHeader>
        <AutoRow justify='space-between'>
          <HeaderTitle >Connext</HeaderTitle>
          <div style={{ cursor: "pointer" }}>
            <CardHeaderMenuIcon onClick={toggleSettings}></CardHeaderMenuIcon>
          </div>
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
          {(!account)
            ? <ButtonLight onClick={handleSubmit}>Connect Wallet</ButtonLight>
            :
            <ConfirmInterchangeComponent
              inputCurrency={inputCurrencyToken.name}
              inputAmount={inputCurrencyAmount}
              outputCurrency={outputCurrencyToken.name}
              outputAmount={outputCurrencyAmount}
              onInterchange={handleInterchange}
              disabled={!(inputCurrencyAmount && outputCurrencyAmount)}
            />
          }
          <LoadingScreenComponent {...loadingScreen} />
        </ContainerButtons>
      </SwapBottomSection>
      {(showSettings)
        &&
        <SettingsTab
          showSettings={showSettings}
          toggle={toggleSettings}
          recover={recover}
          slippage={slippage}
          setSlippage={setSlippage}
        ></SettingsTab>
      }
      < SuccessScreenModal
        onDismiss={() => {
          setShowSuccessScreen(false)
          handleInputCurrencyToken(tradingPair)
        }}
        modalOpen={showSuccessScreen}
        message={"Swap was completed successfully"}
        senderChain={inputCurrencyToken.name}
        receiverChain={outputCurrencyToken.name}
        addressAccount={account!}
        txUrl={txHash}
      />
      <HandleErrorComponent
        connextError={connextError}
        inputCurrencyToken={inputCurrencyToken}
        outputCurrencyToken={outputCurrencyToken}
        account={account!}
        setConnextError={setConnextError}
        retrySetup={handleConnext}
      />
    </Container >
  )
}
