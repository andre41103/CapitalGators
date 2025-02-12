import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.component.css';
import plantImage from '../assets/plantImage.png';

const Login = () => {
  // useNavigate hook to navigate programmatically
  const navigate = useNavigate();

  // Handle login logic
  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleNewUser = () => {
    navigate('/create_account');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  return (
    <div className="login">
      <div className='login-header'>MakeCents</div>
      <div className="image-button-container">
        <img src={plantImage} alt="Plant" className="plant-image"/>
        <img src={plantImage} alt="Plant" className="plant-image"/>
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleNewUser}>Create New Account</button>
      <button onClick={handleAbout}>About MakeCents</button>

      <footer className="footer"></footer>
    </div>
  );
}

export default Login;
