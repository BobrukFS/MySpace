import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from './Card/Card';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Result from './Result/Result';

import Materia from './Materia/Materia';
function FlashcardPage() {
  
 
  const userId = localStorage.getItem('userId');

  const [cards, setCards] = useState([]);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerButtons, setShowAnswerButtons] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [defaultThemeUrl, setDefaultThemeUrl] = useState('/src/assets/Theme1');
  const [idMateria, setIdMateria] = useState("");
 
  useEffect(() => {
  
    const fetchData = async () => {
      try {
        // Obtener las cartas del usuario
        const cardsResponse = await axios.get(`http://localhost:3000/get-cards?idMateria=${idMateria}`);
        
       console.log(cardsResponse.data.cards);
  setCards(cardsResponse.data.cards);
    // Obtener el fondo de usuario
    const backgroundResponse = await axios.get(`http://localhost:3000/get-user-background/${userId}`);
    const themeUrl = backgroundResponse.data.background_theme;
    console.log(backgroundResponse);
    setSelectedTheme(themeUrl);

      } 
     
  catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
  
    fetchData();
  }, [idMateria]);

  const handleAddCard = () => {
    const newCard = {
      uuid: uuidv4(),
      titulo: 'Pregunta',
      respuesta: 'Texto de la pregunta...',
      showAnswer: false
    };
    setCards([...cards, newCard]);
  };

  const handleStartStudyMode = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswerButtons(false);
  };
  

 const handleNextCard = () => {
  if (currentCardIndex < cards.length - 1) {
    setCurrentCardIndex(currentCardIndex + 1);
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[currentCardIndex + 1].showAnswer = false; // Ocultar la respuesta de la próxima carta
      return updatedCards;
    });
    setShowAnswerButtons(false); // Ocultar los botones de respuesta
   
  } else {
    setShowResult("true");
    setCurrentCardIndex(0);
  }
};

  const handleSaveCards = async () => {
    
    try {
      const response = await axios.post('http://localhost:3000/save-cards', {
        userId,
        userCards: cards,
        idMateria
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error al guardar las cartas:', error);
    }
  };

  const updateCard = (index, updatedCard) => {
    const updatedCards = [...cards];
    updatedCards[index] = updatedCard;
    setCards(updatedCards);
  };

  const handleDeleteCard = (deletedCardId) => {
    const updatedCards = cards.filter(card => card.id !== deletedCardId);
    setCards(updatedCards);
  };

  const handleGoodClick = () => {
    if (currentCardIndex === cards.length - 1) {
      
     
setCorrectAnswers(correctAnswers + 1);
setShowResult(true);
     
    } else {
      setCorrectAnswers(correctAnswers + 1);
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        updatedCards[currentCardIndex].showAnswer = false; // Establecer showAnswer como false para la tarjeta actual
        return updatedCards;
      });
      handleNextCard();
    }
  };

  const handleBadClick = () => {
    if (currentCardIndex === cards.length - 1) {
      
     

      setShowResult(true);
    } else {
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        updatedCards[currentCardIndex].showAnswer = false; // Establecer showAnswer como false para la tarjeta actual
        return updatedCards;
      });
      handleNextCard();
    }
  };
  const handleRetry = () => {
    // Reiniciar los valores y volver al modo de estudio
    setCorrectAnswers(0);
    setShowResult(false);
    setStudyMode(true);
    setCurrentCardIndex(0);
  };

  const handleFinish = () => {
    // Mostrar el resultado y finalizar
    setStudyMode(false); 
    setShowResult(false);
    setCorrectAnswers(0);
  };
 
  const handleOpenThemeModal = () => {
    setShowThemeModal(true);
  };

  const handleCloseThemeModal = () => {
    setShowThemeModal(false);
  };
  const handleBackgroundChange = async (themeUrl) => {
    setSelectedTheme(themeUrl);
    handleCloseThemeModal();
  
    try {
      await axios.put(`http://localhost:3000/update-user-background/${userId}`, {
        background_theme: themeUrl,
      });
      console.log('Fondo de usuario actualizado exitosamente');
      setSelectedTheme(themeUrl);
    } catch (error) {
      console.error('Error al actualizar el fondo de usuario:', error);
    }
  };

  const isMaxCardsReached = cards.length >= 10;

  return (<>
  <div className='flashcardPage'>

 
    <Materia setIdMateria={setIdMateria}></Materia>
    <div className={`flashcard-page ${studyMode ? "study" : ""}`}>
    


{!studyMode && (
  <>
  <div className='flashcard-page__btn'>


    <button className="flashcard-page__study" onClick={handleStartStudyMode}>
      Modo estudio <i className="fa-solid fa-book"></i>
    </button>
    <button className="flashcard-page__theme" onClick={handleOpenThemeModal}>
      Tema <i className="fa-solid fa-palette"></i>
    </button>
    </div>
  </>
)}

{showThemeModal && (
  
  <div className="theme-modal">
   <div>

    <button onClick={() => handleBackgroundChange('/src/assets/theme1.png')}>
      <img src="/src/assets/Theme1.png" alt="Theme 1" />
    </button>
   
    <button onClick={() => handleBackgroundChange('/src/assets/theme3.png')}>
      <img src="/src/assets/Theme3.png" alt="Theme 3" />
    </button>
   
    <button onClick={() => handleBackgroundChange('/src/assets/theme5.png')}>
      <img src="/src/assets/Theme5.png" alt="Theme 5" />
    </button>
    <button onClick={() => handleBackgroundChange('/src/assets/theme6.png')}>
      <img src="/src/assets/Theme6.png" alt="Theme 6" />
    </button>
    <button onClick={() => handleBackgroundChange('/src/assets/theme7.png')}>
      <img src="/src/assets/Theme7.png" alt="Theme 7" />
    </button>
    <button onClick={() => handleBackgroundChange('/src/assets/theme8.png')}>
      <img src="/src/assets/Theme8.png" alt="Theme 8" />
    </button>
    </div>
    <button className="theme-modal__close" onClick={handleCloseThemeModal}>
      Cerrar
    </button>
  </div>
 
)}

      <div className='flashcard-page__container'>
        

        <div className={`cards-container ${studyMode ? "study" : ""}`}>
        {studyMode && (
  <>
    <Card
      className="card-study"
      card={cards[currentCardIndex]}
      onNextCard={handleNextCard}
      onUpdateCard={(updatedCard) => updateCard(currentCardIndex, updatedCard)}
      onDeleteCard={handleDeleteCard}
      studyMode={studyMode}
      handleGoodClick={handleGoodClick}
      handleBadClick={handleBadClick}
      showAnswerButtons={showAnswerButtons}
      setShowAnswerButtons={setShowAnswerButtons}
      selectedTheme={selectedTheme}
      defaultThemeUrl={defaultThemeUrl}
    />
    {showResult && (
      <Result
        totalCards={cards.length}
        correctAnswers={correctAnswers}
        onRetry={handleRetry}
        onFinish={ handleFinish }
      />
    )}
  </>
)}
          {!studyMode && cards.map((card, index) => (
            <Card
              key={card.uuid}
              card={card}
              onUpdateCard={(updatedCard) => updateCard(index, updatedCard)}
              onDeleteCard={handleDeleteCard}
              showDeleteButton={true} 
              selectedTheme={selectedTheme}
              defaultThemeUrl={defaultThemeUrl}
              
            />
          ))}

          {!isMaxCardsReached && !studyMode && (
            <button className="flashcard-page__add" onClick={handleAddCard}>
              +
            </button>
          )}


        </div>
      </div>
      {!studyMode && (
        <button className="flashcard-page__save" onClick={handleSaveCards}>
          Guardar <i className="fa-solid fa-floppy-disk"></i>
        </button>
      )}
    </div>
    </div> </>);
}


export default FlashcardPage