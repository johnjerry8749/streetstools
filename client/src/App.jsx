import { Routes, Route } from 'react-router-dom';
// import AppNavbar from './components/pages/Layout/Navbar';
import Home from './components/pages/Home';
import Product from './components/pages/Product';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Contact from './components/pages/Contact';
import Login from './components/auth/login';
import Adminlogin from './components/auth/adminlogin.jsx';
import Register from './components/auth/register';
import ForgetPassword from './components/auth/forgetpassword';

//User & Admin Protected Route 
import ProtectedRoute from './components/protectedRoutes.jsx';
import AdminProtectedRoute from './components/adminprotectedRoute.jsx';

//user dashboard protected route component
import Dashboard from './components/user/dashboard';
import Profile from './components/user/profile.jsx';
import Orders from './components/user/orders.jsx';
import DigitalProduct from './components/user/digitalProduct.jsx';
import Webdesign from './components/user/webdesign.jsx';
import Accountlogs from './components/user/accountlogs.jsx';
import Consignment from './components/user/consignment.jsx';
import Branding from './components/user/branding.jsx';

//Admin Protected Route component
import Admin_Dashboard  from './components/admin/dashboard.jsx'
import Settings from './components/admin/settings.jsx';
import Usermanagement from './components/admin/usermanagement.jsx';
import AdminDigitalProduct from './components/admin/digitalproducts.jsx';
import ManageProducts from './components/admin/ManageProducts.jsx';
import PaymentCallback from './components/user/PaymentCallback';



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
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        


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

           <Route 
          path="/dashboard/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/products"
          element={
            <ProtectedRoute>
              <DigitalProduct />
            </ProtectedRoute>
          }
        />

         <Route 
          path="/dashboard/webdesign"
          element={
            <ProtectedRoute>
              <Webdesign />
            </ProtectedRoute>
          }
        />
          <Route
          path="/dashboard/accountlogs"
          element={
            <ProtectedRoute>
              <Accountlogs />
            </ProtectedRoute>
          }
        />
         <Route 
          path="/dashboard/consignment"
          element={
            <ProtectedRoute>
              <Consignment />
            </ProtectedRoute>
          }
        />  

        <Route
          path="/dashboard/branding"
          element={
            <ProtectedRoute>
              <Branding />
            </ProtectedRoute>
          }
        />


        {/*Admin Protected Routes*/}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Admin_Dashboard />
            </AdminProtectedRoute>
          }
        />
          <Route
          path='/admin/settings'
          element={
            <AdminProtectedRoute>
              <Settings />
            </AdminProtectedRoute>
          }
        />

        <Route 
          path="/admin/usermanagement"
          element={
            <AdminProtectedRoute>
              <Usermanagement />
            </AdminProtectedRoute>
          }
        />
        <Route 
          path="/admin/digitalproducts"
          element={
            <AdminProtectedRoute>
              <AdminDigitalProduct />
            </AdminProtectedRoute>
          }
        />
        <Route 
          path="/admin/allproducts"
          element={
            <AdminProtectedRoute>
              <ManageProducts />
            </AdminProtectedRoute>
          }
        />

        

      </Routes>
    </>
  );
}

export default App;
