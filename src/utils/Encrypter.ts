const passworder = require('browser-passworder')

export const encryptObject = (password: string, data: Object) => {
  return passworder.encrypt(password, data)
}

export const decryptObject = (password: string, data: string) => {
  return passworder.decrypt(password, data)
}