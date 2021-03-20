import { Trade } from '@uniswap/sdk'
import React, { useCallback } from 'react'
import { Field } from 'state/swap/actions'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import SwapModalHeader from './SwapModalHeader'

export default function PreviewSwapSection({
  trade,
  allowedSlippage,
  recipient,
  attemptingTxn,
  txHash,
  acceptChangesRequired,
  swapErrorMessage,
  usdEquivalencies,
}: {
  trade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  swapErrorMessage: string | undefined
  acceptChangesRequired: boolean
  usdEquivalencies: { [field in Field]: string }
}) {

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        acceptChangesRequired={acceptChangesRequired}
        usdEquivalencies={usdEquivalencies}
      />
    ) : null
  }, [allowedSlippage, recipient, acceptChangesRequired, trade, usdEquivalencies])

  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    trade?.inputAmount?.currency?.symbol
  } for ${trade?.outputAmount?.toSignificant(6)} ${trade?.outputAmount?.currency?.symbol}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          topContent={modalHeader}
          bottomContent={() => null}
        />
      ),
    [modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}
