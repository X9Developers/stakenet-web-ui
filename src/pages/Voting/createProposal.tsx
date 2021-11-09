import { AutoColumn } from 'components/Column'
import React, { useCallback, useState } from 'react'
import { ResizingTextArea } from './TextInput';
import { useVoting } from '../../hooks/useVoting';
import { AutoRow } from '../../components/Row/index';
import { ButtonPrimary } from '../../components/Button';
import Row from 'components/Row';
import { Link as HistoryLink } from 'react-router-dom'
import { escapeRegExp } from 'utils';
import { LoadingScreenComponentProps, LoadingScreenComponent } from '../../components/calculator/loadingScreenComponent';
import { resetLoader } from '../../constants/liquidity-pool/loadingMessagges';
import { createProposalLoader } from '../../constants/voting/loadingMessages';
import { useHistory } from 'react-router';
import { useActiveWeb3React } from 'hooks';
import { ActiveText, InputContainer, ProposalEditorContainer, ProposalEditorHeader, ProposalTitle, StyledArrowLeft, Tabs, TopSection } from './styled';


export const CreateProposal = () => {

  const [titleValue, setTitleValue] = useState('')
  const [bodyValue, setBodyValue] = useState('')
  const [budgetValue, setBudgetValue] = useState('')
  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenComponentProps>(resetLoader)

  const history = useHistory()

  const handleTitleInput = useCallback(
    (title: string) => {
      setTitleValue(title)
    },
    [setTitleValue]
  )




  const handleBodyInput = useCallback(
    (body: string) => {
      setBodyValue(body)
    },
    [setBodyValue]
  )

  const bodyPlaceholder = `## Summary
  Insert your summary here
  ## Methodology
    
  Insert your methodology here
  ## Conclusion
    
  Insert your conclusion here    
    `


  const { account } = useActiveWeb3React()

  const {
    addProposal,
  } = useVoting()


  const createProposal = async () => {
    try {
      setLoadingScreen(createProposalLoader)
      await addProposal(titleValue, bodyValue, Number(budgetValue))
      setLoadingScreen(resetLoader)
      history.push("/voting")
    } catch (err) {
      console.log(err)
      setLoadingScreen(resetLoader)
    }
  }

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

  const validateData = () => titleValue && bodyValue && budgetValue && account ? true : false


  const handleBudgetInput = useCallback(
    (budget: string) => {
      if (budget === '' || inputRegex.test(escapeRegExp(budget))) {
        setBudgetValue(budget)
      }
    },
    [setBudgetValue, inputRegex]
  )

  return (
    <TopSection gap="md">
      <Tabs>
        <Row style={{ padding: '1rem 1rem 0 1rem' }}>
          <HistoryLink to="/voting">
            <StyledArrowLeft />
          </HistoryLink>
          <ActiveText style={{ marginLeft: 'auto', marginRight: 'auto' }}>Create Proposal</ActiveText>
        </Row>
      </Tabs>

      <InputContainer>
        <AutoColumn style={{ width: '100%' }}>

          <ProposalEditorHeader>
            Budget
          </ProposalEditorHeader>
          <ProposalTitle value={budgetValue} onUserInput={handleBudgetInput} placeholder={`0.0`} fontSize="1.25rem" />
        </AutoColumn>
      </InputContainer>

      <ProposalEditorContainer className={'className'}>
        <ProposalEditorHeader>
          Proposal
        </ProposalEditorHeader>
        <ProposalTitle value={titleValue} onUserInput={handleTitleInput} placeholder={`Proposal Title`} fontSize="1.25rem" />
        <hr />
        <ResizingTextArea value={bodyValue} onUserInput={handleBodyInput} placeholder={bodyPlaceholder} fontSize="1rem" />
      </ProposalEditorContainer>
      <AutoRow>
        <ButtonPrimary
          style={{ borderRadius: '16px' }}
          padding="1rem 1rem 0.75rem"
          onClick={createProposal}
          disabled={!validateData()}
        >
          Create Proposal
        </ButtonPrimary>
      </AutoRow>
      <LoadingScreenComponent {...loadingScreen} />
    </TopSection >
  )
}
