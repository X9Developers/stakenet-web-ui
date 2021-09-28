import { PreImage } from "./preImage";
import { parseHexBinary, printHexBinary } from './dataTypeConverter';


export class PaymentRHash {

  byteArray: Uint8Array;

  constructor(byteArray: Uint8Array) {
    this.byteArray = byteArray
  }

  public static untrusted = (byteArray: Uint8Array) => {
    if (byteArray.length === 32) {
      return new PreImage(byteArray)
    }
    throw new Error("Incorrect Value")
  }

  public static untrustedPreImage = (preImage: string) => {
    return PreImage.untrusted(parseHexBinary(preImage))
  }


  public static from = async (preImage: PreImage) => {
    const hash = await crypto.subtle.digest('SHA-256', preImage.byteArray);
    return new PaymentRHash(new Uint8Array(hash))
    // const hashArray = Array.from(new Uint8Array(hash));                     // convert buffer to byte array
    // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    // return hashHex;
  }

  toString() {
    return printHexBinary(this.byteArray)
  }
}