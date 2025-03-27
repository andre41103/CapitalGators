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
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [remaining, setRemaining] = useState(0);


    useEffect(() => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }
    
      // Fetch user details
      fetch(`http://localhost:8080/profile/${userEmail}`)
        .then((response) => response.json())
        .then((userData) => {
          console.log('Fetched user data:', userData);
          setBudget(userData.spendingGoal || 0);
        })
        .catch((error) => console.error('Error fetching user data:', error));
    
      // Fetch receipts
      fetch(`http://localhost:8080/reports/${userEmail}`)
        .then((response) => response.json())
        .then((receiptData) => {
          console.log('Fetched receipts:', receiptData);

          // Get the current year and month
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth(); // 0-based (January is 0)

          // Filter the receipts to only include those from the current month
          const filteredReceipts = receiptData.filter((receipt) => {
          const receiptDate = new Date(receipt.date);
          const receiptYear = receiptDate.getFullYear();
          const receiptMonth = receiptDate.getMonth();

          return receiptYear === currentYear && receiptMonth === currentMonth;
        });

          const totalExpenses = filteredReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
          const recurringExpenses = receiptData.filter(receipt => receipt.recurring).reduce((sum, receipt) => {
            return sum + (receipt.total || 0);
          }, 0);

          setExpenses(totalExpenses + recurringExpenses);
          setReceipts(receiptData);
        })
        .catch((error) => console.error('Error fetching receipts:', error));
    }, []);
    
    useEffect(() => {
      setRemaining(budget - expenses);
    }, [budget, expenses]); // Recalculate when either value changes
    

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
            <div className='reports-left-side-row-container'>
              <div className='second-report-left-box'>
                <div className='numbers-container'>
                <h1 className="dollar-value">${budget.toLocaleString()}</h1>
                  <p className="numbers-container-title">Budget</p>
                </div>
              </div>
              <div className='second-report-left-box'>
              <div className='numbers-container'>
              <h1 className="dollar-value">${expenses.toLocaleString()}</h1>
                  <p className="numbers-container-title">Expenses</p>
                </div>
              </div>
              <div className='second-report-left-box'>
                <div className='numbers-container'>
                <h1 className="dollar-value">${remaining.toLocaleString()}</h1>
                  <p className="numbers-container-title">Remaining Money</p>
                </div>
              </div>
            </div>
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