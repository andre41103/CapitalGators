import React from 'react';
import { useNavigate } from 'react-router-dom';

const Create_Account = () => {
    // useNavigate hook to navigate programmatically
    const navigate = useNavigate();

    // Handle login logic
    const handleLogin = () => {
        navigate('/login');
    };

    return (
      <div className="create_account">
        <h2>Welcome to the Create an Account Page!</h2>
        <button onClick={handleLogin}>Return to Login</button>
      </div>
    );
  }
  
  export default Create_Account;