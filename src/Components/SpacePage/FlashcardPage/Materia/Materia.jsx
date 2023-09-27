import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


function Materia({setIdMateria}) {
  const userId = localStorage.getItem('userId');
  const newMateria = {
 
    nombre: 'Materia default',
    user_id: userId,
  };
  
  const [materias, setMaterias] = useState([newMateria]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasResponse = await axios.get(`http://localhost:3000/get-materias?userId=${userId}`);
  
        setMaterias(materiasResponse.data.materia);
        setIdMateria(materiasResponse.data.materia[0].id)
   
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [userId, setIdMateria]);

  const anadirMateria = async () => {
    try {
      const response = await axios.post('http://localhost:3000/save-materias', {
        userId,
        userMaterias: [...materias, newMateria],
      });
      console.log(response.data.message);

      setMaterias([...materias, newMateria]);
    } catch (error) {
      console.error('Error al guardar las cartas:', error);
    }
  }

  const selectMateria = (materiaId) => {
    setIdMateria(materiaId);
  }

  return (
    <>
    <div className='materias'>
   
      <Swiper className='swiper' id='swiper' spaceBetween={2} slidesPerView={2} breakpoints={{
          // when window width is >= 480px
          480: {
            slidesPerView: 3,
            //spaceBetween: 40,
          },
          // when window width is >= 640px
          768: {
            slidesPerView: 4,
            //spaceBetween: 100,
          },
          992: {
            slidesPerView: 5,
            // spaceBetween: 40,
          },
        }}
      
      
      >
        {materias.map((materia, index) => (
          <SwiperSlide id="slide" key={index} onClick={() => selectMateria(materia.id)}>{materia.nombre}</SwiperSlide>
        ))}
        <SwiperSlide>
          <button onClick={anadirMateria}>+</button>
        </SwiperSlide>
      </Swiper>
      
      </div> </>
  )
}

export default Materia;
