import React, { useState, useEffect } from 'react';
import Navbar from "./Layout/Navbar"
import Footer from "./Layout/footer"

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    role: '',
    phonenumber: '',
    country: ''
  });

  useEffect(() => {
    fetchUsers();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          fetchUsers(); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      fullname: user.fullName || '',
      email: user.email || '',
      role: user.role || 'user',
      phonenumber: user.phoneNumber || '',
      country: user.country || ''
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({
      fullname: '',
      email: '',
      role: '',
      phonenumber: '',
      country: ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveUserChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/users/${editingUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        closeEditModal();
        fetchUsers(); // Refresh data
        alert('User updated successfully!');
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge bg-success';
      case 'inactive': return 'badge bg-secondary';
      case 'banned': return 'badge bg-danger';
      case 'suspended': return 'badge bg-warning text-dark';
      case 'pending': return 'badge bg-primary';
      default: return 'badge bg-secondary';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-primary fw-bold';
      case 'moderator': return 'text-info fw-bold';
      case 'user': return 'text-muted';
      case 'guest': return 'text-secondary';
      default: return 'text-muted';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status?.toLowerCase() === filterStatus;
    const matchesRole = filterRole === 'all' || user.role?.toLowerCase() === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div 
          className="admin-content d-flex justify-content-center align-items-center" 
          style={{ 
            marginTop: isMobile ? '70px' : '90px',
            marginLeft: isMobile ? '0' : '260px',
            minHeight: 'calc(100vh - 160px)',
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                  <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                      <h4 className="card-title mb-0">User Management</h4>
                      <p className="text-muted mb-0">{filteredUsers.length} users found</p>
                    </div>
                    <div className="col-12 col-md-6 mt-2 mt-md-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ maxWidth: '200px' }}
                        />
                        <select 
                          className="form-select form-select-sm"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          style={{ maxWidth: '120px' }}
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="banned">Banned</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                        <select 
                          className="form-select form-select-sm"
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                          style={{ maxWidth: '120px' }}
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0" style={{ overflow: 'visible' }}>
                  {isMobile ? (
                    // Mobile Card View
                    <div className="p-3" style={{ overflow: 'visible' }}>
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="card mb-3 border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle me-3">
                                  {user.profileImage ? (
                                    <img 
                                      src={user.profileImage} 
                                      alt={user.fullname}
                                      className="rounded-circle"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div 
                                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                      style={{ width: '40px', height: '40px', fontSize: '16px' }}
                                    >
                                      {user.fullname?.charAt(0) || user.username?.charAt(0) || 'U'}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h6 className="mb-1">{user.fullname || user.username}</h6>
                                  <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                                </div>
                              </div>
                              <span className={getStatusBadgeClass(user.status)}>
                                {user.status || 'Unknown'}
                              </span>
                            </div>
                            
                            <div className="mb-2">
                              <small className="text-muted d-block">Email:</small>
                              <span className="small">{user.email}</span>
                            </div>
                            
                            <div className="mb-2">
                              <small className="text-muted d-block">Username:</small>
                              <span className="small">{user.username}</span>
                            </div>
                            
                            <div className="mb-2">
                              <small className="text-muted d-block">Joined:</small>
                              <span className="small">{formatDate(user.createdAt)}</span>
                            </div>
                            
                            <div className="mb-3">
                              <small className="text-muted d-block">Last Active:</small>
                              <span className="small">{formatLastActive(user.lastActive)}</span>
                            </div>
                            
                            <div className="d-flex gap-2 flex-wrap">
                              <div className="dropdown" style={{ position: 'static' }}>
                                <button 
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                  type="button" 
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="true"
                                  style={{ zIndex: 1050 }}
                                >
                                  <i className="fas fa-cog me-1"></i>
                                  Status
                                </button>
                                <ul className="dropdown-menu" style={{ zIndex: 1060, position: 'absolute' }}>
                                  <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'active')}><i className="fas fa-check-circle text-success me-2"></i>Set Active</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'inactive')}><i className="fas fa-pause-circle text-secondary me-2"></i>Set Inactive</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'suspended')}><i className="fas fa-clock text-warning me-2"></i>Suspend</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'banned')}><i className="fas fa-ban text-danger me-2"></i>Ban</button></li>
                                </ul>
                              </div>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteUser(user.id)}
                                title="Delete User"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Desktop Table View
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ minWidth: '200px' }}>
                              <div className="d-flex align-items-center">
                                Full Name
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '200px' }}>
                              <div className="d-flex align-items-center">
                                Email
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '140px' }}>
                              <div className="d-flex align-items-center">
                                Username
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '100px' }}>
                              <div className="d-flex align-items-center">
                                Status
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '100px' }}>
                              <div className="d-flex align-items-center">
                                Role
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '140px' }}>
                              <div className="d-flex align-items-center">
                                Joined Date
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '140px' }}>
                              <div className="d-flex align-items-center">
                                Last Active
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                            <th scope="col" style={{ minWidth: '120px' }}>
                              <div className="d-flex align-items-center">
                                Actions
                                <i className="fas fa-sort ms-2 text-muted"></i>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <input type="checkbox" className="form-check-input me-3" />
                                  <div className="me-3">
                                    {user.profileImage ? (
                                      <img 
                                        src={user.profileImage} 
                                        alt={user.fullname}
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div 
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                        style={{ width: '40px', height: '40px', fontSize: '16px' }}
                                      >
                                        {user.fullname?.charAt(0) || user.username?.charAt(0) || 'U'}
                                      </div>
                                    )}
                                  </div>
                                  <span className="fw-medium">{user.fullname || user.username}</span>
                                </div>
                              </td>
                              <td>
                                <a href={`mailto:${user.email}`} className="text-decoration-none">
                                  {user.email}
                                </a>
                              </td>
                              <td>{user.username}</td>
                              <td>
                                <span className={getStatusBadgeClass(user.status)}>
                                  {user.status || 'Unknown'}
                                </span>
                              </td>
                              <td>
                                <span className={getRoleBadgeClass(user.role)}>
                                  {user.role || 'User'}
                                </span>
                              </td>
                              <td>{formatDate(user.createdAt)}</td>
                              <td>{formatLastActive(user.lastActive)}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <button 
                                    className="btn btn-sm btn-outline-primary" 
                                    onClick={() => openEditModal(user)}
                                    title="Edit User"
                                  >
                                    <i className="fas fa-edit me-1"></i>
                                    {isMobile ? '' : 'Edit'}
                                  </button>
                                  <div className="dropdown" style={{ position: 'static' }}>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                      type="button" 
                                      data-bs-toggle="dropdown"
                                      data-bs-auto-close="true"
                                      title="More Actions"
                                      style={{ zIndex: 1050 }}
                                    >
                                      <i className="fas fa-ellipsis-v me-1"></i>
                                      {isMobile ? '' : 'More'}
                                    </button>
                                    <ul className="dropdown-menu" style={{ zIndex: 1060, position: 'absolute' }}>
                                      <li><h6 className="dropdown-header"><i className="fas fa-cog me-2"></i>Change Status</h6></li>
                                      <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'active')}><i className="fas fa-check-circle text-success me-2"></i>Set Active</button></li>
                                      <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'inactive')}><i className="fas fa-pause-circle text-secondary me-2"></i>Set Inactive</button></li>
                                      <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'suspended')}><i className="fas fa-clock text-warning me-2"></i>Suspend</button></li>
                                      <li><button className="dropdown-item" onClick={() => updateUserStatus(user.id, 'banned')}><i className="fas fa-ban text-danger me-2"></i>Ban</button></li>
                                      <li><hr className="dropdown-divider" /></li>
                                      <li><button className="dropdown-item text-danger" onClick={() => deleteUser(user.id)}><i className="fas fa-trash me-2"></i>Delete User</button></li>
                                    </ul>
                                  </div>
                                  <button 
                                    className="btn btn-sm btn-outline-danger" 
                                    onClick={() => deleteUser(user.id)}
                                    title="Delete User"
                                  >
                                    <i className="fas fa-trash me-1"></i>
                                    {isMobile ? '' : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No users found</h5>
                      <p className="text-muted">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Edit User: {editingUser?.fullName || editingUser?.email}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeEditModal}
                ></button>
              </div>
              <form onSubmit={saveUserChanges}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullname" className="form-label">
                        <i className="fas fa-user me-1"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        name="fullname"
                        value={editForm.fullname}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope me-1"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="role" className="form-label">
                        <i className="fas fa-user-tag me-1"></i>
                        Role
                      </label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={editForm.role}
                        onChange={handleEditFormChange}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phonenumber" className="form-label">
                        <i className="fas fa-phone me-1"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phonenumber"
                        name="phonenumber"
                        value={editForm.phonenumber}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="country" className="form-label">
                        <i className="fas fa-globe me-1"></i>
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={editForm.country}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  
                  {editingUser && (
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-1"></i>
                      <strong>User ID:</strong> {editingUser.id} | 
                      <strong> Status:</strong> <span className={getStatusBadgeClass(editingUser.status)}>{editingUser.status}</span> | 
                      <strong> Joined:</strong> {formatDate(editingUser.joinedDate || editingUser.createdAt)}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeEditModal}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    <i className="fas fa-save me-1"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default UserManagement
