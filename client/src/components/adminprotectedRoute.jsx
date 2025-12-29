import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Make sure you set this on login

  if (!token || userRole !== 'admin') {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;