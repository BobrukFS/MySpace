import React from 'react'

function Loader() {
  return (
    <>
        <div className="loader">
        <div>
                <p className='loader__p'>Cargando...</p>
            </div>
            <div>
        
            <div ><img className="loader__planeta loader__planeta--1" src="src/assets/Ellipse1.svg" alt="" /></div>
            <div ><img className="loader__planeta loader__planeta--2" src="src/assets/Ellipse2.svg" alt="" /></div>
            <div ><img className="loader__planeta loader__planeta--3" src="src/assets/Ellipse3.svg" alt="" /></div>
                    
            </div>
           
        </div>
    
    </>
  )
}

export default Loader