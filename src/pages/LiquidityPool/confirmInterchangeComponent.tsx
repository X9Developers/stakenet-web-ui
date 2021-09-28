import { ButtonLight } from 'components/Button'
import React, { useCallback, useState } from 'react'
import { ConfirmInterchangeModal } from './confirmInterchangeModal'

interface ConfirmInterchangeModalProps {
  inputCurrency: string
  inputAmount: string
  outputCurrency: string
  outputAmount: string
  onInterchange: () => void
  disabled: boolean
}

export const ConfirmInterchangeComponent = ({ inputCurrency, inputAmount, outputCurrency, outputAmount, onInterchange, disabled }: ConfirmInterchangeModalProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismiss = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])


  return (
    <div>
      <ConfirmInterchangeModal
        onDismiss={handleDismiss}
        modalOpen={modalOpen}
        inputCurrency={inputCurrency}
        inputAmount={inputAmount}
        outputCurrency={outputCurrency}
        outputAmount={outputAmount}
        onInterchange={onInterchange}
      />
      <ButtonLight disabled={disabled} onClick={() => setModalOpen(true)}>Interchange</ButtonLight>
    </div>
  )
}
