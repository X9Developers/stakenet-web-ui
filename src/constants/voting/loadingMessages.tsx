import { LoadingScreenComponentProps } from "components/calculator/loadingScreenComponent"

const subtitle = 'This operation requires some minutes, Metamask will ask you to approve 2 transactions, please be patience'

export const voteFavourLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Voting Favour',
  subtitle: 'please wait a moment'
}

export const leaveVoterLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Stopping being a voter',
  subtitle: 'please wait a moment'
}

export const joinVoterLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Becoming a Voter',
  subtitle: subtitle
}

export const resetLoader: LoadingScreenComponentProps = {
  showLoading: false,
  title: '',
  subtitle: ''
}

export const voteAgainstLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Voting Against',
  subtitle: 'please wait a moment'
}

export const createProposalLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Creating Proposal',
  subtitle: subtitle
}

export const finishVotingLoader: LoadingScreenComponentProps = {
  showLoading: true,
  title: 'Finishing Voting',
  subtitle: 'please wait a moment'
}

