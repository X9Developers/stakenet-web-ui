import { AutoColumn } from 'components/Column'
import { CardNoise, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row';
import { ProposalStatus } from 'pages/Vote/styled';
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme';
import { CardBGImage, CardSection } from '../../components/earn/styled';
import { ExternalLink } from '../../theme/components';
import { Link } from 'react-router-dom'
import { Button } from '../../components/calculator/styleds';
import { darken } from 'polished';
import { useActiveWeb3React } from '../../hooks/index';
import { useVoting } from '../../hooks/useVoting';
import { BigNumber } from 'ethers';
import { ButtonPrimary } from '../../components/Button/index';
import { AutoRow } from '../../components/Row/index';

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


export const Voting = () => {

  const [proposalList, setProposalList] = useState<any[]>([])

  const { account } = useActiveWeb3React()

  const {
    getProposals,
    contract
  } = useVoting()


  const getProposalList = async () => {
    if (contract && account) {
      const proposals = (await getProposals()).slice().reverse()
      setProposalList(proposals)
    } else {
      setProposalList([])
    }
  }




  const savedGetProposalList = useRef(getProposalList)


  useEffect(() => {
    savedGetProposalList.current = getProposalList
  });

  useEffect(() => {
    savedGetProposalList.current()
  }, [contract, account])

  useEffect(() => {
  }, [proposalList])

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
            <ExternalLink
              style={{ color: 'white', textDecoration: 'underline' }}
              href="https://stakenet.io/"
              target="_blank"
            >
              <TYPE.white fontSize={14}>Read more about Stakenet governance</TYPE.white>
            </ExternalLink>
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>
      <TopSection gap="2px">
        <WrapSmall>
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>
            Proposals
          </TYPE.mediumHeader>
          <AutoRow gap="6px" justify="flex-end">
            <ButtonPrimary
              as={Link}
              to="/createProposal"
              style={{ width: 'fit-content', borderRadius: '8px' }}
              padding="8px"
            >
              Create Proposal
            </ButtonPrimary>
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
              <ProposalNumber>{BigNumber.from(proposal.id._hex).toString()}</ProposalNumber>
              <ProposalTitle>{proposal.name}</ProposalTitle>
              <ProposalStatus status={'active'}>{'active'}</ProposalStatus>
            </Proposal>
          ))
        )
      }
    </TopSection >
  )
}
