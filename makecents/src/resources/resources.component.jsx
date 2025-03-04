import React from 'react';
import './resources.component.css';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
    return (
      <div className="resources-content">
        <div className="top-left-title">
          <h2>MakeCents</h2>
        </div>
        <div className="vertical-containers">
          <div className='resources-container-wrapper'>
            <h3 className='container-title'>Basic Spending Categories Info</h3>
          <div className="individual-vertical-container"></div>
          </div>

        <div className='resources-container-wrapper'>
        <h3 className='container-title'>Financial Chatbox</h3>
          <div className="individual-vertical-container"></div>
        </div>

        <footer className='resources-footer'></footer>
      </div>
    </div>
      
    );
  }
  
  export default Resources;