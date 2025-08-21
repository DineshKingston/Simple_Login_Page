import React from 'react';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Dashboard</h2>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="dashboard-content">
        <h1>Welcome to Dashboard!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
