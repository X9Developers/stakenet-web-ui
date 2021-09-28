import ethLogo from '../../assets/monitor/icon-eth_tp.png'
import wethLogo from '../../assets/monitor/icon-weth_tp.png'
import usdtLogo from '../../assets/monitor/icon-usdt_tp.svg'
import usdcLogo from '../../assets/monitor/icon-usdc_tp.png'
// import xsnLogo from '../../assets/monitor/icon-xsn_tp.svg'
// import ltcLogo from '../../assets/monitor/icon-ltc_tp.svg'
// import btcLogo from '../../assets/monitor/icon-btc_tp.svg'
import { TokenInfo } from 'services/customBrowserNode/types'

export interface TokenCurrency {
  name: string,
  urlIcon: string
}

export interface TradingPair {
  principalCurrency: TokenInfo,
  secondaryCurrency: TokenInfo
}

export interface tradingPairDictionaty<T> {
  [key: string]: T;
}

// const WETH: TokenCurrency = { name: 'WETH', urlIcon: wethLogo }
// const USDT: TokenCurrency = { name: 'USDT', urlIcon: usdtLogo }
// const XSN: TokenCurrency = { name: 'XSN', urlIcon: xsnLogo }
// const LTC: TokenCurrency = { name: 'LTC', urlIcon: ltcLogo }
// const BTC: TokenCurrency = { name: 'BTC', urlIcon: btcLogo }

// const ETH: TokenCurrency = { name: 'ETH', urlIcon: wethLogo }
// const USDC: TokenCurrency = { name: 'USDC', urlIcon: usdtLogo }

// const WETH_USDT: TradingPair = { principalCurrency: WETH, secondaryCurrency: USDT }
// const ETH_USDC: TradingPair = { principalCurrency: ETH, secondaryCurrency: USDC }
// const XSN_LTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: LTC }
// const XSN_WETH: TradingPair = { principalCurrency: XSN, secondaryCurrency: WETH }
// const XSN_BTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: BTC }
// const BTC_WETH: TradingPair = { principalCurrency: BTC, secondaryCurrency: WETH }
// const BTC_USDT: TradingPair = { principalCurrency: BTC, secondaryCurrency: USDT }
// const LTC_BTC: TradingPair = { principalCurrency: LTC, secondaryCurrency: BTC }


// export const TRADING_PAIRS: tradingPairDictionaty<TradingPair> = {
//   // 'WETH_USDT': WETH_USDT,
//   'ETH_USDC': ETH_USDC,
//   'XSN_LTC': XSN_LTC,
//   'XSN_WETH': XSN_WETH,
//   'XSN_BTC': XSN_BTC,
//   'BTC_WETH': BTC_WETH,
//   'BTC_USDT': BTC_USDT,
//   'LTC_BTC': LTC_BTC
// }

export const DEFAULT_TRADING_PAIR = 'ETH_USDC'


export const tradingPairsStr = (tradingPair: TradingPair) => `${tradingPair.principalCurrency.name}_${tradingPair.secondaryCurrency.name}`

export const PROMISE_MAX_TIMEOUT = 5000
export const COMPLETED_TRADE_MAX_TIMEOUT = 300000


const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY

export const Goerli: TokenInfo = {
  name: "Ethereum Testnet Görli",
  chainId: 5,
  symbol: "GOR",
  chain: "ETH",
  decimals: 18,
  network: "goerli",
  networkId: 5,
  assetId: "0xbd69fC70FA1c3AED524Bb4E82Adc5fcCFFcD79Fa",
  rpc: [`https://goerli.infura.io/v3/${INFURA_API_KEY}`, "https://rpc.slock.it/goerli ", "https://goerli.prylabs.net/"],
  faucets: ["https://goerli-faucet.slock.it/?address=", "https://faucet.goerli.mudit.blog"],
  infoURL: "https://goerli.net/#about"
}

export const Matic: TokenInfo = {
  name: "Matic Testnet Mumbai",
  chainId: 80001,
  chain: "Matic",
  symbol: "tMATIC",
  decimals: 18,
  network: "testnet",
  networkId: 80001,
  assetId: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
  rpc: ["https://rpc-mumbai.maticvigil.com", "wss://ws-mumbai.matic.today"],
  faucets: ["https://faucet.matic.network/"],
  infoURL: "https://matic.network/"
}


export const ETH: TokenInfo = {
  name: "ETH",
  chainId: 1,
  symbol: "eth",
  chain: "eth",
  decimals: 18,
  logo: ethLogo,
  network: "mainnet",
  networkId: 1,
  assetId: "0x0000000000000000000000000000000000000000",
  rpc: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`],
  faucets: [],
  infoURL: "https://ethereum.org"
}

export const USDC: TokenInfo = {
  name: "USDC",
  chainId: 1,
  symbol: "usdc",
  chain: "eth",
  logo: usdcLogo,
  decimals: 6,
  network: "mainnet",
  networkId: 1,
  assetId: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  rpc: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`],
  faucets: [],
  infoURL: "https://ethereum.org"
}

export const WETH: TokenInfo = {
  name: "WETH",
  chainId: 1,
  symbol: "weth",
  chain: "eth",
  decimals: 18,
  logo: wethLogo,
  network: "mainnet",
  networkId: 1,
  assetId: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  rpc: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`],
  faucets: [],
  infoURL: "https://ethereum.org"
}

export const USDT: TokenInfo = {
  name: "USDT",
  chainId: 1,
  symbol: "usdt",
  chain: "eth",
  decimals: 6,
  logo: usdtLogo,
  network: "mainnet",
  networkId: 1,
  assetId: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  rpc: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`],
  faucets: [],
  infoURL: "https://ethereum.org"
}


export enum ActionsConnext {
  SWAP = 0,
  RECOVER = 1
}



const ETH_USDC: TradingPair = { principalCurrency: ETH, secondaryCurrency: USDC }
const WETH_USDT: TradingPair = { principalCurrency: WETH, secondaryCurrency: USDT }
// const GOERLI_MATIC: TradingPair = { principalCurrency: Goerli, secondaryCurrency: Matic }
// const BTC_WETH: TradingPair = { principalCurrency: BTC, secondaryCurrency: WETH }
// const XSN_LTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: LTC }
// const XSN_WETH: TradingPair = { principalCurrency: XSN, secondaryCurrency: WETH }
// const XSN_BTC: TradingPair = { principalCurrency: XSN, secondaryCurrency: BTC }
// const BTC_USDT: TradingPair = { principalCurrency: BTC, secondaryCurrency: USDT }
// const LTC_BTC: TradingPair = { principalCurrency: LTC, secondaryCurrency: BTC }


// export const TRADING_PAIRS: tradingPairDictionaty<TradingPair> = {
//   // 'WETH_USDT': WETH_USDT,
//   'ETH_USDC': ETH_USDC,
//   'XSN_LTC': XSN_LTC,
//   'XSN_WETH': XSN_WETH,
//   'XSN_BTC': XSN_BTC,
//   'BTC_WETH': BTC_WETH,
//   'BTC_USDT': BTC_USDT,
//   'LTC_BTC': LTC_BTC
// }


export const TRADING_PAIRS: tradingPairDictionaty<TradingPair> = {
  'ETH_USDC': ETH_USDC,
  'WETH_USDT': WETH_USDT
}
