import React, { useState, useEffect, use } from 'react';
import Footer from './layout/footer';
import Navbar from './layout/navbar';
import './css/profile.css';
import { useLocation } from 'react-router-dom';

const Profile = () => {
    const location = useLocation();
  const [activeTab, setActiveTab] = useState('personal');

  // Handle navigation from notification bell click
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    dateOfBirth: '',
    country: '',
    phoneNumber: '',
    profileImage: 'https://via.placeholder.com/150'
  });
  //user password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  //loading and saving states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  //Notification settings state can be added here in future
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationMsg, setNotificationMsg] = useState('');

  // Fetch user profile data on component mount
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    const token = localStorage.getItem('token');
    
    fetch(`${apiUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const names = data.user.fullname.split(' ');
        setProfileData({
          firstName: names[0] || '',
          lastName: names[1] || '',
          email: data.user.email || '',
          username: data.user.email?.split('@')[0] || '',
          country: data.user.country || '',
          phoneNumber: data.user.phonenumber || '',
          profileImage: data.user.profile_image || 'https://via.placeholder.com/150'
        });
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
      setLoading(false);
    });
  }, []);

// Fetch notifications
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');
      
      console.log('Fetching from:', `${apiUrl}/user/notifications`); // Debug
      console.log('Token exists:', !!token); // Debug
      
      const response = await fetch(`${apiUrl}/user/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status); // Debug
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notification data:', data); // Debug
      
      if (data.status === 'success') {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        
        if (data.notifications.length === 0) {
          setNotificationMsg('Hello! You don\'t have any notifications yet');
        } else {
          setNotificationMsg('');
        }
      } else {
        setNotificationMsg('Failed to load notifications: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationMsg('Failed to load notifications. Please try again later.');
    }
  };
  
  fetchNotifications();
}, []);


  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/user/notifications/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Update local state
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        ));
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');
      
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      for (const notif of unreadNotifications) {
        await fetch(`${apiUrl}/user/notifications/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ notificationId: notif.id })
        });
      }
      
      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
      setPasswordMessage({ type: 'success', text: 'All notifications marked as read!' });
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      setPasswordMessage({ type: 'error', text: 'Failed to clear notifications' });
    }
  };

    //Notify tab change based on location state
     useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);



  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    setMessage({ type: '', text: '' });
  };

  // Handle profile image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 10MB' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only image files (JPEG, PNG, GIF, WebP) are allowed' });
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch(`${apiUrl}/user/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Update profile image with Cloudinary URL
        setProfileData({
          ...profileData,
          profileImage: data.imageUrl
        });
        setMessage({ type: 'success', text: 'Profile image uploaded successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload image' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) {
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/user/profile/remove-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setProfileData({
          ...profileData,
          profileImage: data.imageUrl
        });
        setMessage({ type: 'success', text: 'Profile image removed successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to remove image' });
      }
    } catch (error) {
      console.error('Error removing image:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordMessage({ type: '', text: '' });
  };

  const handlePasswordUpdate = async () => {
    // Validate password fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setSaving(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setPasswordMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:3000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/user/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPasswordMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setPasswordMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.phoneNumber) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          country: profileData.country,
          phoneNumber: profileData.phoneNumber
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Optionally refresh the profile data
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <button 
            className={`sidebar-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="bi bi-person"></i>
            <span>Personal Information</span>
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'notification' ? 'active' : ''}`}
            onClick={() => setActiveTab('notification')}
          >
            <i className="bi bi-bell"></i>
            <span>Notifications</span>
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="bi bi-shield-lock"></i>
            <span>Security Settings</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'personal' && (
            <div className="profile-content">
              <h2>Personal Information</h2>

              {/* Success/Error Message */}
              {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                  {message.text}
                </div>
              )}

              {/* Profile Image */}
              <div className="profile-image-section">
                <div className="profile-image-wrapper">
                  <img src={profileData.profileImage} alt="Profile" />
                  {uploadingImage && (
                    <div className="image-overlay">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="image-buttons">
                  <label htmlFor="upload-image" className={`upload-btn ${uploadingImage ? 'disabled' : ''}`}>
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </label>
                  <input 
                    type="file" 
                    id="upload-image" 
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="remove-btn" 
                    onClick={handleRemoveImage}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="profile-form">
                <div className="form-row">
                      <div className="form-group">
                        <label>First Name <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name <span className="required">*</span></label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>
    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email <span className="required">*</span></label>
                        <input 
                          type="email" 
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number <span className="required">*</span></label>
                        <input 
                          type="tel" 
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Country</label>
                        <select 
                          name="country"
                          value={profileData.country}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="">Select Country</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                        </select>
                      </div>
                    </div>
    
                    <div className="form-actions">
                      <button 
                        className="save-btn" 
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
    
              {activeTab === 'security' && (
                <div className="profile-content">
                  <h2>Security Settings</h2>
    
                  {/* Success/Error Message */}
              {passwordMessage.text && (
                <div className={`alert alert-${passwordMessage.type === 'success' ? 'success' : 'danger'}`}>
                  {passwordMessage.text}
                </div>
              )}

              {/* Email Verification Section */}
              <div className="security-section">
                <h3>Email Verification</h3>
                <p className="section-description">Verify your email address to secure your account</p>
                <button 
                  className="verify-email-btn" 
                  onClick={handleVerifyEmail}
                  disabled={verifyingEmail}
                >
                  {verifyingEmail ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-envelope-check me-2"></i>
                      Send Verification Email
                    </>
                  )}
                </button>
              </div>

              {/* Change Password Section */}
              <div className="security-section">
                <h3>Change Password</h3>
                <p className="section-description">Update your password to keep your account secure</p>

                <div className="password-form">
                  <div className="form-group">
                    <label>Current Password <span className="required">*</span></label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password <span className="required">*</span></label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password <span className="required">*</span></label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      className="save-btn" 
                      onClick={handlePasswordUpdate}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notification' && (
  <div className="profile-content">
    <div className="notification-center-header">
      <div className="notification-title-section">
        <h2 className="text-dark">
          <i className="bi bi-bell-fill me-2"></i>
          Notification Center
          {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
        </h2>
        <p className="text-muted mb-0">
          {notifications.length === 0 ? 'No notifications' : `${notifications.length} total notification${notifications.length !== 1 ? 's' : ''}`}
        </p>
      </div>
      {notifications.length > 0 && unreadCount > 0 && (
        <button 
          className="btn btn-outline-primary btn-sm clear-all-btn"
          onClick={clearAllNotifications}
        >
          <i className="bi bi-check-all me-2"></i>
          Mark All as Read
        </button>
      )}
    </div>

    {passwordMessage.text && (
      <div className={`alert alert-${passwordMessage.type === 'success' ? 'success' : 'danger'} mt-3`}>
        {passwordMessage.text}
      </div>
    )}
    
    {notifications.length === 0 ? (
      <div className="empty-notifications text-center py-5">
        <i className="bi bi-bell-slash" style={{ fontSize: '64px', color: '#d1d5db' }}></i>
        <p className='text-muted mt-3 mb-0' style={{ fontSize: '16px' }}>{notificationMsg}</p>
      </div>
    ) : (
      <div className="notifications-list mt-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`notification-item ${!notif.is_read ? 'unread' : ''} notification-${notif.type}`}
          >
            <div className="notification-icon">
              <i className={`bi bi-${
                notif.type === 'success' ? 'check-circle-fill' : 
                notif.type === 'warning' ? 'exclamation-triangle-fill' : 
                notif.type === 'error' ? 'x-circle-fill' : 
                'info-circle-fill'
              }`}></i>
            </div>
            <div className="notification-content">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="text-dark mb-0">{notif.title}</h4>
                {!notif.is_read && <span className="badge bg-primary badge-sm">New</span>}
              </div>
              <p className="text-dark mb-2">{notif.message}</p>
              <div className="notification-footer d-flex justify-content-between align-items-center">
                <span className="notification-time text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {new Date(notif.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                
                {!notif.is_read && (
                  <button 
                    className="btn btn-sm btn-outline-secondary mark-read-btn"
                    onClick={() => markAsRead(notif.id)}
                  >
                    <i className="bi bi-check2 me-1"></i>
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
