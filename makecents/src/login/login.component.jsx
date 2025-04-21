import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.component.css';
import plantImage from '../assets/plantImage.png';
import question from '../assets/question.png';

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('userEmail', data.email);
        console.log('Login successful:', data); // Log successful login response data
        navigate('/dashboard');
      } else {
        console.error('Error logging in:', data.error || "Invalid credentials"); // Log error if login fails
        setErrorMessage(data.error || "Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.error('Network error:', error); // Log network errors
      setErrorMessage("Network error. Please try again.");
    }
  };  

  const handleNewUser = () => {
    navigate('/create_account');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login">
      <img src={question} alt="question" className="question-login" onClick={handleAbout}/>
      <h1 className="login-header">MakeCents</h1>
      <div className="content-container-login">
        <img src={plantImage} alt="Plant" className="plant-image-login left-plant" />

        <div className="form-container-login">
          <h2 className="form-title-login">Login</h2>
          <div className="form-group-login">
            <label htmlFor="email">Email Address:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Email Address" 
              onKeyDown={handleKeyPress} 
            />

            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Password" 
              onKeyDown={handleKeyPress} 
            />
          </div>
          <button onClick={handleLogin} className="button">Log In</button>
          {errorMessage && <div className='error-message'>{errorMessage}</div>}
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
