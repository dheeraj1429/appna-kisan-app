import React from 'react'
import logo from '../assests/ssa_logo.png'

function Logo() {
  return (
    <>
      {/* <img src={require('../assests/ssa_logo.png')} /> */}
      <img className='ssa_logo' src={logo}/>
    </>
  )
}

export default Logo