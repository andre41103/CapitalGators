import React from 'react';
import './dashboard.component.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleReceipts = () => {
    navigate('/receipts');
  };

    return (
      <div className="dashboard">
        <h2>Welcome to the Dashboard!</h2>
        <button onClick={handleProfile} className="button">Profile</button>
        <button onClick={handleReceipts} className="button">Receipt Entry</button>
      </div>

      
    );
  }
  
  export default Dashboard;