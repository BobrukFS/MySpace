import React from 'react';

function Result({ totalCards, correctAnswers, onRetry, onFinish }) {
  const percentage = (correctAnswers / totalCards) * 100;

  return (
    <div className='result'>
      <div className='result__desc'>
        <h2 className='result__title'>Resultados</h2>
        <p>Porcentaje de respuestas correctas</p>
        <p className='result__porcentaje'>{percentage.toFixed(2)}%</p>
      </div>

      <div className='result__buttons'>
        <button className='result__btn' onClick={onRetry}>Reintentar</button>
        <button className='result__btn' onClick={onFinish}>Finalizar</button>
      </div>
    </div>
  );
}

export default Result;
