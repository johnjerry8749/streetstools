import React, { useState, useEffect } from 'react';
import Navbar from "./Layout/Navbar"
import Footer from "./Layout/footer"

const Settings = () => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: '' ,
    siteEmail: '',
    sitePhone: '',
    siteliveChat: '',
    siteAddress: '',
    sitelogo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchSiteSettings();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/site-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setSiteSettings({
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
          siteEmail: data.siteEmail || '',
          sitePhone: data.sitePhone || '',
          siteAddress: data.siteAddress || '',
          sitelogo: data.sitelogo || '',
          siteliveChat: data.siteliveChat || '',
        });
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setMessage('Failed to load site settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      
      // Append all form data
      formData.append('siteName', siteSettings.siteName);
      formData.append('siteDescription', siteSettings.siteDescription);
      formData.append('siteEmail', siteSettings.siteEmail);
      formData.append('sitePhone', siteSettings.sitePhone);
      formData.append('siteAddress', siteSettings.siteAddress);
      formData.append('siteliveChat', siteSettings.siteliveChat);
      if (logoFile) {
        formData.append('sitelogo', logoFile);
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/site-settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Site settings updated successfully!');
        fetchSiteSettings(); // Refresh data
      } else {
        setMessage(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
      setMessage('Failed to update site settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div 
        className="admin-content" 
        style={{ 
          marginTop: isMobile ? '70px' : '90px', 
          marginLeft: isMobile ? '0' : '260px',
          padding: isMobile ? '10px' : '20px', 
          minHeight: 'calc(100vh - 160px)',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mb-0">Site Settings</h4>
                  <p className="text-muted mb-0">Update your website information</p>
                </div>
                <div className="card-body">
                  {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Basic Site Information */}
                      <div className="col-12 col-lg-6 mb-4">
                        <h5 className="mb-3">Basic Information</h5>
                        
                        <div className="mb-3">
                          <label htmlFor="siteName" className="form-label">Site Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="siteName"
                            name="siteName"
                            value={siteSettings.siteName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="siteDescription" className="form-label">Site Description</label>
                          <textarea
                            className="form-control"
                            id="siteDescription"
                            name="siteDescription"
                            rows="3"
                            value={siteSettings.siteDescription}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="siteEmail" className="form-label">Contact Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="siteEmail"
                            name="siteEmail"
                            value={siteSettings.siteEmail}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="siteliveChat" className="form-label">LiveChat</label>
                          <input
                            type="text"
                            className="form-control"
                            id="siteliveChat"
                            name="siteliveChat"
                            value={siteSettings.siteliveChat}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="sitePhone" className="form-label">Contact Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="sitePhone"
                            name="sitePhone"
                            value={siteSettings.sitePhone}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="siteAddress" className="form-label">Address</label>
                          <textarea
                            className="form-control"
                            id="siteAddress"
                            name="siteAddress"
                            rows="2"
                            value={siteSettings.siteAddress}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Logo Section */}
                      <div className="col-12 col-lg-6 mb-4">
                        <h5 className="mb-3">Site Logo</h5>
                        
                        <div className="mb-3">
                          <label htmlFor="sitelogo" className="form-label">Site Logo</label>
                          {siteSettings.sitelogo && (
                            <div className="mb-2 text-center">
                              <img 
                                src={siteSettings.sitelogo} 
                                alt="Current Logo" 
                                style={{ 
                                  maxWidth: isMobile ? '150px' : '200px', 
                                  maxHeight: isMobile ? '75px' : '100px', 
                                  objectFit: 'contain' 
                                }}
                                className="img-fluid border rounded"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            className="form-control"
                            id="sitelogo"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                          <div className="form-text">Upload a new logo (leave empty to keep current)</div>
                        </div>

                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12 d-grid">
                        <button 
                          type="submit" 
                          className={`btn btn-primary ${isMobile ? 'btn-lg' : ''}`}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Updating...
                            </>
                          ) : (
                            'Update Site Settings'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Settings
