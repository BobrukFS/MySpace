import React, { useState } from 'react';
import axios from 'axios';

function Card({ className, card, onDeleteCard, onUpdateCard, studyMode, handleGoodClick, handleBadClick, selectedTheme, defaultThemeUrl }) {
  const [showAnswer, setShowAnswer] = useState(card.showAnswer);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingBody, setEditingBody] = useState(false);
  const [title, setTitle] = useState(card.titulo);
  const [body, setBody] = useState(card.respuesta);
  const [girar, setGirar] = useState("");
  const [isGirar, setIsGirar] = useState(false);
  const handleTitleClick = () => {
    setEditingTitle(true);
  };

  const handleBodyClick = () => {
    setEditingBody(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handleDoneClick = async () => {
    setEditingTitle(false);
    setEditingBody(false);
   
    try {
      // Actualizar la carta en el servidor
      await axios.put(`http://localhost:3000/update-card/${card.id}`, {
        titulo: title,
        respuesta: body
      });

      // Actualizar la carta modificada en el estado local
      onUpdateCard({ ...card, titulo: title, respuesta: body });
    } catch (error) {
      console.error('Error al guardar la carta:', error);
    }
  };

  const handleDeleteClick = async () => {
    setGirar("")
    try {
      await axios.delete(`http://localhost:3000/delete-card/${card.uuid}`);
      onDeleteCard(card.id);
      console.log('Carta eliminada exitosamente');
    } catch (error) {
      console.error('Error al borrar la carta:', error);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
 
    setIsGirar(true);
  };

  const handleHideAnswer = () => {
    setShowAnswer(false);
    setIsGirar(false);

  };

  return (
    <div className={`flashcard ${isGirar ? 'girar' : ''} ${studyMode ? 'study-mode' : ''} ${className}`} style={{ backgroundImage: `url(${selectedTheme || defaultThemeUrl})` }}>
      {studyMode ? (
        <div className="flashcard__content flashcard__content--study">
          <h2 className='flashcard__title flashcard__title--study'>{card.titulo}</h2>
          {!showAnswer ? (
            <button className="flashcard__show-answer flashcard__show-answer--study" onClick={handleShowAnswer}>
              Mostrar respuesta
            </button>
          ) : (
            <>
              <p>{card.respuesta}</p>
              <div className='flashcard__btn-container'>
                <button className="flashcard__next" onClick={() => {
                  handleGoodClick();
                  handleHideAnswer();
                }}>
                  <i className="fa-solid fa-check"></i>
                </button>
                <button className="flashcard__next" onClick={() => {
                  handleBadClick();
                  handleHideAnswer();
                }}>
                  <i className="fa-solid fa-x"></i>
                </button>
              </div>
            </>
          )}
          {editingBody && (
            <>
              <textarea
                value={body}
                onChange={handleBodyChange}
                onClick={(e) => e.stopPropagation()}
              />
              <button className='flashcard__listo' onClick={handleDoneClick}>Listo</button>
            </>
          )}
        </div>
      ) : (
        <div className="flashcard__content">
          <button className='flashcard__delete' onClick={handleDeleteClick}>
          <i className="fa-regular fa-trash-can"></i>
          </button>
          <div>
            {editingTitle ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2 onClick={handleTitleClick}>{title} <i className="fa-solid fa-pen pen"></i></h2>
            )}
            {editingBody ? (
              <textarea
                value={body}
                onChange={handleBodyChange}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p onClick={handleBodyClick}>{body}<i class="fa-solid fa-pen-to-square pen"></i></p>
            )}
          </div>
          {(editingTitle || editingBody) && (
            <button className='flashcard__listo' onClick={handleDoneClick}><i className="fa-solid fa-check"></i></button>
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
