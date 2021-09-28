import { useEffect, useState } from 'react'
// import { AppState } from '../../state/index';
// import { useSelector } from 'react-redux';
// import { SwapTradingPair } from '../../state/connext/reducer';
import Big from 'big.js';

interface useTransactionPriceProps {
  inputAmount: string
  outputAmount: string
  inputTokenName: string
  outputTokenName: string
  inverted?: boolean
}
export const useTransactionPrice = ({ inputAmount, outputAmount, inputTokenName, outputTokenName }: useTransactionPriceProps) => {
  // export const useTransactionPrice = () => {

  // const { inputCurrency, outputCurrency }: SwapTradingPair = useSelector((state: AppState) => state.liquidityPool)
  // const { currencyToken: inputCurrencyToken, currencyAmount: inputAmount } = inputCurrency
  // const { currencyToken: outputCurrencyToken, currencyAmount: outputAmount } = outputCurrency
  const [priceLabel, setPriceLabel] = useState('')

  useEffect(() => {
    if (!inputAmount || !outputAmount || Number(inputAmount) === 0 || Number(outputAmount) === 0) {
      setPriceLabel('')
    } else {
      const price = Big(inputAmount).div(Big(outputAmount))
      const priceLabelTmp = `${price} ${inputTokenName}/${outputTokenName}`
      setPriceLabel(priceLabelTmp)
    }
  }, [inputAmount, outputAmount])

  return priceLabel;
}
