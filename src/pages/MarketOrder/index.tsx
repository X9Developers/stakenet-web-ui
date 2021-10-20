import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SwapBottomSection, SwapTopSection } from 'components/SwapWrappers';
import { AutoRow } from 'components/Row';
import { CardHeaderMenuIcon } from 'components/Card/CardHeaderStyledComponents';
import BigSwapArrow from 'components/swap/BigSwapArrow';
import { SwapBottomSectionFiller } from 'components/SwapWrappers/index';
import { ButtonLight } from 'components/Button';
import { UseMarketOrderRequests } from './useMarketOrderRequests';
import { IndependentFieldMap, setIndependetField, setInputCurrency, setInputCurrencyAmount, setOutputCurrency, setOutputCurrencyAmount, setTradingPair } from 'state/marketOrder/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from 'state';
import { SwapTradingPair } from 'state/marketOrder/reducer';
import { satoshiToValueWithPrecision, toSatoshiWithPrecision } from 'utils/satoshi';
import { useWalletModalToggle } from 'state/application/hooks';
import { DEFAULT_TRADING_PAIR, TradingPair, tradingPairsStr, TRADING_PAIRS } from 'constants/liquidity-pool/tradingPairs';
import { switchCurrencies } from 'state/marketOrder/actions';
import { getUsdEquivalent } from 'utils/usdPrice';
import { useActiveWeb3React } from 'hooks';
import { ConfirmInterchangeComponent } from 'components/calculator/confirmInterchangeComponent';
import { LoadingScreenComponent, LoadingScreenComponentProps } from 'components/calculator/loadingScreenComponent';
import { ActionsConnext } from 'constants/liquidity-pool/tradingPairs';
import { BigNumber } from 'ethers';
import { resetConnextError } from 'constants/liquidity-pool/connextErrors';
import { resetLoader } from 'constants/liquidity-pool/loadingMessagges';
import Big from 'big.js';
import { removeDecimalTrailingZeroes } from 'utils/FormatterNumber';
import { Container, HeaderTitle, StyledSwapHeader } from 'components/calculator/styleds';
import { InputTradingPairsComponent } from 'components/calculator/inputTradingPairsComponent';
import { InputCurrencyComponent } from 'components/calculator/inputCurrencyComponent';
import { FormColumnCurrency, ContainerButtons } from 'components/calculator/styleds';
import { SuccessScreenModal } from 'components/calculator/succesScreenModal';
import { HandleErrorComponent } from 'components/calculator/handleErrorComponent';
import { SettingsTab } from 'components/calculator/settingsTab';
import { UseConnextRequests } from '../LiquidityPool/useConnextRequests';
import useDebounce from 'hooks/useDebounce';

export const MarketOrder = () => {

  const dispatch = useDispatch<AppDispatch>()
  const swapTradingPair: SwapTradingPair = useSelector((state: AppState) => state.marketOrder)
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
  interface savedStateInterface {
    clientamount: string,
    poolamount: string,
    fee: string,
  }
  const [savedCalculateTrade] = useState<savedStateInterface | undefined>(undefined)

  const priceLabel = (inputTokenName: string, outputTokenName: string, price: string) => {
    const priceLabelTmp = `${price} ${inputTokenName}/${outputTokenName}`
    setPrice(priceLabelTmp)
  }

  const toggleWalletModal = useWalletModalToggle()

  const { account } = useActiveWeb3React()

  const [currencyPrice, setCurrencyPrice] = useState('')


  const swapCurrency = () => {
    dispatch(switchCurrencies())
  }

  const cleanAllPrices = () => {
    setInputUsdState('-')
    setOutputUsdState('-')
    setPrice('')
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

  const { handleSuscribe } = UseMarketOrderRequests({
    swapTradingPair,
    setCurrencyPrice
  })


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
    if (!typedValueState || Number(typedValueState) === 0 || !currencyPrice) {
      setInputUsdState('-')
      setDisabled(false)
      return
    }
    inputUsd(typedValueState, inputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(inputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = inputCurrencyToken.name
    calculateOutputCurrency(currencyToken, tradingPairStr, satoshi)
    setDisabled(false)
  }


  // const saveCalculateTrade = (response: CalculateTradeResponse.AsObject) => {
  //   setSavedCalculateTrade({
  //     clientamount: response.clientamount!.value,
  //     poolamount: response.poolamount!.value,
  //     fee: response.fee!.value
  //   })
  // }

  const calculateOutputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const parsedCurrencyPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(currencyPrice.toString() || '', 9))
    const poolAmount = (tradingPair.principalCurrency.assetId === inputCurrencyToken.assetId)
      ? Big(inputCurrencyAmount).mul(parsedCurrencyPrice).toFixed(6)
      : Big(inputCurrencyAmount).div(parsedCurrencyPrice).toFixed(6)
    const parsedPoolAmount = removeDecimalTrailingZeroes(poolAmount)
    dispatch(setOutputCurrencyAmount({ outputCurrencyAmount: parsedPoolAmount }))
    outputUsd(parsedPoolAmount, outputCurrencyToken.name)
    priceLabel(currencyToken, outputCurrencyToken.name, parsedCurrencyPrice)
  }

  const handleOutputCurrency = () => {
    setDisabled(true)
    setPrice('')
    cleanInputFields()
    if (!typedValueState || Number(typedValueState) === 0 || !currencyPrice) {
      setOutputUsdState('-')
      setDisabled(false)
      return
    }
    outputUsd(typedValueState, outputCurrencyToken.name)
    const satoshi = toSatoshiWithPrecision(outputCurrencyAmount, 6)
    const tradingPairStr = tradingPairsStr(tradingPair as TradingPair)
    const currencyToken = outputCurrencyToken?.name as string
    calculateInputCurrency(currencyToken, tradingPairStr, satoshi)
    setDisabled(false)
  }

  const calculateInputCurrency = (currencyToken: string, tradingPairStr: string, satoshi: string) => {
    const parsedCurrencyPrice = removeDecimalTrailingZeroes(satoshiToValueWithPrecision(currencyPrice.toString() || '', 9))
    const clientAmount = (tradingPair.principalCurrency.assetId !== outputCurrencyToken.assetId)
      ? Big(outputCurrencyAmount).div(parsedCurrencyPrice).toFixed(6)
      : Big(outputCurrencyAmount).mul(parsedCurrencyPrice).toFixed(6)
    const parsedClientAmount = removeDecimalTrailingZeroes(clientAmount)
    dispatch(setInputCurrencyAmount({ inputCurrencyAmount: parsedClientAmount }))
    inputUsd(parsedClientAmount, inputCurrencyToken.name)
    priceLabel(currencyToken, inputCurrencyToken.name, parsedCurrencyPrice)
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
    // const interval = setInterval(() => {
    //   savedGetTrade.current()
    // }, 15000);
    // return () => clearInterval(interval);
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


  const savedHandleSuscribe = useRef(handleSuscribe)

  useEffect(() => {
    savedHandleSuscribe.current = handleSuscribe
  });

  useEffect(() => {
    savedHandleSuscribe.current()
    const interval = setInterval(() => {
      savedHandleSuscribe.current()
    }, 15000);
    return () => clearInterval(interval);
  }, [tradingPair])

  return (
    <Container>
      <StyledSwapHeader>
        <AutoRow justify='space-between'>
          <HeaderTitle >Market order price: {currencyPrice}</HeaderTitle>
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
