import React from 'react';
import { ConnextError, ERROR_STATES, resetConnextError } from '../../constants/liquidity-pool/connextErrors';
import { RetryScreenModal } from './retryScreenModal';
import { ErrorScreenModal } from './errorScreenModal';
import { TokenInfo } from '../../services/customBrowserNode/types';

interface HandleErrorComponentProps {
  connextError: ConnextError,
  inputCurrencyToken: TokenInfo,
  outputCurrencyToken: TokenInfo,
  setConnextError: (connextError: ConnextError) => void,
  account: string,
  retrySetup: () => void

}

export const HandleErrorComponent = ({
  connextError,
  inputCurrencyToken,
  outputCurrencyToken,
  setConnextError,
  account,
  retrySetup
}: HandleErrorComponentProps) => {

  const handleErrorScreen = (connextError: ConnextError) => {
    if (connextError.type === ERROR_STATES.ERROR_SETUP) {
      return (
        < RetryScreenModal
          onDismiss={() => {
            setConnextError(resetConnextError)
          }}
          modalOpen={true}
          error={connextError.message}
          senderChain={inputCurrencyToken.name}
          receiverChain={outputCurrencyToken.name}
          addressAccount={account!}
          retry={retrySetup}
        />
      )
    }
    else if (connextError.type === ERROR_STATES.ERROR_WALLET_NOT_FOUND) {
      return (
        <ErrorScreenModal
          onDismiss={() => {
            setConnextError(resetConnextError)
          }}
          modalOpen={true}
          error={connextError.message}
        />
      )
    }
    else if (connextError.type !== ERROR_STATES.ERROR_RESET) {
      return (
        < RetryScreenModal
          onDismiss={() => {
            setConnextError(resetConnextError)
          }}
          modalOpen={true}
          title={'Transaction Failed'}
          error={connextError.message}
          senderChain={inputCurrencyToken.name}
          receiverChain={outputCurrencyToken.name}
          addressAccount={account!}
        />
      )
    } else {
      return ('')
    }
  }

  return (
    <>
      {handleErrorScreen(connextError)}
    </ >
  )
}
