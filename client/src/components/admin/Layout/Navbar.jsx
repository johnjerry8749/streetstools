import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';


import './css/navbar.css';

const Navbar = () => {

    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sitename, setSitename] = useState("Site-Tools");
    const [sitelogo, setSiteLogo] = useState("");
    const [userName, setUserName] = useState("Loading...");
    const [userImage, setUserImage] = useState("");
    const [notificationCounts, setNotificationCounts] = useState('0');



    useEffect(() => {
      const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${apiUrl}/user/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setNotificationCounts(data.unreadCount);
            }
        })
        .catch((error) => console.error("Error fetching notifications:", error));
    }
    , []);

  

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${apiUrl}/site-settings`)
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 'success') {
              setSitename(data.sitename);
              setSiteLogo(data.sitelogo);
            }
            })
            .catch((error) => console.error("Error fetching site name:", error));
        }, []);

        useEffect(() => {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const token = localStorage.getItem('token');
            fetch(`${apiUrl}/user/profile`, {
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
                    // If user image URL is available, set it; otherwise, use placeholder
                    setUserImage(data.user.profile_image || '');
                }
            })
            .catch((error) => console.error("Error fetching user profile:", error));
        }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get first name from full name
  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  // Get last name from full name
//   const getLastName = (fullName) => {
//     const parts = fullName.split(' ');
//     return parts[parts.length - 1];
//   };

    const handleNotificationClick = () => {
        navigate('/dashboard/profile', { state: { activeTab: 'notification' } });
    };


    const handleLogout = () => {
      localStorage.removeItem('token'); // Remove token or any user data
      navigate('/Login');
    };


  return (
    <>
      {/* Top Container/Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>  
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
          <h2 className="dashboard-title">User Dashboard</h2>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input type="search" placeholder="Search..." />
          </div>
          <div className="notifications">
            <button className="notification-btn" onClick={handleNotificationClick}>
              {notificationCounts > 0 && <span className="badge">{notificationCounts}</span>}
              <i className="bi bi-bell"></i>
            </button>
          </div>
          <div className="user-profile">
            <img src={userImage} alt="User" /> {/* Dynamic User Image */}
            <span className="user-name">{getFirstName(userName)}</span> {/* Dynamic User Name */}
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo d-flex align-items-center">
           <img 
            src={sitelogo} //admin Logo from database or public folder
            height="40"
            width="40"
            style={{borderRadius: '50%'}}
            className="me-2"
        />
            <h3>{sitename}</h3> {/* Application Name */}
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className="nav-link active">
                <span className="icon"><i className="bi bi-speedometer2"></i></span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/profile" className="nav-link">
                <span className="icon"><i className="bi bi-person"></i></span>
                <span className="nav-text">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/orders" className="nav-link">
                <span className="icon"><i className="bi bi-box-seam"></i></span>
                <span className="nav-text">Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/products" className="nav-link">
                <span className="icon"><i className="bi bi-collection"></i></span>
                <span className="nav-text">Other-digital Products</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/accountlogs" className="nav-link">
                <span className="icon"><i className="bi bi-file-text"></i></span>
                <span className="nav-text">All Account Logs</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/consignment" className="nav-link">
                <span className="icon"><i className="bi bi-camera-video"></i></span>
                <span className="nav-text">Order Consignment Box-Video</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/webdesign" className="nav-link">
                <span className="icon"><i className="bi bi-palette"></i></span>
                <span className="nav-text">Website design</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/branding" className="nav-link">
                <span className="icon"><i className="bi bi-brush"></i></span>
                <span className="nav-text">Branding & Graphics Design</span>
              </Link>
            </li>
          </ul>
        </nav>

            <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon"><i className="bi bi-box-arrow-right"></i></span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Navbar;
