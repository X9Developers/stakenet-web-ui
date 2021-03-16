import { JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import PreviewSwapSection from '../../components/swap/PreviewSwapSection'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { GradientDividerRow, SwapInfoAutoColumn, SwapShowAcceptChanges, Wrapper } from '../../components/swap/styleds'
import TokenWarningModal from '../../components/TokenWarningModal'
import SwapHeader from '../../components/swap/SwapHeader'

import { getTradeVersion } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { percAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CardBody from '../CardBody'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { SwapTopSection, SwapBottomSection, SwapBottomSectionFiller, SwapBottomRevealable, PercButton } from 'components/SwapWrappers'
import BigSwapArrow from 'components/swap/BigSwapArrow'
import { tradeMeaningfullyDiffers } from 'utils/trades'
import { AutoRow, RowFixed } from 'components/Row'
import { AlertTriangle } from 'react-feather'
import SwapModalFooter from 'components/swap/SwapModalFooter'
import QuestionHelper from 'components/QuestionHelper'
import TradePrice from 'components/swap/TradePrice'
import { STAKENET_FLAT_FEE } from '../../constants/index'

const BottomSectionButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 4;
  position: relative;
  left: 0;
  right: 0;
`

const FeeCalculationWrapper = styled.div`
  width: 100%;
`

const SwapStatsSlidingPreviewSection = styled(AutoColumn)<{trade: boolean}>`
  transition: opacity 600ms;
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-bottom: 18px;
  gap: 18px;
  opacity: ${({ trade }) => trade ? 1 : 0};
`

const StyledAlertTriangle = styled(AlertTriangle)`
  margin-right: 8px;
  width: 20px;
  height: 20px;
`

const BoldPrice = styled.span`
  font-weight: 700;
  font-size: 18px;
`

const MobileSpaceBetweenAutoRow = styled(AutoRow)`
  flex: 1;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: space-between;
  `};
`
const MobileReveal = styled(AutoColumn)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: grid;
`};
`

export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    usdRelations,
  } = useDerivedSwapInfo()
  const { address: recipientAddress } = useENSAddress(recipient)
  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
  }

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showPreview, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showPreview: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showPreview: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const formattedUsdEquivalencies = {
    [Field.INPUT]: usdRelations.INPUT != null ? `$${usdRelations.INPUT.toFixed(2)} USD` : '-',
    [Field.OUTPUT]: usdRelations.OUTPUT != null ? `$${usdRelations.OUTPUT.toFixed(2)} USD` : '-',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showPreview: showPreview, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showPreview: showPreview, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showPreview: showPreview,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showPreview,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly
  ])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const handlePreviewDismiss = useCallback(() => {
    setSwapState({ showPreview: false, tradeToConfirm, attemptingTxn, swapErrorMessage: undefined, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showPreview: showPreview })
  }, [attemptingTxn, showPreview, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => onCurrencySelection(Field.INPUT, inputCurrency),
    [onCurrencySelection]
  )

  const handleSetPerc = (perc: number) => {
    const percAmount = percAmountSpend(perc, currencyBalances[Field.INPUT])
    percAmount && onUserInput(Field.INPUT, percAmount.toExact())
  }

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const acceptChangesRequired = useMemo(
    () => Boolean(showPreview && trade && tradeToConfirm && tradeMeaningfullyDiffers(trade, tradeToConfirm)),
    [tradeToConfirm, showPreview, trade]
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
      <SwapPoolTabs active={'swap'} />
      <CardBody>
        <SwapHeader previewing={showPreview} onCancelPreview={handlePreviewDismiss}/>
        <Wrapper id="swap-page">
          <AutoColumn gap={'md'}>
            <SwapTopSection id='swap-top-section' minHeight={(700 - 60) / 2}>
              <CurrencyInputPanel
                label={independentField === Field.OUTPUT && trade ? 'From (estimated)' : 'From'}
                value={formattedAmounts[Field.INPUT]}
                showPercButtons={true}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onSetPerc={handleSetPerc}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                usdEquivalency={formattedUsdEquivalencies[Field.INPUT]}
                id="swap-currency-input"
              />
              <MobileSpaceBetweenAutoRow>
                <MobileReveal>
                  <PercButton
                    disabled={!account || !currencies[Field.INPUT]}
                    onClick={() => handleSetPerc(0)}
                    selected={false}
                    >
                      MIN
                  </PercButton>
                  <PercButton
                    disabled={!account || !currencies[Field.INPUT]}
                    onClick={() => handleSetPerc(0.5)}
                    selected={false}
                    >
                      HALF
                  </PercButton>
                  <PercButton
                    disabled={!account || !currencies[Field.INPUT]}
                    onClick={() => handleSetPerc(1)}
                    selected={false}
                    >
                      MAX
                  </PercButton>
                </MobileReveal>
                <BigSwapArrow
                  onPress={onSwitchTokens}
                />

                <MobileReveal>
                  <Text fontWeight={500} fontSize={14} color={theme.text2} textAlign="right">
                    Price
                  </Text>
                  <TradePrice
                    price={trade?.executionPrice}
                    showInverted={showInverted}
                    vertical={true}
                    setShowInverted={setShowInverted}
                  />
                </MobileReveal>
              </MobileSpaceBetweenAutoRow>
              <CurrencyInputPanel
                label={independentField === Field.INPUT && trade ? 'To (estimated)' : 'To'}
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                showPercButtons={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                usdEquivalency={formattedUsdEquivalencies[Field.OUTPUT]}
                id="swap-currency-output"
                trade={trade}
              />
            </SwapTopSection>
            {/* TODO: Reimplement send address */}
          </AutoColumn>

          <SwapBottomSectionFiller/>
          <SwapBottomSection trade={!!trade} previewing={showPreview}>
            <SwapBottomRevealable previewing={showPreview}>
              <PreviewSwapSection
                trade={trade}
                acceptChangesRequired={acceptChangesRequired}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                swapErrorMessage={swapErrorMessage}
                usdEquivalencies={formattedUsdEquivalencies}
              />
            </SwapBottomRevealable>
            <SwapStatsSlidingPreviewSection trade={trade != null}>
              <SwapInfoAutoColumn visible={showPreview && !!trade} justify="flex-start" gap="18px" style={{ padding: '12px 0 0 0px', height: '100px' }}>
                <GradientDividerRow />
                { showPreview && trade &&
                  <FeeCalculationWrapper>
                    <AutoRow justify="center">
                      <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
                        Trading fee:
                      </TYPE.black>
                      <QuestionHelper text="Fee is split between orderbook hosting masternodes and liquidity providers." />
                    </AutoRow>
                    <TYPE.black fontSize={14} marginLeft={'4px'} width={'100%'} textAlign="center">
                      0.3% * { formattedUsdEquivalencies.INPUT ?? '-' } =
                      <BoldPrice>{` $${usdRelations.INPUT?.multiply(STAKENET_FLAT_FEE).toFixed(2)} USD`}</BoldPrice>
                    </TYPE.black>
                  </FeeCalculationWrapper>
                }
                <GradientDividerRow />
              </SwapInfoAutoColumn>
              {/* TODO: Reimplement recipient
                { showPreview && trade != null && recipient !== null && 
                <SwapInfoAutoColumn visible={showPreview && trade != null && recipient !== null} justify="flex-start" gap="18px" style={{ padding: '12px 0 0 0px' }}>
                    <TYPE.main>
                      Output will be sent to{' '}
                      <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
                    </TYPE.main>
                  <GradientDividerRow />
                </SwapInfoAutoColumn>
              } */}
              <SwapInfoAutoColumn visible={!!trade} justify="space-between" gap="18px" style={{ padding: '6px 0 0 0px' }}>
                { trade != null &&
                  <SwapModalFooter
                    trade={trade}
                    allowedSlippage={allowedSlippage}
                  />
                }
                <GradientDividerRow />
              </SwapInfoAutoColumn>
            </SwapStatsSlidingPreviewSection>
            <BottomSectionButton>
              {acceptChangesRequired &&
                <SwapShowAcceptChanges justify="center" gap={'0px'}>
                  <RowFixed>
                    <StyledAlertTriangle/>
                    <TYPE.main> Price Updated</TYPE.main>
                  </RowFixed>
                </SwapShowAcceptChanges>
              }
              {swapIsUnsupported ? (
                <ButtonPrimary disabled={true}>
                  <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                </ButtonPrimary>
              ) : !account ? (
                <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center' }}>
                  <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                  {singleHopOnly && <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>}
                </GreyCard>
              ) : acceptChangesRequired ? (
                <ButtonPrimary onClick={handleAcceptChanges}>
                  <TYPE.main mb="4px">Accept Changes</TYPE.main>
                </ButtonPrimary>
              ) : swapErrorMessage ? (
                <ButtonError error={true} onClick={handlePreviewDismiss}>
                  <TYPE.main mb="4px">Close Preview</TYPE.main>
                </ButtonError>
              ) : (
                <ButtonError
                  onClick={() => {
                    if (!showPreview) {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showPreview: true,
                        txHash: undefined
                      })
                    } else {
                      handleSwap()
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                  error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  style={{ minWidth: '200px' }}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {swapInputError
                      ? swapInputError
                      : priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact Too High`
                      : showPreview
                      ? `Confirm Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`
                      : `Preview Swap`}
                  </Text>
                </ButtonError>
              )}
            </BottomSectionButton>
          </SwapBottomSection>
        </Wrapper>
      </CardBody>
    </>
  )
}
