import wethLogo from '../../assets/monitor/icon-weth_tp.png'
import usdtLogo from '../../assets/monitor/icon-usdt_tp.svg'
import xsnLogo from '../../assets/monitor/icon-xsn_tp.svg'
import ltcLogo from '../../assets/monitor/icon-ltc_tp.svg'
import btcLogo from '../../assets/monitor/icon-btc_tp.svg'

export interface TokenCurrency {
  name: string,
  urlIcon: string
}

export interface TradingPair {
  principalCurrency: TokenCurrency,
  secondaryCurrency: TokenCurrency
}

export interface tradingPairDictionaty<T> {
  [key: string]: T;
}

const WETH: TokenCurrency = { name: 'WETH', urlIcon: wethLogo }
const USDT: TokenCurrency = { name: 'USDT', urlIcon: usdtLogo }
const XSN: TokenCurrency = { name: 'XSN', urlIcon: xsnLogo }
const LTC: TokenCurrency = { name: 'LTC', urlIcon: ltcLogo }
const BTC: TokenCurrency = { name: 'BTC', urlIcon: btcLogo }

const WETH_USDT: TradingPair = { principalCurrency: WETH, secondaryCurrency: USDT }
const XSN_LTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: LTC }
const XSN_WETH: TradingPair = { principalCurrency: XSN, secondaryCurrency: WETH }
const XSN_BTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: BTC }
const BTC_WETH: TradingPair = { principalCurrency: BTC, secondaryCurrency: WETH }
const BTC_USDT: TradingPair = { principalCurrency: BTC, secondaryCurrency: USDT }
const LTC_BTC: TradingPair = { principalCurrency: LTC, secondaryCurrency: BTC }


export const TRADING_PAIRS: tradingPairDictionaty<TradingPair> = {
  'WETH_USDT': WETH_USDT,
  'XSN_LTC': XSN_LTC,
  'XSN_WETH': XSN_WETH,
  'XSN_BTC': XSN_BTC,
  'BTC_WETH': BTC_WETH,
  'BTC_USDT': BTC_USDT,
  'LTC_BTC': LTC_BTC
}

export const DEFAULT_TRADING_PAIR = 'WETH_USDT'


export const tradingPairsStr = (tradingPair: TradingPair) => `${tradingPair.principalCurrency.name}_${tradingPair.secondaryCurrency.name}`

export const PROMISE_MAX_TIMEOUT = 1000