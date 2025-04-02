import React, { useEffect, useState } from 'react';
import './dashboard.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStockData(); // Fetch stock data once when component mounts
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch("http://localhost:8080/dashboard"); 
      const data = await response.json();
      setStocks(data); // Store the fetched data once
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

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
          
      <div className="dashboard-container">
        <div className='dashboard-rows'>
          <div className='dashboard-container-wrapper top-row'>
            <div className='dashboard-bottom-row-container centered'>
              <div className='dashboard-container-title'>Pie charts</div>
              <div className='bottom-row-boxes'></div>
            </div>
          </div>
        </div>
        <div className='dashboard-rows'>
          <div className='dashboard-container-wrapper'>
            <div className='dashboard-bottom-row-container'>
              <div className='dashboard-container-title'>Projected Spendings</div>
              <div className='bottom-row-boxes'></div>
            </div>
            <div className='dashboard-bottom-row-container'>
              <div className='dashboard-container-title'>Stock Information</div>
              <div className='bottom-row-boxes'>
                {stocks.length > 0 ? (
                  <div className='stock-list'>
                    {stocks.map((stock, index) => (
                      <div className='stock-item' key={index}>
                        <strong>{stock.ticker}</strong>: {stock.name} : ${stock.price.toFixed(2)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Loading stock data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
       
      </div></>
    );
  }
  
  export default Dashboard;