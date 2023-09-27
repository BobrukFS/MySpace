import React from 'react'

function HeaderSpace({setSection}) {

  function flashcard (){
    localStorage.setItem('sectionPage', "flashcard");
    setSection("flashcard");
  }

  function task (){
    localStorage.setItem('sectionPage', "task");
    setSection("task");
  }

  function calc (){
    localStorage.setItem('sectionPage', "calc");
    setSection("calc");
  }
  return (
    <>
        <div className="header-space">
          <div>
          <button className="header-space__enlace" onClick={flashcard}>Flashcards</button>
            <button className="header-space__enlace" onClick={task}>Tareas</button>
            <button className="header-space__enlace" onClick={calc}>Calculadora</button>
          </div>
           
        </div>
    
    
    </>
  )
}

export default HeaderSpace