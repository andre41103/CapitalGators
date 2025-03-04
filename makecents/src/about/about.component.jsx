import React from 'react';
import './about.component.css';
import { useNavigate } from 'react-router-dom';
import plantImage from '../assets/plantImage.png';

const About = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
      <div className="about">
          <div className='about-header'>About MakeCents</div>
          <div className="textbox">
              <div>
                  MakeCents is a web based program that will help you manage your budget based on your spending priorities.
                  Additionally, it provides helpful resources and personalized assistance to help you make smart financial decisions.
              </div>
          </div>
          <div className="image-button-container">
              <img src={plantImage} alt="Plant" className="plant-image"/>
              <button className='about_button' onClick={handleLogin}>Return to Login</button>
          </div>
          <div className='footer'></div>
      </div>
    );
}

export default About;
