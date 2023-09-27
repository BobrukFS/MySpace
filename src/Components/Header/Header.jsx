import React from 'react'
import ButtonNav from './ButtonNav/ButtonNav'
import Nav from './Nav/Nav'

function Header({setIsModalOpen, isLoged, setIsLoged}) {
  return (
    <>
      <header className="header">
        <div className='header__logo'>
          <img src="/src/assets/logo.png" alt="" />
          <h1 >My<span>Space</span> <span>Kids</span></h1>
        </div>
        <ButtonNav></ButtonNav>
        <Nav isLoged={isLoged} setIsLoged={setIsLoged}></Nav>
      </header>
    </>
  )
}

export default Header