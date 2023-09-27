
import React, { useState } from 'react';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);

    const data = {
      "name" : name,
      "email" : email,
      "subject" : subject,
      "message" : message,
    }
 
    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
     
      if (response.ok) {
        // El correo se envió exitosamente, puedes mostrar un mensaje al usuario
        console.log('Correo enviado exitosamente');
      } else {
        // Hubo un error en el envío, muestra un mensaje de error
        console.error('Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    } finally {
      setIsSending(false);
    setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  };

  return (<>
    <div className="contact">
      <h2>Contacto</h2>
      <form id="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="subject">Asunto</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit" disabled={isSending}>
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
    </> );
}

export default ContactPage;
