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
        <div className="content">
          <h1 className='custom-h1'>Welcome to MakeCents!</h1>
          <h2 className='custom-h2'>Below we will ask you questions that will personalize your experience with us</h2>
          
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='name'>Name:</label>
              <input type="text" id="name" name="name" placeholder="Full name" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='email address'>Email Address:</label>
              <input type="text" id="email address" name="email address" placeholder="Valid Email Address" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly income'>What is your monthly income? :</label>
              <input type="text" id="monthly income" name="monthly income" placeholder="$" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly spending goal'>What is your ideal monthly spending goal? :</label>
              <input type="text" id="monthly spending goal" name="monthly spending goal" placeholder="$" />
            </div>
          </div>

         
        </div>

    );
    
  }
  
  export default Create_Account;