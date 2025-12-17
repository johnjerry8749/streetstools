import { Routes, Route } from 'react-router-dom';
// import AppNavbar from './components/pages/Layout/Navbar';
import Home from './components/pages/Home';
import Product from './components/pages/Product';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Contact from './components/pages/Contact';
import Login from './components/auth/login';
import Register from './components/auth/register';
import ForgetPassword from './components/auth/forgetpassword';

//user dashboard routes
import Dashboard from './components/user/dashboard';
import Profile from './components/user/profile.jsx';

//protected route component
import ProtectedRoute from './components/protectedRoutes.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

      {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;