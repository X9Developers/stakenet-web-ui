import { DEFAULT_HD_PATH } from 'constants/hdWallet';
import { Keyring } from 'state/keyring/actions';
import * as Bip39 from 'bip39';

const typeTree = "hdKeyTree"
const numberOfAccounts = 1

export const generateKeyring = (typeTree: string, hdPath: string, seedPhrase: string, accounst: number) => {
  // The object class causes conflicts with the serialization of redux state.
  // A literal object was used instead 
  const keyring: Keyring = {
    type: typeTree,
    data: {
      mnemonic: seedPhrase,
      numberOfAccounts: accounst,
      hdPath: hdPath
    }
  }
  return keyring;
}

export const createNewKeyring = () => {
  const seedPhrase = Bip39.generateMnemonic()
  return generateKeyring(typeTree, DEFAULT_HD_PATH, seedPhrase, numberOfAccounts)
}