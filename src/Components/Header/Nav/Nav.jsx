import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Nav({setIsModalOpen, isLoged, setIsLoged}) {
 
  const navigate = useNavigate();


  function cerrarMenu(){
    const nav = document.getElementsByClassName("nav");
    nav[0].classList.remove("desplegado");
    const element = document.getElementsByClassName('menu');
    element[0].classList.toggle('opened');
  }

  function iniciarModal(){
    cerrarMenu();
  }

  function logout(){
    cerrarMenu();
    setIsLoged(false);
    localStorage.setItem('userId', '');
    navigate('/');
  
  }

  const userId = localStorage.getItem('userId');
  
  return (
    <>
        <nav className='nav'>
            {userId ? <Link to="/space" className="nav__enlace" onClick={cerrarMenu}>Mi espacio</Link> : <Link to="/default" className="nav__enlace" onClick={cerrarMenu}>Mi espacio</Link>  }
 
            <Link to="/contact"  className="nav__enlace" onClick={cerrarMenu}>Contacto</Link>
            {isLoged || userId
          ? <Link to="/" className="nav__enlace" onClick={logout}> Cerrar sesión</Link>
          : <Link to="/login" className="nav__enlace" onClick={iniciarModal}> Iniciar sesión </Link>}
        </nav>
    
    
    
    </>
  )
}

export default Nav