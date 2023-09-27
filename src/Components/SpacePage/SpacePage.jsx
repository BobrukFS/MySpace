import React, { useEffect, useState } from 'react';

import HeaderSpace from './HeaderSpace/HeaderSpace';
import FlashcardPage from './FlashcardPage/FlashcardPage';
import Tasks from './TasksPage/Tasks';
import Calc from './Calculadora/Calc';

function SpacePage() {
  const storedSectionPage = localStorage.getItem('sectionPage');
  const [section, setSection] = useState(storedSectionPage || "flashcard");

  useEffect(() => {
    if (storedSectionPage) {
      setSection(storedSectionPage);
    }
  }, [storedSectionPage]);

  return (
    <div className="space-page">
      <HeaderSpace setSection={setSection} />
      {section === 'flashcard' ? <FlashcardPage /> : section === 'task' ? <Tasks /> : <Calc />}
    </div>
  );
}

export default SpacePage;
