import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de importar axios
// Asegúrate de importar uuid
import Task from './Task/Task';

function Tasks() {
  const [tarea, setTarea] = useState("");
const [tareas, setTareas] = useState([]); // Inicializar tareas como un array vacío
 const userId = localStorage.getItem('userId');
const [isDeleting, setIsDeleting] = useState(false);
const [idTarea, setIdTarea] = useState("");
const [editing, setEditing] = useState(false);
  const newTarea = {
    tarea: tarea,
    user_id: userId,
  };

  const updateTaskList = async () => {
    try {
      const tareasResponse = await axios.get(`http://localhost:3000/get-tasks?userId=${userId}`);
      setTareas(tareasResponse.data.tarea);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tareasResponse = await axios.get(`http://localhost:3000/get-tasks?userId=${userId}`);
        console.log(tareasResponse);
        setTareas(tareasResponse.data.tarea);

   
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [userId]);





  const cambiarContenido = (event) => {
    setTarea(event.target.value);
  };

  const saveTarea = async () => { // Cambiar el nombre de la función a saveTarea
    try {
      const response = await axios.post('http://localhost:3000/save-task', {
        userId,
        userTareas: [...tareas, newTarea],
      });
      console.log(response.data.message);
      setTareas([...tareas, newTarea]); // Actualizar el estado con las nuevas tareas
      setTarea(""); // Limpiar el contenido del input
      setEditing(false);
    } catch (error) {
      console.error('Error al guardar las tareas:', error);
    }
  };

  const deleteTask = async () => {
    try {
 
      await axios.delete(`http://localhost:3000/delete-task/${idTarea}`, {
        data: {
          userId: userId
        }
       
      });
      // Realizar alguna acción después de eliminar la tarea, como actualizar la lista de tareas
      updateTaskList();
      setIsDeleting(false);
      setEditing(false);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  return (<>
  <div className='task-page'>
    <div className='task-page__tasks'>
 
      {tareas.map((tarea, index) => (
          <Task setEditing={setEditing} editing={editing} setIdTarea={setIdTarea} setIsDeleting={setIsDeleting} key={index} id={tarea.id} content={tarea.tarea} updateTaskList={updateTaskList} ></Task>
        ))}
             
    </div>
    <div className='task-page__add'>
      <input className='task-page__input' type="text" placeholder='Escriba su tarea aquí' value={tarea} onChange={cambiarContenido} />
      <button className='task-page__btn' onClick={saveTarea}>+</button>
    </div>
    {isDeleting ?
      <div className='task-page__trash' onClick={deleteTask}>
      <i className="fa-regular fa-trash-can"></i>
      </div>: ""}
    </div> </>);
}

export default Tasks;
