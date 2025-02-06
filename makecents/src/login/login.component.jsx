import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.component.css';

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

  return (
    <div className="login">
      <h2>Welcome to the Login!</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleNewUser}>Create New Account</button>
    </div>
  );
}

export default Login;
