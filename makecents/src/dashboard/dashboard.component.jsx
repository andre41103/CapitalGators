import React from 'react';
import './dashboard.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

    return (
       <>
      <div className="navbar">
        <a href="/dashboard" className="nav-make active">MakeCents</a>
  
        <a href="/resources" className="nav-link">Education Resources</a>
        <a href="/reports" className="nav-link">Reports</a>
        <a href="/receipts" className="nav-link">Receipt Entry</a>
  
        <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
      </div>
          
      <div className="dashboard">
        <h2>Welcome to the Dashboard!</h2>
       
      </div></>
    );
  }
  
  export default Dashboard;