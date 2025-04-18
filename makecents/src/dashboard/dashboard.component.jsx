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

  useEffect(() => {
    fetchStockData();
    fetchDashboardData();
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

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const filteredReceipts = receiptData.filter(r => {
        const date = new Date(r.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

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

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Example labels
    datasets: [
      {
        label: 'Projected Spending',
        data: [500, 750, 650, 900, 800], // Example data points
        fill: false,
        borderColor: 'black',
        backgroundColor: 'black',
        tension: 0.4,
      },
    ],
  };
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill its container dimensions
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'black', // x-axis number color
        },
        grid: {
          color: 'rgba(0,0,0,0.1)', // Grid line color (optional)
        },
      },
      y: {
        ticks: {
          color: 'black', // y-axis number color
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
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
              <div className='top-row-boxes'>
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
              <div className='dashboard-container-title'>Projected Spendings</div>
              <div className='projected-spending-bottom-row-boxes'>
                <div style={{ width: '100%', height: '100%' }}>
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
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
