
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Modal({setIsLoged, isLoged}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();



  // Función para alternar entre el formulario de registro e inicio de sesión
  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage("");
  };

const handleLogin = async () =>{
  if (!email && !password){
    setErrorMessage("Porfavor, ingresa su mail y contraseña")
  } else if (!email){
    setErrorMessage("Porfavor, ingresa su mail")
  } else if (!password){
    setErrorMessage("Porfavor, escriba su contraseña")
  } else{
    setErrorMessage("");
    try{
      const response = await axios.post('http://localhost:3000/login', { email, password });
      const userId = response.data.userId;
      localStorage.setItem('userId', userId);
     
  
      
      navigate(`/space`);
      setIsLoged(true);
 
    } catch(e){
      setErrorMessage("Error al iniciar sesion. Por favor, verifica tus credenciales.");
    }
   
  }
}


const handleRegister = async () =>{
  if(!registerUsername && !email && !password){
    setErrorMessage("Porfavor, complete todos los campos de registro")
    return;
  } else {
    if (registerUsername.length <= 3) {
      setErrorMessage('El nombre de usuario debe tener al menos 4 caracteres.');
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(password) || password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres alfanuméricos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', {
        usuario: registerUsername,
        email,
        password
      });
      const userId = response.data.userId;
      navigate(`/space`);
      setIsLoged(true);
      localStorage.setItem('userId', userId);
    
   
  }catch(e){
    if (e.response && e.response.data && e.response.data.message) {
      setErrorMessage(e.response.data.message);
    } else {
      setErrorMessage('Error al registrarse. Por favor, verifica tus datos.');
    }
  }
}
}

  return (
    <>
      <div className="modal">
    
        <div className="modal__content">
          <h2>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h2>
          <form>
          {isRegistering && (<>
            <label>Nombre de usuario</label>
            <input
              type="text"
              placeholder="Escriba su usuario aqui"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </>)}
          <label>Email</label>
          <input
            type="email"
            placeholder="Escriba su email aqui"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
             <label>Contraseña</label>
          <input
            type="password"
            placeholder="Escriba su contraseña aqui"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage}
          <div className="modal-btn">
            {isRegistering ? (
              <button type="button" onClick={handleRegister} >Registrarse</button>
            ) : (
              <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
            )}
               <button type="button" className='modal__btn-secondary' onClick={toggleRegister}>
              {isRegistering ? 'Ya tengo cuenta, iniciar sesion' : 'Crear una cuenta nueva'}
            </button>
          </div>

       
          </form>
        </div>
      </div>
    </>
  );
}

export default Modal;