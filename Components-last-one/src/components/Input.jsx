import React from 'react'

const Input = ({ inputType, inputName }) => {
  return (
    <input type={inputType} name={inputName} className='bg-transparent border-b-2 border-white'>
    </input>
  )
}

export default Input