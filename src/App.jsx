import { React, useState } from 'react';
import Header from './Components/Header/Header';
import IntroPage from './Components/IntroPage/IntroPage';
import Modal from './Components/Modal/Modal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpacePage from './Components/SpacePage/SpacePage';
import InformationPage from './Components/InformationPage/InformationPage';
import ContactPage from './Components/ContactPage/ContactPage';
import Default from './Components/Default/Default';
import Loader from './Components/Loader/Loader';

function App() {

const [isLoged, setIsLoged] = useState(false);
const [loading, setLoading] = useState(true);

setTimeout(() => {
  setLoading(false);
}, 3000);



  return (
    <>
      {loading ? (
        <Loader/> // Muestra el Loader mientras está cargando
      ) : (
        <Router>
          <Header isLoged={isLoged} setIsLoged={setIsLoged} />
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/space" element={<SpacePage />} />
            <Route path="/info" element={<InformationPage />} />
            <Route path="/default" element={<Default />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Modal setIsLoged={setIsLoged} isLoged={isLoged} />} />
          </Routes>
        </Router>
      )}
    </>
  );
} 

export default App
