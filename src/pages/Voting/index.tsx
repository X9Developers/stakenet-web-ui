import { AutoColumn } from 'components/Column'
import { CardNoise, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row';
import { ProposalStatus } from 'pages/Vote/styled';
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme';
import { CardBGImage, CardSection } from '../../components/earn/styled';
import { Link } from 'react-router-dom'
import { Button } from '../../components/calculator/styleds';
import { darken } from 'polished';
import { useActiveWeb3React } from '../../hooks/index';
import { useVoting } from '../../hooks/useVoting';
import { BigNumber } from 'ethers';
import { ButtonPrimary } from '../../components/Button/index';
import { AutoRow } from '../../components/Row/index';
import { resetLoader, finishVotingLoader } from '../../constants/voting/loadingMessages';
import { LoadingScreenComponentProps, LoadingScreenComponent } from '../../components/calculator/loadingScreenComponent';
import { useWalletModalToggle } from '../../state/application/hooks';
import Column from 'components/Column';

const TopSection = styled(AutoColumn)`
  max-width: 800px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Proposal = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
`

const ProposalNumber = styled.span`
  opacity: 0.6;
`

const ProposalTitle = styled.span`
  font-weight: 600;
`

const WrapSmall = styled(RowBetween)`
  margin-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`
const TitleSection = styled.div`
  color: gray;
  font-size: 0.9rem;
  line-height: 1.4375em;
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

export const Voting = () => {

  const [proposalList, setProposalList] = useState<any[]>([])
  const { account } = useActiveWeb3React()
  const [isOwnerValue, setIsOwnerValue] = useState(false)
  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenComponentProps>(resetLoader)


  const toggleWalletModal = useWalletModalToggle()

  const {
    getProposals,
    contract,
    finishVoting,
    getOwner
  } = useVoting()

  const getProposalList = async () => {
    if (contract && account) {
      const proposals = (await getProposals()).slice().reverse()
      setProposalList(proposals)
    } else {
      setProposalList([])
    }
  }

  const isOwner = async () => {
    try {
      if (contract) {
        const owner = await getOwner()
        console.log('owner', owner)
        console.log('isOwner: ', account === owner)
        setIsOwnerValue(account === owner)
      } else {
        setIsOwnerValue(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const savedGetProposalList = useRef(getProposalList)
  const savedIsOwner = useRef(isOwner)

  useEffect(() => {
    savedGetProposalList.current = getProposalList
    savedIsOwner.current = isOwner
  });

  useEffect(() => {
    savedGetProposalList.current()
    savedIsOwner.current()
  }, [contract, account])

  useEffect(() => {
  }, [proposalList])

  const handleFinishVoting = async () => {
    try {
      setLoadingScreen(finishVotingLoader)
      await finishVoting()
      await getProposalList()
      setLoadingScreen(resetLoader)
    } catch (err) {
      setLoadingScreen(resetLoader)
      console.log(err)
    }
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    toggleWalletModal()
  }

  return (
    <TopSection gap="md">
      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Stakenet Governance</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontSize={14}>
                Ropsten tokens represent voting shares in Stakenet governance. You can vote on each proposal yourself or
                delegate your votes to a third party.
              </TYPE.white>
            </RowBetween>
            <StyledLink
              id={'Stakenet governance'}
              style={{ color: 'white', textDecoration: 'underline' }}
              href={"https://stakenet.io/"}
              target="_blank"
            >
              <TYPE.white fontSize={14}>Read more about Stakenet governance</TYPE.white>
            </StyledLink>
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>
      <TopSection gap="2px">
        {(isOwnerValue) &&

          <AutoRow justify="center" style={{ margin: '2px' }}>
            <ButtonPrimary
              style={{ width: '100%', borderRadius: '8px' }}
              padding="8px"
              onClick={handleFinishVoting}
            >
              Finish Voting
            </ButtonPrimary>
          </AutoRow>
        }
        <WrapSmall>
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>
            Proposals
          </TYPE.mediumHeader>
          <AutoRow gap="6px" justify="flex-end">
            {(!account)
              ? <ButtonPrimary
                style={{ width: 'fit-content', borderRadius: '8px' }}
                padding="8px"
                onClick={handleSubmit}>
                Connect Wallet
              </ButtonPrimary>
              :
              <ButtonPrimary
                as={Link}
                to="/createProposal"
                style={{ width: 'fit-content', borderRadius: '8px' }}
                padding="8px"
              >
                Create Proposal
              </ButtonPrimary>
            }
          </AutoRow>
        </WrapSmall>
      </TopSection>
      {(proposalList.length === 0) ?
        <EmptyProposals>
          <TYPE.body style={{ marginBottom: '8px' }}>No proposals found.</TYPE.body>
          <TYPE.subHeader>
            <i>Proposals submitted by community members will appear here.</i>
          </TYPE.subHeader>
        </EmptyProposals>
        :
        (
          proposalList.map((proposal: any) => (
            <Proposal as={Link} to={`/proposalDetail/${proposal.id._hex}`} key={Math.random().toString()}>
              <Column>
                <TitleSection >Id</TitleSection>
                <ProposalNumber>{BigNumber.from(proposal.id._hex).toString()}</ProposalNumber>
              </Column>
              <ProposalTitle>{proposal.name}</ProposalTitle>
              <ProposalStatus status={'active'}>{'active'}</ProposalStatus>
            </Proposal>
          ))
        )
      }
      <LoadingScreenComponent {...loadingScreen} />
    </TopSection >
  )
}