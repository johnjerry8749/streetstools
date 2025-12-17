import React from 'react';
import Navbar from './layout/navbar';
import Footer from './layout/footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/dashboard.css';
import {useState, useEffect} from 'react';

const Dashboard = () => {
    const [userName, setUserName] = useState(" ");

    //fetch user profile data
    useEffect(() => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
            fetch(`${apiUrl}/user/profile`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setUserName(data.user.fullname);
                }
            })
            .catch((error) => console.error("Error fetching user profile:", error));
        }
    , []);

    //fetch user stats data




  // Get first name from full name
 const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h4>Hello!! {getFirstName(userName)}... Welcome to Your Dashboard</h4>
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div className="stat-info">
                <h3>Total Orders</h3>
                <p className="stat-value">245</p>
                <span className="stat-change positive">+12% from last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-info">
                <h3>Pending Orders</h3>
                <p className="stat-value">245</p>
                <span className="stat-change positive">+8% from last month</span>
              </div>
            </div>

          {/* Recent Activity */}    
            </div>
          </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
