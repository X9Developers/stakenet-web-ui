import styled from 'styled-components/macro'
import { AutoColumn } from 'components/Column'
import { memo } from 'react'
import { Text } from 'rebass'
import { TextInput } from './TextInput';
import { ArrowLeft } from '../initializeWallet/styleds';

export const TopSection = styled(AutoColumn)`
  max-width: 800px;
  width: 100%;
`

export const ProposalEditorHeader = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text2};
`

export const ProposalTitle = memo(styled(TextInput)`
  margin-top: 10.5px;
  margin-bottom: 7.5px;
`)

export const ProposalEditorContainer = styled.div`
  margin-top: 10px;
  padding: 0.75rem 1rem 0.75rem 1rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`
export const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

export const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`


export const InputContainerCurrency = styled.div`
  align-items: center;
  background-color: #060a1d;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #222d45;
  display:flex;
  flex-flow: row;
  margin: 10px 0;
  // padding: 0.3rem 0.3rem 0.3rem 0.7rem;
  padding: 1rem 1rem 0.75rem;
  width: 100%;
`

export const InputCurrency = styled.input`
  background-color: #060a1d;
  box-sizing: border-box;
  border: none;
  color: white;
  display: flex;
  flex: 1 1 auto;
  font-size: 20px;
  font-weight: 500;
  width: 0;
  outline: none;
  position: relative;
  text-align: left;
  text-overflow: ellipsis;

  ::placeholder {
    color: #565A69;
  }
`


export const InputContainer = styled.div`
  align-items: center;
  background-color: #060a1d;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #222d45;
  display:flex;
  flex-flow: row;
  margin: 10px 0;
  // padding: 0.3rem 0.3rem 0.3rem 0.7rem;
  padding: 1rem 1rem 0.75rem;
  width: 100%;
`
export const EmptyProposals = styled.div`
border: 1px solid ${({ theme }) => theme.text4};
padding: 16px 12px;
border-radius: 12px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`
