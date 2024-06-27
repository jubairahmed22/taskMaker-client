import React from 'react'

const PrimaryButton = ({ children, classes, handler }) => {
  return (
    <button
      onClick={handler}
      className={`text-white  bg-hex-99 ${classes}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
