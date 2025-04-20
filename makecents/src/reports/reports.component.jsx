import React, { useEffect, useState } from 'react';
import './reports.component.css';
import { data, useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

// this is the projected spendings chart
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
    const navigate = useNavigate();
    const handleProfile = () => {
      navigate('/profile');
    };
    const [receipts, setReceipts] = useState([]);
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [topCategories, setTopCategories] = useState([]);
    const [currentMonthReceipts, setCurrentMonthReceipts] = useState([]);
    const [graphUrl, setGraphUrl] = useState('');
    const [graphLoading, setGraphLoading] = useState(true);




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

        setCurrentMonthReceipts(filteredReceipts);


          const totalExpenses = filteredReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
          const recurringExpenses = receiptData.filter(receipt => receipt.recurring).reduce((sum, receipt) => {
            return sum + (receipt.total || 0);
          }, 0);

          setExpenses(totalExpenses + recurringExpenses);
          setReceipts(receiptData);
          const categorySpending = {};
      
          // Initialize all categories with zero
          const categories = [
            'Food & Dining',
            'Housing & Utilities',
            'Transportation',
            'Leisure',
            'Personal Care & Education'
          ];
          
          categories.forEach(cat => {
            categorySpending[cat] = 0;
          });
          
          // Sum spending by category
          filteredReceipts.forEach(receipt => {
            if (receipt.receipt_type && receipt.total) {
              categorySpending[receipt.receipt_type] = 
                (categorySpending[receipt.receipt_type] || 0) + receipt.total;
            }
          });
          
          // Sort categories by amount and get top 3
          const sortedCategories = Object.entries(categorySpending)
            .filter(([_, amount]) => amount > 0)
            .sort(([_, amount1], [__, amount2]) => amount2 - amount1)
            .slice(0, 3)
            .map(([category]) => category);
          
          setTopCategories(sortedCategories);
        })
        .catch((error) => console.error('Error fetching receipts:', error));

        const fetchGraph = async () => {
          const userEmail = localStorage.getItem('userEmail');
          if (!userEmail) return;
          setGraphLoading(true);
    
          try {
            const response = await fetch(`http://localhost:8080/dashboard/${userEmail}/graph`);
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setGraphUrl(imageUrl);
            console.log("Graph URL:", imageUrl);
            setGraphLoading(false);
    
          } catch (error) {
            console.error('Error fetching graph image:', error);
          }
        };
        fetchGraph();

    }, []);
    
    useEffect(() => {
      setRemaining(budget - expenses);
    }, [budget, expenses]); // Recalculate when either value changes
    
    const numericBudget = Number(budget) || 0;
    const numericExpenses = Number(expenses) || 0;
    const savedPercentage = numericBudget > 0
      ? Math.round(((numericBudget - numericExpenses) / numericBudget) * 100): 0;

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
            <h1 className="projected-spending-reports-container-title">Projected Spending</h1>
            <div className='project-spending-report-left-box reports-graph-box-wrapper'>
                {graphLoading ? (
                  <div className="loading-spinner">Loading chart...</div>
                  ) : currentMonthReceipts.length >= 4 && graphUrl ? (
                    <img src={graphUrl} alt="Projected Spending Graph" className='reports-projected-graph-image'/>
                  ) : (
                  <>
                  <img src={graphUrl || ''} alt="Blurred Projected Spending Graph" className='projected-graph-image reports-blurred'/>
                   <div className='reports-graph-overlay-message'>Add at least 4 receipts from this month to view your projected spending chart</div>
                  </>
                  )}
                </div>
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
        
        <div className="right-side">
        <div className="top-categories-section">
          <h2 className="section-title">Top 3 Categories You Spent the Most On</h2>
          <div className="top-categories-container">
            {topCategories.length === 0 ? (
              <p>No spending data available</p>
            ) : (
              topCategories.map((category, index) => (
                <div key={index} className="category-box">
                  {category}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="insights-section">
          <h2 className="section-title">Insights</h2>
          <div className="insights-box">
            {receipts.length === 0 ? (
              <p>Add a receipt to view your budgeting insights</p>
            ) : (
              <ul>
                <li>
                  You spent the most on {topCategories[0] || 'N/A'}, try buying items with deals or added savings.
                </li>
                <li>
                  Your goal is to save ${numericBudget.toLocaleString()}, try an automatic savings plan.
                </li>
                <li>
                  {remaining < 0 ? (
                    <>
                      You went over your budget by ${Math.abs(remaining).toLocaleString()} this month.
                      Try breaking down your purchases to focus on essentials first.
                    </>
                  ) : (
                    `You've saved ${savedPercentage}% of your $${numericBudget.toLocaleString()} goal this month!`
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>


        <div className="recurring-expenses-section">
          <h2 className="section-title">Upcoming Bills</h2>
          <div className="recurring-expenses-box">
            {receipts.filter(receipt => receipt.recurring).length === 0 ? (
              <p className="numbers-container-title">No recurring expenses found</p>
            ) : (
              <ul className="recurring-list">
                {receipts.filter(receipt => receipt.recurring).map((receipt, index) => (
                  <li key={index} className="recurring-item">
                    Your {receipt.merchant_name} subscription (${receipt.total.toFixed(2)}) is due next month
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  </>
    );
  }
  
  export default Reports;