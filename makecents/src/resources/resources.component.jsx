import React from 'react';
import './resources.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Resources = () => {
    const navigate = useNavigate();
    const handleProfile = () => {
      navigate('/profile');
    };
  
    return (
      <>
      <div className="navbar">
        <a href="/dashboard" className="nav-make">MakeCents</a>
        <a href="/resources" className="nav-link active">Education Resources</a>
        <a href="/reports" className="nav-link">Reports</a>
        <a href="/receipts" className="nav-link">Receipt Entry</a>
        <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
      </div>

      <div className="resources-content">
        <div className="vertical-containers">
          <div className='resources-container-wrapper'>
            <h3 className='container-title'>Basic Spending Categories Info</h3>
          <div className="individual-vertical-container"></div>
          </div>

        <div className='resources-container-wrapper'>
        <h3 className='container-title'>Financial Chatbox</h3>
          <div className="individual-vertical-container"></div>
        </div>

        {/* <footer className='resources-footer'></footer> */}
      </div>
    </div></>
    );
  }
  
  export default Resources;