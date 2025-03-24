import React from 'react';
import './reports.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Reports = () => {
    const navigate = useNavigate();
    const handleProfile = () => {
      navigate('/profile');
    };

    return (
      <>
      <div className="navbar">
        <a href="/dashboard" className="nav-make">MakeCents</a>
        <a href="/resources" className="nav-link">Education Resources</a>
        <a href="/reports" className="nav-link active">Reports</a>
        <a href="/receipts" className="nav-link">Receipt Entry</a>
        <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
      </div>

      <div className="reports">
        <h2>Welcome to the Reports Page!</h2>
      </div></>
    );
  }
  
  export default Reports;