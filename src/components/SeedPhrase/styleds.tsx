import styled from 'styled-components'

export const GridContainer = styled.div`
  align-content: center;
  background-color: #081532;
  display: grid;
  justify-content: center;
  grid-row-gap: 20px;
  grid-template-columns: auto auto auto auto auto auto;
  max-width: 1200px;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: auto auto auto auto;
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: auto auto auto;
  }
`

export const GridItem = styled.div`  
  font-size: 25px;
  padding: 10px;
  text-align: center;
`

export const Word = styled.span`
  background-color: #153d6f70;
  border: 1px solid #ccc;
  border-radius: 15px;
  color: white;
  display: inline-block;
  font-size: 0.8em;
  height: 50px;
  padding: 10px 15px;
  text-align: center;
  width: 120px;

  @media only screen and (max-width: 600px) {
    width: 90px;
    font-size: 0.6em;
    padding: 10px 15px;
  }
`

export const InputWord = styled.input`
  background-color: #081634;
  border: none;
  border-bottom: 1px solid #ccc;
  color: white;
  font-size: 0.8em;
  height: 50px;
  width: 120px;
  text-align: center;

  ::placeholder {
    border:none;
    color: gray;
    margin: auto auto;
    padding: auto auto;
    text-align: center;
  }

  :focus {
    outline: none;
  }

  :invalid { 
    color: #dc3545;
  } 
  
  @media only screen and (max-width: 600px) {
    color: white;
    font-size: 0.7em;
    height: 50px;
    padding: 0;
    width: 90px;
  }
`