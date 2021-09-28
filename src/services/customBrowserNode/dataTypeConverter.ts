// https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
export const printHexBinary = (byteArray: Uint8Array) => {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

export const parseHexBinary = (str: string) => {
  // if (!str) {
  //   return new Uint8Array();
  // }
  const array = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    array.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(array);
}