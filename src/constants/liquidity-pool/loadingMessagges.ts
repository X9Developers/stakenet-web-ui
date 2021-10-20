import { LoadingScreenComponentProps } from "components/calculator/loadingScreenComponent"



export const settingUpChannelsLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Setting up channels',
  subtitle: 'please wait a moment'
}

export const checkingPendingTransferLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'checking for pending transfers',
  subtitle: 'please wait a moment'
}

export const recoverAmountLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'recovering amount',
  subtitle: 'please wait a moment'
}

export const resetLoader: LoadingScreenComponentProps = {
  showLoading: false,
  title: '',
  subtitle: ''
}

export const depositLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'depositing amount',
  subtitle: 'please wait a moment'
}

export const createTransferLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'creating transfers',
  subtitle: 'please wait a moment'
}

export const resolveTransferLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'resolving transfers',
  subtitle: 'please wait a moment'
}

