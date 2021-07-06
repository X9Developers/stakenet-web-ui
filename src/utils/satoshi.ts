
import Big from 'big.js';
const SATOSHIS_SCALE = 100000000;

export const satoshiToValue = (value: string | number) => {
  return Big(value).div(Big(SATOSHIS_SCALE));
};

export const toSatoshi = (value: string | number) => {
  return Big(value).times(Big(SATOSHIS_SCALE));
}

export const toSatoshiWithPrecision = (value: string | number, precision: number) => {
  return toSatoshi(Big(value).toFixed(precision)).toString();
}

export const satoshiToValueWithPrecision = (value: string | number, precision: number) => {
  return Big(value).div(Big(SATOSHIS_SCALE)).toFixed(precision);
};

