import React, { useState, useEffect } from 'react'
// import Navbar from '../Layout/Navbar';
// import Footer from '../Layout/footer';
import WhatsAppChat from '../chatbots/Chatwidget';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [sitelogo, setSiteLogo] = useState(''); // State to hold site logo URL
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSiteLogo(data.sitelogo);
        }
      })
      .catch((error) => console.error("Error fetching site logo:", error));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  // ...existing code...

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('submitting');

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setStatus('success');
      setErrors({});
      setTimeout(() => {
        navigate('/dashboard'); // or wherever you want to redirect
      }, 1500);
    } else {
      setStatus('error');
      setErrors({ submit: data.error || 'Login failed' });
    }
  } catch (err) {
    console.error(err);
    setStatus('error');
    setErrors({ submit: 'Network error. Please try again.' });
  }
};

  return (
    <div>
      {/* <Navbar /> */}

      <section className="py-3 py-md-5 min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              {/* Header */}
              <div className="text-center mb-4">
                <img 
                src={sitelogo} //admin Logo from database or public folder
                 height="40"
                 width="40"
                   style={{borderRadius: '50%'}}
                className="me-2"
                />
                <h1 className="fw-bold h3 mb-3">Sign in to your account</h1>
                <p className="text-muted small">Access purchases, order history, and manage your digital products.</p>
              </div>

              {/* Login Card */}
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="form-control form-control-lg"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label htmlFor="password" className="form-label mb-0">Password</label>
                        <Link to="/forgetpassword" className="small text-decoration-none">Forgot?</Link>
                      </div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="form-control form-control-lg"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="d-grid gap-2 mb-3">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
                        {status === 'submitting' ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : 'Sign In'}
                      </button>
                    </div>

                    {/* Success Message */}
                    {status === 'success' && (
                      <div className="alert alert-success mb-0" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Login successful! Redirecting...
                      </div>
                    )}

                    {/* Error Message */}
                    {status === 'error' && errors.submit && (
                      <div className="alert alert-danger mb-0" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {errors.submit}
                      </div>
                    )}
                  </form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="text-muted small mb-2">New here?</p>
                    <Link to="/register" className="btn btn-outline-primary w-100">Create an account</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppChat />
      {/* <Footer /> */}
    </div>
  )
}

export default Login
