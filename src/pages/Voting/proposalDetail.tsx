import React, { useEffect, useRef, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { TYPE } from '../../theme'
import { RowFixed, RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled';
import { ArrowLeft } from 'react-feather'
import { ButtonPrimary } from '../../components/Button'
import ReactMarkdown from 'react-markdown'
import { useVoting } from 'hooks/useVoting'
import { BigNumber } from 'ethers';
import { LoadingScreenComponent, LoadingScreenComponentProps } from '../../components/calculator/loadingScreenComponent';
import { resetLoader, voteAgainstLoader, voteFavourLoader } from 'constants/voting/loadingMessages'
import { leaveVoterLoader, joinVoterLoader } from 'constants/voting/loadingMessages';
import { useActiveWeb3React } from '../../hooks/index';
import { ArrowWrapper, EmptyProposals } from './styled';

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 800px;
  width: 100%;
`

const ProposalInfo = styled(AutoColumn)`
  border: 1px solid ${({ theme }) => theme.bg4};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 800px;
  width: 100%;
`

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

const StyledDataCard = styled(DataCard)`
  width: 100%;
  background: none;
  background-color: ${({ theme }) => theme.bg1};
  height: fit-content;
  z-index: 2;
`

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
`

const Progress = styled.div<{ status: 'for' | 'against'; percentageString?: string }>`
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme, status }) => (status === 'for' ? theme.green1 : theme.red1)};
  width: ${({ percentageString }) => percentageString};
`

const MarkDownWrapper = styled.div`
  max-width: 640px;
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    align-items: flex-start;
    flex-direction: column;
  `};
`

export default function ProposalDetail({
  match: {
    params: { id }
  }
}: RouteComponentProps<{ id: string }>) {

  const [proposal, setProposal] = useState<any>(undefined)
  const [voter, setVoter] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setloading] = useState(true)

  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenComponentProps>(resetLoader)

  const { getProposalById, contract, isVoter, joinVoters, voteFavour, leaveVoters, voteAgainst, hasVotedFor } = useVoting()

  const { account } = useActiveWeb3React()

  const getProposal = async () => {
    setProposal(await getProposalById(id))
  }

  const checkVoter = async () => {
    try {
      if (contract) {
        setVoter(await isVoter())
      } else {
        setVoter(false)
      }
    } catch (err) {
      console.log(err)
      setVoter(false)
      setLoadingScreen(resetLoader)
    }
  }

  const checkHasVotedFor = async () => {
    try {
      if (proposal && account) {
        setloading(true)
        setHasVoted(await hasVotedFor(account!, proposal.id._hex))
        setloading(false)
      } else {
        setHasVoted(false)
      }
    } catch (err) {
      setloading(false)
      console.log(err)
      setHasVoted(false)
    }
  }

  const savedGetProposal = useRef(getProposal)

  const savedIsVoter = useRef(checkVoter)
  const savedCheckHasVotedFor = useRef(checkHasVotedFor)

  useEffect(() => {
    savedGetProposal.current = getProposal
    savedIsVoter.current = checkVoter
    savedCheckHasVotedFor.current = checkHasVotedFor
  });

  useEffect(() => {
    savedGetProposal.current()
    savedIsVoter.current()
  }, [contract, id])


  useEffect(() => {
    savedCheckHasVotedFor.current()
  }, [proposal])


  const handleJoinVoter = async () => {
    try {
      setLoadingScreen(joinVoterLoader)
      await joinVoters()
      setVoter(true)
      setLoadingScreen(resetLoader)
    } catch (err) {
      console.log(err)
      setLoadingScreen(resetLoader)
    }
  }

  const handleLeaveVoter = async () => {
    try {
      setLoadingScreen(leaveVoterLoader)
      await leaveVoters()
      setVoter(false)
      setLoadingScreen(resetLoader)
    } catch (err) {
      console.log(err)
      setLoadingScreen(resetLoader)
    }
  }

  const getTotalVotes = () => {
    if (proposal) {
      return BigNumber.from(proposal.favourCount).add(BigNumber.from(proposal.againstCount)).toString()
    }
    return '0'
  }

  const calculateprocetangeVoteFavour = () => {
    if (Number(proposal.favourCount) === 0) {
      return 0
    } else {
      return (Number(getTotalVotes()) * 100) / Number(proposal.favourCount)
    }
  }

  const calculateprocetangeVoteAgainst = () => {
    if (Number(proposal.againstCount) === 0) {
      return 0
    } else {
      return (Number(getTotalVotes()) * 100) / Number(proposal.againstCount)
    }
  }

  const handleVoteFavour = async () => {
    try {
      setLoadingScreen(voteFavourLoader)
      await voteFavour(BigNumber.from(proposal.id._hex).toString())
      setLoadingScreen(resetLoader)
      getProposal()
    } catch (err) {
      setLoadingScreen(resetLoader)
      console.log(err)
    }
  }

  const handleVoteAgainst = async () => {
    try {
      setLoadingScreen(voteAgainstLoader)
      await voteAgainst(BigNumber.from(proposal.id._hex).toString())
      setLoadingScreen(resetLoader)
      getProposal()
    } catch (err) {
      setLoadingScreen(resetLoader)
      console.log(err)
    }
  }

  const showVoterButtons = () => {
    if (account! === proposal.proposer) {
      return false
    } else if (voter && !hasVoted) {
      return true
    } else {
      return false
    }
  }

  return (
    <PageWrapper gap="lg" justify="center">

      <TopSection gap="2px">
        <WrapSmall>
          <ProposalInfo gap="lg" justify="start">


            {(proposal)
              ? (
                <>
                  <RowBetween style={{ width: '100%' }}>
                    <ArrowWrapper to="/voting">
                      <ArrowLeft size={20} /> All Proposals
                    </ArrowWrapper>
                    <RowFixed style={{ gap: '12px' }}>
                      {(voter)
                        ?
                        (<ButtonPrimary
                          padding="8px"
                          borderRadius="8px"
                          onClick={() => {
                            handleLeaveVoter()
                          }}
                        >
                          Stop being a Voter
                        </ButtonPrimary>)
                        :
                        (<ButtonPrimary
                          padding="8px"
                          borderRadius="8px"
                          onClick={() => {
                            handleJoinVoter()
                          }}
                        >
                          Become Voter
                        </ButtonPrimary>)
                      }
                    </RowFixed>
                  </RowBetween>

                  <AutoColumn gap="10px" style={{ width: '100%' }}>
                    <TYPE.largeHeader style={{ marginBottom: '.5rem' }}>{proposal?.name}</TYPE.largeHeader>
                  </AutoColumn>
                  {showVoterButtons() && !loading && (
                    <RowFixed style={{ width: '100%', gap: '12px' }}>
                      <ButtonPrimary
                        padding="8px"
                        borderRadius="8px"
                        onClick={handleVoteFavour}
                      >
                        Vote Favour
                      </ButtonPrimary>
                      <ButtonPrimary
                        padding="8px"
                        borderRadius="8px"
                        onClick={handleVoteAgainst}
                      >
                        Vote Against
                      </ButtonPrimary>
                    </RowFixed>
                  )
                  }
                  <CardWrapper>
                    <StyledDataCard>
                      <CardSection>
                        <AutoColumn gap="md">
                          <WrapSmall>
                            <TYPE.black fontWeight={600}>Favour</TYPE.black>
                            <TYPE.black fontWeight={600}>
                              {' '}
                              {proposal?.favourCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TYPE.black>
                          </WrapSmall>
                        </AutoColumn>
                        <ProgressWrapper>
                          <Progress status={'for'} percentageString={`${calculateprocetangeVoteFavour()}%`} />
                        </ProgressWrapper>
                      </CardSection>
                    </StyledDataCard>
                    <StyledDataCard>
                      <CardSection>
                        <AutoColumn gap="md">
                          <WrapSmall>
                            <TYPE.black fontWeight={600}>Against</TYPE.black>
                            <TYPE.black fontWeight={600}>
                              {proposal?.againstCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TYPE.black>
                          </WrapSmall>
                        </AutoColumn>
                        <ProgressWrapper>
                          <Progress status={'against'} percentageString={`${calculateprocetangeVoteAgainst()}%`} />
                        </ProgressWrapper>
                      </CardSection>
                    </StyledDataCard>
                  </CardWrapper>
                  <AutoColumn gap="md">
                    <TYPE.mediumHeader fontWeight={600}>Budget</TYPE.mediumHeader>
                    <MarkDownWrapper>
                      <TYPE.mediumHeader
                        color={'#69f0ae'}
                        fontWeight={600}
                      >
                        {`${Number(proposal.budget._hex)} wei`}
                      </TYPE.mediumHeader>
                    </MarkDownWrapper>
                  </AutoColumn>
                  <AutoColumn gap="md">
                    <TYPE.mediumHeader fontWeight={600}>Description</TYPE.mediumHeader>
                    <MarkDownWrapper>
                      <ReactMarkdown source={proposal.description} />
                    </MarkDownWrapper>
                  </AutoColumn>
                  <AutoColumn gap="md">
                    <TYPE.mediumHeader fontWeight={600}>Proposer</TYPE.mediumHeader>
                    <ReactMarkdown source={proposal.proposer} />
                  </AutoColumn>
                </>
              )
              : (
                <>
                  <RowBetween style={{ width: '100%' }}>
                    <ArrowWrapper to="/voting">
                      <ArrowLeft size={20} /> All Proposals
                    </ArrowWrapper>
                  </RowBetween>
                  <RowBetween style={{ width: '100%' }}>
                    <EmptyProposals style={{ width: '100%' }}>
                      <TYPE.body style={{ marginBottom: '8px' }}>Proposal not found.</TYPE.body>
                    </EmptyProposals>
                  </RowBetween>
                </>
              )
            }
          </ProposalInfo>
        </WrapSmall>
      </TopSection>
      <LoadingScreenComponent {...loadingScreen} />
    </PageWrapper >
  )
}
