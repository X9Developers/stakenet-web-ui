import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './index';
import { getContract } from 'utils';
import { Contract } from '@ethersproject/contracts';
import votingContract from 'constants/voting/abis/voting.json'
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ERC20Abi, scAddress, tokenAddrress } from 'constants/voting';

export const useVoting = () => {

  const [contract, setcontract] = useState<Contract | undefined>(undefined)
  const [contractSigner, setContractSigner] = useState<Contract | undefined>(undefined)
  const [, setTokenContract] = useState<Contract | undefined>(undefined)
  const [tokenContractSigner, setTokenContractSigner] = useState<Contract | undefined>(undefined)

  const { account, library } = useActiveWeb3React()

  useEffect(() => {
    const initContract = () => {
      const contract = getContract(scAddress, votingContract, library!)
      setcontract(contract)
      const signer = contract!.connect(library!.getSigner());
      setContractSigner(signer)
      const tokenContract = getContract(tokenAddrress, ERC20Abi, library!)
      setTokenContract(tokenContract)
      const signerTokenContract = tokenContract!.connect(library!.getSigner())
      setTokenContractSigner(signerTokenContract)
    }
    if (account) {
      initContract()
    }
  }, [library, account])

  const getProposals = async () => {
    try {
      const proposals: any[] = await contract!.getProposals();
      return proposals
    } catch (err) {
      throw new Error(err)
    }
  };

  const addProposal = async (title: string, description: string, budget: number) => {
    try {
      const txProposalCost = await contract!.getProposalCost()
      const amount = BigNumber.from(parseUnits(
        BigNumber.from(txProposalCost._hex).toString(),
        18)).toString();
      const txApprove = await tokenContractSigner!.approve(scAddress, amount)
      await txApprove.wait()
      const txProposal = await contractSigner!.addProposal(title, description, budget);
      await txProposal.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  };

  const isVoter = async () => {
    try {
      const voter: boolean = await contract!.isVoter(account!)
      return voter;
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  const getVotersRequiredLockAmount = async () => {
    try {
      const lookAmount = await contract!.getVotersRequiredLockAmount()
      return lookAmount;
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }


  const leaveVoters = async () => {
    try {
      const leaveVoterTx = await contractSigner!.leaveVoters()
      await leaveVoterTx.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  const approveAmountToVote = async () => {
    try {
      const voteCost = await getVotersRequiredLockAmount()
      const amount = BigNumber.from(parseUnits(
        BigNumber.from(voteCost._hex).toString(),
        18)).toString();
      const tx = await tokenContractSigner!.approve(scAddress, amount)
      await tx.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  const joinVoters = async () => {
    try {
      await approveAmountToVote()
      const joinVoterTx = await contractSigner!.joinVoters()
      await joinVoterTx.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }


  const voteFavour = async (proposalId: string) => {
    try {
      const voteTx = await contractSigner!.voteFavour(proposalId)
      await voteTx.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }


  const voteAgainst = async (proposalId: string) => {
    try {
      const voteTx = await contractSigner!.voteAgainst(proposalId)
      await voteTx.wait()
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  const finishVoting = async () => {
    try {
      const finishVotingTx = await contractSigner!.finishVoting()
      await finishVotingTx.wait()
      console.log('finishVotingTx', finishVotingTx)
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  const getProposalById = async (id: string) => {
    try {
      const proposals = await getProposals()
      return proposals.find(p => p.id._hex === id)
    } catch (err) {
      return undefined
    }
  }

  const getOwner = async () => {
    try {
      const owner: string = await contract!.getOwner()
      return owner
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }


  const hasVotedFor = async (address: string, proposalId: string) => {
    try {
      const hasVoted: boolean = await contract!.hasVotedFor(address, proposalId)
      return hasVoted
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  return {
    getProposals,
    addProposal,
    isVoter,
    getVotersRequiredLockAmount,
    joinVoters,
    leaveVoters,
    voteFavour,
    voteAgainst,
    finishVoting,
    contract,
    getProposalById,
    getOwner,
    hasVotedFor
  }
}

