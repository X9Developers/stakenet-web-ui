import { AMPL, MKR, USDT, WBTC } from './../../constants/index'
import { ChainId, Currency, CurrencyAmount, ETHER, JSBI, Pair, Token, TokenAmount, WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateWalletBalance(): TokenAmount | undefined {
  const allTokenBalances = useAllTokenBalances()
  const { chainId } = useActiveWeb3React()
  if (chainId == null) return


  const usdBalance = Object.entries(allTokenBalances)
    .filter(([_, tokenBalance]) => tokenBalance != null)
    .reduce((runningBalance, [_, tokenBalance]) => {
      return JSBI.add(runningBalance, tokenBalance!.raw)
    }, JSBI.BigInt(0))

  return new TokenAmount(
    USDT[chainId],
    usdBalance,
  )
}

// Wallet Page functions
export function useSyntheticPools(): Pair[] {
  const { chainId } = useActiveWeb3React()
  if (chainId !== ChainId.MAINNET) { return [] }
  return [
    new Pair(new TokenAmount(WETH[chainId], JSBI.BigInt(630000000000000000)), new TokenAmount(AMPL, JSBI.BigInt(26530000000))),
    new Pair(new TokenAmount(WETH[chainId], JSBI.BigInt(833646000000000000)), new TokenAmount(USDT[chainId], JSBI.BigInt(185000000))),
    new Pair(new TokenAmount(WETH[chainId], JSBI.BigInt(750270000000000000)), new TokenAmount(WBTC, JSBI.BigInt(467000))),
    new Pair(new TokenAmount(WETH[chainId], JSBI.BigInt(425430000000000000)), new TokenAmount(MKR, JSBI.BigInt(2365000000000000))),
  ]
}

export function useSyntheticWallet(): CurrencyAmount[] {
  const { chainId } = useActiveWeb3React()
  switch (chainId) {
    case ChainId.MAINNET: return [
      CurrencyAmount.ether(JSBI.BigInt(2300000000000000000)),
      new TokenAmount(USDT[ChainId.MAINNET], JSBI.BigInt(1850000000)),
      new TokenAmount(AMPL, JSBI.BigInt(278700000000)),
      new TokenAmount(WBTC, JSBI.BigInt(4675000)),
      new TokenAmount(MKR, JSBI.BigInt(236554000000000000)),
    ]
    case ChainId.RINKEBY: return [
      CurrencyAmount.ether(JSBI.BigInt(2300000000000000000)),
      new TokenAmount(USDT[ChainId.RINKEBY], JSBI.BigInt(1850000000)),
    ]
    default: return []
  }
}
