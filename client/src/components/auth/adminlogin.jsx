import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Adminlogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [sitelogo, setSiteLogo] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSiteLogo(data.sitelogo);
        }
      })
      .catch((error) => console.error('Error fetching site logo:', error));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const response = await fetch(`${apiUrl}/auth/adminlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setStatus('success');
        setTimeout(() => {

          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setStatus('error');
        setErrors({ submit: data.error || 'Login failed' });
      }
    } catch {
      setStatus('error');
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div>
      <section className="py-3 py-md-5 min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="text-center mb-4">
                {sitelogo && (
                  <img
                    src={sitelogo}
                    alt="Admin Logo"
                    height="40"
                    width="40"
                    style={{ borderRadius: '50%' }}
                    className="me-2"
                  />
                )}
                <h1 className="fw-bold h3 mb-3">Admin Management</h1>
              </div>
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit} autoComplete="on" aria-label="Admin Login Form">
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
                        autoComplete="username"
                        aria-required="true"
                      />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label htmlFor="password" className="form-label mb-0">Password</label>
                        <Link to="/forgetpassword" className="small text-decoration-none">Forgot?</Link>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          className="form-control form-control-lg"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          aria-required="true"
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#888',
                            fontSize: 18,
                            padding: 0,
                          }}
                          tabIndex={-1}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
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
                    {status === 'success' && (
                      <div className="alert alert-success mb-0" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Login successful! Redirecting...
                      </div>
                    )}
                    {status === 'error' && errors.submit && (
                      <div className="alert alert-danger mb-0" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {errors.submit}
                      </div>
                    )}
                  </form>
                  <hr className="my-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Adminlogin;
