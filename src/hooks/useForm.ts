import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const reset = (newFormState = initialState) => {
    setValues(newFormState);
  }

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    setValues({
      ...values,
      [target.name]: value
    })
  }

  return [values, handleInputChange, reset]
}