import React, { useEffect, useState } from 'react';
import './dashboard.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [categorySpending, setCategorySpending] = useState([]);
  const [graphUrl, setGraphUrl] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [currentMonthReceipts, setCurrentMonthReceipts] = useState([]);
  const [graphLoading, setGraphLoading] = useState(true);



  useEffect(() => {

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
    

    fetchStockData();
    fetchDashboardData();
    fetchGraph();
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

  const fetchDashboardData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const userRes = await fetch(`http://localhost:8080/profile/${userEmail}`);
      const userData = await userRes.json();
      setBudget(userData.spendingGoal || 0);

      const receiptRes = await fetch(`http://localhost:8080/reports/${userEmail}`);
      const receiptData = await receiptRes.json();
      setReceipts(receiptData);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const filteredReceipts = receiptData.filter(r => {
        const date = new Date(r.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      setCurrentMonthReceipts(filteredReceipts);

      const spendingMap = {};
      filteredReceipts.forEach(r => {
        if (!r.receipt_type || !r.total) return;
        spendingMap[r.receipt_type] = (spendingMap[r.receipt_type] || 0) + r.total;
      });

      const formattedData = Object.entries(spendingMap).map(([type, total]) => ({
        name: type,
        value: total,
      }));

      setCategorySpending(formattedData);

      const totalExpenses = filteredReceipts.reduce((sum, r) => sum + (r.total || 0), 0);
      setExpenses(totalExpenses);

    } catch (err) {
      console.error(err);
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
        {/* Pie Charts Row */}
        <div className='dashboard-rows'>
          <div className='dashboard-container-wrapper'>
            <div className='dashboard-bottom-row-container'>
            <div className='dashboard-container-title'>Spending by Category</div>
              <div className='top-row-boxes graph-box-wrapper'>
                {currentMonthReceipts.length === 0 ? (
                  <>
                    <div className="category-blurred-background" />
                    <div className='graph-overlay-message'>Add receipts to see spendings</div>
                  </>
                ) : (
                  <ResponsiveContainer width="100%" height={315}>
                    <PieChart>
                      <Pie
                        data={categorySpending}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label
                      >
                        {categorySpending.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#FF6347", "#8A2BE2", "#5ec57f", "#FF1493", "#00BFFF", "#C71585"][index % 5]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
            <div className='dashboard-bottom-row-container'>
              <div className='dashboard-container-title'>Budget Usage</div>
              <div className='top-row-boxes'>
                <ResponsiveContainer width="100%" height={315}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Spent', value: expenses },
                        { name: 'Remaining', value: Math.max(budget - expenses, 0) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#5ec57f" />
                      <Cell fill="#00BFFF" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Stocks and Projected Spending */}
        <div className='dashboard-rows'>
          <div className='dashboard-container-wrapper'>
            <div className='dashboard-bottom-row-container'>
              <div className='projected-spending-dashboard-container-title'>Projected Spendings</div>
              <div className='projected-spending-bottom-row-boxes graph-box-wrapper'>
                {graphLoading ? (
                  <div className="loading-spinner">Loading chart...</div>
                  ) : currentMonthReceipts.length >= 4 && graphUrl ? (
                    <img src={graphUrl} alt="Projected Spending Graph" className='projected-graph-image'/>
                  ) : (
                  <>
                  <img src={graphUrl || ''} alt="Blurred Projected Spending Graph" className='projected-graph-image blurred'/>
                   <div className='graph-overlay-message'>Add at least 4 receipts from this month to view your projected spending chart</div>
                  </>
                  )}
                </div>
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
      </div>
    </>
  );
};

export default Dashboard;
