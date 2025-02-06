import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from "./login/login.component";
import Dashboard from "./dashboard/dashboard.component";
import Create_Account from './create_account/create_account.component';
import About from './about/about.component';
import Profile from './profile/profile.component';
import Receipts from './receipts/receipt.component';
import Resources from './resources/resources.component';
import Reports from './reports/reports.component';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to login if no specific path is provided */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Login page route */}
        <Route path="/login" element={<Login />} />
        {/* Dashboard page route */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Create new account page route */}
        <Route path="/create_account" element={<Create_Account />} />
        {/* About page route */}
        <Route path="/about" element={<About />} />
        {/* Profile page route */}
        <Route path="/profile" element={<Profile />} />
        {/* Receipts page route */}
        <Route path="/receipts" element={<Receipts />} />
        {/* Reports page route */}
        <Route path="/reports" element={<Reports />} />
        {/* Resources page route */}
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

export default App;
