import * as Bip39 from 'bip39';

export const isPassword = (password: string) => {
  const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return passwordPattern.test(password)
}

export const validatePasswords = (password: string, confirmPassword: string) => {
  if (!password) {
    return "The password can't be empty"
  } else if (!isPassword(password)) {
    return "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
  } else if (password !== confirmPassword) {
    return "The passwords must match"
  } else {
    return ""
  }
}

export const validateSeedPhrase = (inputWords: string[]) => {
  const seedPhrase = inputWords.join(' ')
  if (inputWords.every(element => !element)) {
    return "Please enter your seed phrase"
  } else if (!inputWords.every(element => /^[a-zA-Z]+$/.test(element))) {
    return 'The seed phrase words need to be made up of letters'
  } else if (!isValidateMnemonic(seedPhrase)) {
    return 'The seed phrase is not valid'
  } else {
    return '';
  }
}

export const isValidateMnemonic = (mnemonic: string) => Bip39.validateMnemonic(mnemonic)