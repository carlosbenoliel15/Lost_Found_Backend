import React from 'react'

const Button = ({ btnClassName, btnImg, onClick, btnText, imgClassName}) => {
  return (
    <button className={btnClassName} onClick={onClick}>
        {btnImg && <img className={imgClassName} src={btnImg} alt={btnText}></img>}
        {btnText}
    </button>
  )
}

export default Button