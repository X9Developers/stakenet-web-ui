import { parseHexBinary, printHexBinary } from "./dataTypeConverter";

export const PaymentRHash = async (preImage: string) => {
  const hash = await crypto.subtle.digest('SHA-256', parseHexBinary(preImage));
  const hashArray = Array.from(new Uint8Array(hash));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

export const untrusted = (byteArray: Uint8Array) => {
  if (byteArray.length === 32) {
    return printHexBinary(byteArray)
  }
  return '';
}

export const untrustedPaymentRHash = (paymentRHash: string) => {
  return untrusted(parseHexBinary(paymentRHash))
}