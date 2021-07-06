import styled from 'styled-components'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

export const Container = styled.div`
  background-color: #081634;
  height: 100%;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  // padding: 20px;
  position: relative;
  padding: 0;
`

export const FormColumn = styled.div`
  display: flex;
  flex-flow: column;
  width: 350px;
  gap: 20px;
  margin: 0 auto;
`

export const Select = styled.select`
  background-color: #060a1d;
  color: white;
  border: none;
  // color: white;
  font-size: 14px;
  height: 30px;
  padding: 5px;
  width: 250px;
  margin: 0 auto;
`

export const Button = styled.button`
  background-color: rgba(21,61,111,0.44);
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;

  :disabled {
    background-color: #08142e;
    color: #6C7284;
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 1;
  }
`

export const ModalContainer = styled.div`
  background-color: #081634;
  background-color: ${({ theme }) => theme.bg1};
  height: 100%;
  margin: 0 auto;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
`

export const ContainerText = styled.div`
  background-color: #060a1d;
  border: none;
  color: white;
  width: 100%;
  // padding: 12px 5px;
  display: flex;
  border-radius: 4px;
  padding: 1rem 1rem 0.75rem;
`

export const InputText = styled.input`
  background-color: #060a1d;
  border: none;
  color: white;
  width: 80%;
  padding: 12px 5px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid black;
  border-radius: 4px;
  box-sizing: border-box;  
  text-align: right;
`

export const ContainerTextNumericPart = styled.div`
  background-color: #060a1d;
  border:none;
  color: white;
  width: 100%;
  padding: 12px 5px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid black;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 1rem 1rem 0.75rem;
`

export const CurrencyButton = styled.button`
  background-color: rgba(21,61,111,0.44);
  border: none;
  color: white;
  width: 20%;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;

  :disabled {
    background-color: #08142e;
    color: #6C7284;
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 1;
  }
`

export const InputContainerCurrency = styled.div`
  align-items: center;
  background-color: #060a1d;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #222d45;
  display:flex;
  flex-flow: row;
  margin: 10px 0;
  max-width: 420px;
  padding: 0.3rem 0.3rem 0.3rem 0.7rem;
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

export const ContainerCurrency = styled.div`
  align-items: center;
  background-color: #222d45;
  border-radius: 10px;
  box-sizing: border-box;
  border: none;
  color: white;
  display: flex;
  font-size: 20px;
  height: 75px;
  max-width: 420px;
  padding: 0 1rem;
  width: 100%;
`

export const InputAmount = styled.div`
  background-color: #060a1d;
  box-sizing: border-box;
  color: white;
  display: inline;
  font-size: 14px;
  font-weight: 500;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
`


export const FormColumnCurrency = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-width: 300px;
  max-width: 420px;
  /*width: 420px;*/
  flex: 1;
  align-items: center;

  @media only screen and (max-width: 600px){
    width: 100%;
    min-width: 100%;
    max-width: initial;
  }
`

export const StyledSwapHeader = styled.div`
  padding-left: 1.5rem;
  padding-right: 1rem;
  height: 60px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.text2};
`

export const ContainerButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 4;
  position: relative;
  left: 0;
  right: 0;
`

export const ContainerSwapBottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`

export const HeaderTitle = styled.div`
  font-weight: 500;
`

export const CurrencyListItem = styled.div <{ disabled: boolean }>`
  height: 60px;
  display: flex;
  align-items: center;
  flex: 1;
  gap: 20px;
  alignItems: center;
  padding: 20px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  :hover {
      background-color: ${({ theme }) => theme.bg2};
  }
`

export const StyledDropDown = styled(DropDown) <{ disabled: boolean, selected: boolean }>`
margin: 0 0.25rem 0 0.5rem;
height: 35%;
opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

path {
  stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  stroke-width: 1.5px;
}
`

export const EmptyPercButtonRow = styled.div`
  width: 100%;
  height: 40px;
`

export const ColumnListItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px 0;
  height: 430px;
  overflow-y: auto;
`


export const ContainerTradingPair = styled.button`
  align-items: center;
  background-color: #222d45;
  border-radius: 10px;
  box-sizing: border-box;
  border: none;
  color: white;
  display: flex;
  font-size: 20px;
  height: 75px;
  max-width: 420px;
  padding: 0 1rem;
  width: 100%;
  cursor: pointer;
`


export const LogoInputCurrency = styled.img <{ height?: string, width?: string }>`
  height:${({ height }) => (height) ? height : '40px'};
  width: ${({ width }) => (width) ? width : '40px'};
`
