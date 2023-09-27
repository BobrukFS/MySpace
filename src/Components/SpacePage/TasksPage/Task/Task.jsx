import React, { useState, useRef } from 'react';
import axios from 'axios';

function Task({ content, id, updateTaskList, setIsDeleting, setIdTarea }) {
  const [isCheck, setIsCheck] = useState(false);
  const taskId = id;
  const inputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchTimer, setTouchTimer] = useState(null);

  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
    const timer = setInterval(() => {
      if (Date.now() - touchStartTime >= 3000) {
        clearInterval(timer);
        setEditing(true);
        setIsDeleting(true);
        setIdTarea(taskId);
      }
    }, 1000);
    setTouchTimer(timer);
  };

  const handleTouchMove = () => {
    clearTouchTimer();
  };

  const handleTouchEnd = () => {
    clearTouchTimer();
  };

  const clearTouchTimer = () => {
    clearInterval(touchTimer);
    setTouchStartTime(0);
  };

  const check = () => {
    setIsCheck(true);
  };

  const toggleEditing = async () => {
    if (editing) {
      try {
        await axios.put(`http://localhost:3000/update-task/${taskId}`, {
          taskId: taskId,
          newContent: inputRef.current.value,
        });
        setEditing(false);
        setIsDeleting(false);
        updateTaskList();
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    }
  };

  const handleTaskClick = () => {
    if (!('ontouchstart' in window)) {
      // Verificar si el dispositivo es táctil o no
      setEditing(true);
      setIsDeleting(true);
      setIdTarea(taskId);
    }
  };

  return (
    <div
      className='tarea'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTaskClick} // Manejar el evento de clic
    >
      {editing ? (
        <div className='tarea__task'>
          <input
            className='tarea__input'
            ref={inputRef}
            defaultValue={content}
            type="text"
          />
          <button className='tarea__check' onClick={toggleEditing}><i className="fa-solid fa-check"></i></button>
        </div>
      ) : (
        <>
          <div className='tarea__task'>
            <div className='tarea__circulo' onClick={check}>{isCheck ? <i  className="fa-solid fa-check tarea__circulo-check"></i> : "" }</div>
            <p className='tarea__p'>{content}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;
