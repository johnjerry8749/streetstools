import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/adminnavbar.css';


const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sitelogo, setSiteLogo] = useState('');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSiteLogo(data.sitelogo);
        }
      })
      .catch((error) => console.error("Error fetching site logo:", error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto close sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };



  return (
    <>
      {/* Top Container/Header */}
      <header className="admin-dashboard-header">
        <div className="admin-header-left">
          <button 
            className={`admin-menu-toggle ${isMobile ? 'mobile' : ''}`} 
            onClick={toggleSidebar}
            style={{ 
              display: window.innerWidth <= 992 ? 'flex' : 'none',
              zIndex: 1001,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '5px',
              fontSize: '24px',
              color: '#333'
            }}
          >  
            <i className="bi bi-list"></i>
          </button>
          <h2 className="admin-dashboard-title" style={{ 
            fontSize: isMobile ? '18px' : '24px'
          }}>Admin Dashboard</h2>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-profile">
            <img 
            src={sitelogo} //admin Logo from database or public folder
            height="40"
            width="40"
            style={{borderRadius: '50%'}}
            className="me-2"
        />
            <span className="admin-user-name">Admin</span>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`} style={{
        transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        position: isMobile ? 'fixed' : 'fixed',
        zIndex: isMobile ? 1000 : 1000
      }}>
        <div className="admin-sidebar-header">
          <div className="admin-logo d-flex align-items-center">
           <img 
            src={sitelogo} //admin Logo from database or public folder
            height="40"
            width="40"
            style={{borderRadius: '50%'}}
            className="me-2"
        />
            <h3>Admin</h3>
          </div>
          {isMobile && (
            <button 
              className="admin-close-sidebar" 
              onClick={closeSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '3px'
              }}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard" className="admin-nav-link active" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-speedometer2"></i></span>
                <span className="admin-nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/usermanagement" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-people"></i></span>
                <span className="admin-nav-text">Users Management</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-box-seam"></i></span>
                <span className="admin-nav-text">Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/digitalproducts" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-collection"></i></span>
                <span className="admin-nav-text">Digital Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/allproducts" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-file-text"></i></span>
                <span className="admin-nav-text">Manage Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/consignments" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-camera-video"></i></span>
                <span className="admin-nav-text">Consignment Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/website-settings" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-palette"></i></span>
                <span className="admin-nav-text">Website Creation</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/branding" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-brush"></i></span>
                <span className="admin-nav-text">Branding & Graphics</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/notifications" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-bell"></i></span>
                <span className="admin-nav-text">Notifications</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="admin-nav-link" onClick={isMobile ? closeSidebar : undefined}>
                <span className="admin-icon"><i className="bi bi-gear"></i></span>
                <span className="admin-nav-text">Settings</span>
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
      {isMobile && isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        ></div>
      )}
    </>
  );
};

export default Navbar;
