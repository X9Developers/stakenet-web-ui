import { AbstractConnector } from '@web3-react/abstract-connector'
import ChannelWalletAccountDetails from 'components/ChannelWalletAccountDetails'
import React, { useEffect, useState } from 'react'
import { useChannelWalletState } from 'state/user/hooks'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import usePrevious from '../../hooks/usePrevious'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'

import Modal from '../Modal'
import ChannelWalletCreatePendingView from './PendingView'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  CREATE_OR_RECOVER: 'create_or_recover',
  CREATING_WALLET: 'creating_wallet',
  SEED_PHRASE_RECOVERY: 'seed_phrase_recovery',
  ACCOUNT: 'account',
}

export default function ChannelWalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // Wallet Model Flow
  // If Wallet connected, show wallet connected screen with chain the wallet SC exists on and pending txns
  // If no wallet created, show:
  //    Option to Create Wallet on either Binance or Ethereum chains
  //    If encrypted seed phrase in storage show seed phrase unlock input (alternative enter seed phrase button below)
  //    If no encrypted seed phrase in storage show 'recover with seed phrase' 

  // important that these are destructed from the account-specific web3-react context
  const { active, address, error } = useChannelWalletState()
  // const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [channelWalletCreationError, setChannelWalletCreationError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const prevActive = usePrevious(active)

  // close on connection, when logged out before
  useEffect(() => {
    if (address && !prevActive && walletModalOpen) {
      toggleWalletModal()
    }
  }, [address, prevActive, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setChannelWalletCreationError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  useEffect(() => {
    if (walletModalOpen && (active && !activePrevious)) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, walletModalOpen, activePrevious])

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>Error creating or connecting to channel wallet</HeaderRow>
          <ContentWrapper>
            Error connecting to the channel wallet, either your seed phrase is wrong or the channel states could not be loaded.
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (address && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <ChannelWalletAccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView === WALLET_VIEWS.CREATE_OR_RECOVER &&
          <HeaderRow>
            <HoverText>Create or recover channel wallet</HoverText>
          </HeaderRow>
        }
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setChannelWalletCreationError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>Connect to a wallet</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.CREATE_OR_RECOVER &&
            <>
              <Blurb>
                <span>New to Layer 2? &nbsp;</span>{' '}
                <ExternalLink href="https://medium.com/stakenet/layer-2-vs-sidechains-xsn-research-c6cd8b66a94a">Learn more about layer 2 channel wallets here.</ExternalLink>
              </Blurb>
            </>
          }
          {walletView === WALLET_VIEWS.SEED_PHRASE_RECOVERY &&
            <>
              <Blurb>
                Enter your channel wallet seed phrase below to recover your wallet (NO OTHER SITES WILL ASK FOR THIS)
              </Blurb>
            </>
          }
          {walletView === WALLET_VIEWS.CREATING_WALLET &&
            <ChannelWalletCreatePendingView
              error={channelWalletCreationError}
              setChannelWalletCreationError={setChannelWalletCreationError}
            />
          }
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
