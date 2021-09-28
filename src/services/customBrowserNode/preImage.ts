import { parseHexBinary, printHexBinary } from "./dataTypeConverter";


export class PreImage {

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


  public static getRandom = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return new PreImage(array)
  }

  toString() {
    return printHexBinary(this.byteArray)
  }
}