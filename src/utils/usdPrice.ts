export const getUsd = async (currency: string) => {
  const baseUrl = 'https://xsnexplorer.io/api'
  const url = `${baseUrl}/${currency}/prices`;
  const response = await fetch(url)
  const data = await response.json()
  return data.usd
}

export const getUsdEquivalent = async (amount: string, tokenCurrency: string) => {
  if (Number(amount) === 0) {
    return '0'
  }
  try {
    const token = tokenCurrency.toLocaleLowerCase()
    const priceUsd = await getUsd(token)
    return (Number(amount) * priceUsd).toFixed(2)
  } catch (error) {
    console.log(error)
    return ''
  }
}