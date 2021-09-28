import { parseHexBinary, printHexBinary } from "./dataTypeConverter";

export const untrusted = (byteArray: Uint8Array) => {
  if (byteArray.length === 32) {
    return printHexBinary(byteArray)
  }
  return '';
}

export const untrustedPreImage = (preImage: string) => {
  return untrusted(parseHexBinary(preImage))
}

export const preImage = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return printHexBinary(array)
}