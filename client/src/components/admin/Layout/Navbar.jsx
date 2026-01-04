import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/adminnavbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <>
      {/* Top Container/Header */}
      <header className="admin-dashboard-header">
        <div className="admin-header-left">
          <button className="admin-menu-toggle" onClick={toggleSidebar}>  
            <span className="admin-hamburger"></span>
            <span className="admin-hamburger"></span>
            <span className="admin-hamburger"></span>
          </button>
          <h2 className="admin-dashboard-title">Admin Dashboard</h2>
        </div>
        <div className="admin-header-right">
          <div className="admin-search-box">
            <input type="search" placeholder="Search..." />
          </div>
          <div className="admin-user-profile">
            <img src="/default-admin-avatar.png" alt="Admin" />{/**Admin Avatar */}
            <span className="admin-user-name">Admin</span>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo d-flex align-items-center">
           <img 
            src="/admin-logo.png"
            height="40"
            width="40"
            style={{borderRadius: '50%'}}
            className="me-2"
        />
            <h3>Admin</h3>
          </div>
          <button className="admin-close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard" className="admin-nav-link active">
                <span className="admin-icon"><i className="bi bi-speedometer2"></i></span>
                <span className="admin-nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-people"></i></span>
                <span className="admin-nav-text">Users Management</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-box-seam"></i></span>
                <span className="admin-nav-text">Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-collection"></i></span>
                <span className="admin-nav-text">Digital Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/logs" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-file-text"></i></span>
                <span className="admin-nav-text">Account Logs</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/consignments" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-camera-video"></i></span>
                <span className="admin-nav-text">Consignment Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/website-settings" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-palette"></i></span>
                <span className="admin-nav-text">Website Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/branding" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-brush"></i></span>
                <span className="admin-nav-text">Branding & Graphics</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/notifications" className="admin-nav-link">
                <span className="admin-icon"><i className="bi bi-bell"></i></span>
                <span className="admin-nav-text">Notifications</span>
              </Link>
            </li>
          </ul>
        </nav>

            <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/adminlogin';
        }}>
          <span className="admin-icon"><i className="bi bi-box-arrow-right"></i></span>
          <span className="admin-nav-text">Logout</span>
        </button>
      </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Navbar;
