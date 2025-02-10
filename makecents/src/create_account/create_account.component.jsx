import React from 'react';
import { useNavigate } from 'react-router-dom';
import './create_account.component.css';

const Create_Account = () => {
    // useNavigate hook to navigate programmatically
    const navigate = useNavigate();

    // Handle login logic
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="contentHeader">
          <h1 className='custom-h1'>Welcome to MakeCents!</h1>
          <h2 className='custom-h2'>Below we will ask you questions that will personalize your experience with us</h2>
          <button onClick={handleLogin}>Return to Login</button>
        </div>
    );
    
  }
  
  export default Create_Account;