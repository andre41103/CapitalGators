import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.component.css';
import plantImage from '../assets/plantImage.png';
import question from '../assets/question.png';

const Login = () => {
  const navigate = useNavigate();

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
      <img src={question} alt="question" className="question-login" onClick={handleAbout}/>
      <h1 className="login-header">MakeCents</h1>
      <div className="content-container-login">
        <img src={plantImage} alt="Plant" className="plant-image-login left-plant" />

        <div className="form-container-login">
          <h2 className="form-title-login">Log In</h2>
          <div className="form-group-login">
            <label htmlFor="email">Email Address:</label>
            <input type="email" id="email" name="email" placeholder="Email Address" />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Password" />
          </div>
          <button onClick={handleLogin} className="button">Login</button>
          <p className="signup-prompt">
            Don't have an account yet?{" "}
            <span className="new-account-link" onClick={handleNewUser}>Sign up here</span>
          </p>
        </div>

        <img src={plantImage} alt="Plant" className="plant-image-login right-plant" />
      </div>

      <footer className="footer"></footer>
    </div>
  );
};

export default Login;
