import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.div`
  background-color: #081634;
  height: 100%;
  margin: 0 auto;
  margin-top: 50px;
  max-width: 1200px;
  padding: 20px;
`
export const ContainerTitle = styled.h1`
  color:white;
  text-align: center;
`

export const ContainerSubtitle = styled.h2`
  color: white;
  text-align: center;
`
export const ContainerText = styled.p`
  color: white;
  text-align: center;
`

export const StyledLink = styled(Link)`
  text-align: center;
  text-decoration: none;
`

export const LabelBack = styled.label`
  color: white;
  display: inline-block;
  font-size: 20px;
  margin-top: 10px;
  opacity: 0.7;

  :hover{
    cursor: pointer;
  }
`

export const ArrowLeft = styled.i`
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;

  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content : space-evenly;
  margin-top: 20px;
`

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const InputLabel = styled.label`
  color: white;
  padding: 5px;
`

export const InputField = styled.input`
  background-color: #060a1d;
  border:none;
  border-radius: 10px;
  color: #565A69;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px 20px;
  width: 250px;
  
  :focus{
    outline: none;
  }

`

export const Button = styled.button`
  background-color: rgba(21, 61, 111, 0.44);
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  font-size: 1em;
  margin: 10px auto;
  padding: 10px 35px;
  text-align: center;
  width: 200px;
`

export const ContainerActions = styled.div<{
  flexDirection?: string,
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
  justify-content: center;
  margin: 20px 0;
`

export const LogoStakenet = styled.img`
  display: block;
  margin: 10px auto;
`

export const ErrorDiv = styled.div<{
  width?: string,
  justifyContent?: string
}>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent ?? 'center'};
  width: ${({ width }) => width ?? '100%'};
  color: #dc3545; 
`

export const TextError = styled.p`
  color: #dc3545; 
`

export const CheckboxContainer = styled.label`
  margin: 10px 0;
  :hover{
    cursor: pointer;
  }
`

export const Checkbox = styled.input`
  transform: scale(1.5);
  margin-right: 10px;
  
`