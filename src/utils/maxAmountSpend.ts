import { CurrencyAmount, ETHER, JSBI } from '@uniswap/sdk'
import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }
  return currencyAmount
}

/**
 * Given some amount of token, return a percentage of the max that can be spent
 * @param perc perc to return
 * @param currencyAmount to return perc of
 */
export function percAmountSpend(perc: number, currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.BigInt(Math.round(JSBI.toNumber(JSBI.subtract(currencyAmount.raw, MIN_ETH)) * perc)))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }
  return CurrencyAmount.ether(JSBI.BigInt(Math.round(JSBI.toNumber(currencyAmount.raw) * perc)))
}
