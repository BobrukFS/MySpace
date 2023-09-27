
import React from 'react';
import {Link} from 'react-router-dom';
function IntroPage() {

  return (
    <>
      <div className="intro-page">
        <div>
          <h1 className="intro-page__title">Para tu estudio, <span>todo un espacio</span></h1>
        </div>
        <Link to="/login" className="intro-page__btn" >
          Comenzar
        </Link>
      </div>



    </>
  );
}

export default IntroPage;