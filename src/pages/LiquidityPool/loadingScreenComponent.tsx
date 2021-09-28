import React, { useCallback } from 'react'
import { LoadingScreenComponentModal } from './loadingScreenComponentModal';

export interface LoadingScreenComponentProps {
  title: string
  subtitle: string
  showLoading: boolean
}

export const LoadingScreenComponent = ({ title, subtitle, showLoading }: LoadingScreenComponentProps) => {

  const handleDismiss = useCallback(() => {
    console.log('please wait until the process is finished')
  }, [])

  return (
    <div>
      <LoadingScreenComponentModal
        onDismiss={handleDismiss}
        modalOpen={showLoading}
        title={title}
        subtitle={subtitle}
      />
    </div >
  )
}
