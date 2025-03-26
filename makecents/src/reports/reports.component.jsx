import React, { useEffect, useState } from 'react';
import './reports.component.css';
import { data, useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Reports = () => {
    const navigate = useNavigate();
    const handleProfile = () => {
      navigate('/profile');
    };
    const [receipts, setReceipts] = useState([]);


    useEffect(() => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }
  
      fetch(`http://localhost:8080/reports/${userEmail}`) 
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch receipts');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched receipts:', data);
          setReceipts(data);  // Store the receipts in state
        })
        .catch((error) => {
          console.error('Error fetching receipts:', error);
        });
    }, []);

    return (
      <>
      <div className="navbar">
        <a href="/dashboard" className="nav-make">MakeCents</a>
        <a href="/resources" className="nav-link">Education Resources</a>
        <a href="/reports" className="nav-link active">Reports</a>
        <a href="/receipts" className="nav-link">Receipt Entry</a>
        <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
      </div>

      <div className="reports-container">
        <div className="left-side">
          <div className='reports-container-wrapper'>
            <h1 className="reports-container-title">Projected Spending</h1>
            <div className='report-left-box'></div>
          </div>
          <div className='reports-container-wrapper'>
            <div className='report-left-box'></div>
          </div>
          <div className='reports-container-wrapper'>
            <h1 className="reports-container-title">Transactions</h1>
            <div className='report-left-box reports-scrollable-container'>
              {receipts.length === 0 ? (
                <p>No receipts found</p>
              ) : (
                <div className="receipt-list">
                  {receipts.map((receipt, index) => (
                    <div key={index} className="receipt-item">
                      <p><strong>Merchant:</strong> {receipt.merchant_name}</p>
                      <p><strong>Category:</strong> {receipt.receipt_type}</p>
                      <p><strong>Total:</strong> ${receipt.total.toFixed(2)}</p>
                      <p><strong>Date:</strong> {receipt.date ? receipt.date : 'N/A'}</p>
                      <p><strong>Notes:</strong> {receipt.notes}</p>
                      {receipt.recurring && <p className="recurring-tag">Recurring</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          
        </div>
      </div></>
    );
  }
  
  export default Reports;