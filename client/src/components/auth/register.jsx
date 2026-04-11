import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import WhatsAppChat from '../chatbots/Chatwidget';

function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    country: 'Nigeria',
    password: '', 
    confirmPassword: '',
    agreeTerms: false 
  });
  const [status, setStatus] = useState('');
  const [sitelogo, setSiteLogo] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 // ...existing code...

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setStatus('submitting');
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        password: form.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setStatus('error');
      setErrors({ submit: data.error || 'Registration failed' });
    }
  } catch (err) {
    console.error(err);
    setStatus('error');
    setErrors({ submit: 'Network error. Please try again.' });
  }
};

  return (
    <div>
      <section className="py-4 py-md-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              
              {/* Header with Logo */}
              <div className="text-center mb-4">
                <img 
                  src={sitelogo}
                  height="50"
                  width="50"
                  style={{borderRadius: '50%'}}
                  className="mb-3"
                  alt="Site Logo"
                />
                <h1 className="fw-bold h2 mb-2">Create Your Account</h1>
                <p className="text-muted">Join us to buy social media accounts, order videos, and more</p>
              </div>

              {/* Registration Card */}
              <div className="card shadow border-0">
                <div className="card-body p-4 p-md-5">
                  <div className="row">
                    {/* Left Column - Form */}
                    <div className="col-12 col-md-7">
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-12">
                            <label htmlFor="name" className="form-label">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={form.name}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                              placeholder="John Doe"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                          </div>

                          <div className="col-12">
                            <label htmlFor="email" className="form-label">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              placeholder="you@example.com"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>

                          <div className="col-12 col-sm-6">
                            <label htmlFor="phone" className="form-label">Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              value={form.phone}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              placeholder="+234 800 000 0000"
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          </div>

                          <div className="col-12 col-sm-6">
                            <label htmlFor="country" className="form-label">Country *</label>
                            <select
                              name="country"
                              id="country"
                              value={form.country}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                            >
                              <option value="Nigeria">Nigeria</option>
                              <option value="Ghana">Ghana</option>
                            </select>
                            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                          </div>

                          <div className="col-12 col-sm-6">
                            <label htmlFor="password" className="form-label">Password *</label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              value={form.password}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              placeholder="Min. 6 characters"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>

                          <div className="col-12 col-sm-6">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              required
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              placeholder="Re-enter password"
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                          </div>

                          {/* <div className="col-12">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                name="agreeTerms"
                                id="agreeTerms"
                                checked={form.agreeTerms}
                                onChange={handleChange}
                                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                              />
                              {/* <label htmlFor="agreeTerms" className="form-check-label small">
                                I agree to the <a href="/terms" className="text-decoration-none">Terms of Service</a> and <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                              </label> */}
                              {/* {errors.agreeTerms && <div className="invalid-feedback d-block">{errors.agreeTerms}</div>}
                            </div>
                          // </div> */} 

                          <div className="col-12">
                            <button 
                              type="submit" 
                              className="btn btn-primary w-100 py-2"
                              disabled={status === 'submitting'}
                            >
                              {status === 'submitting' ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Creating account...
                                </>
                              ) : 'Create Account'}
                            </button>
                          </div>

                          {/* Success Message */}
                          {status === 'success' && (
                            <div className="col-12">
                              <div className="alert alert-success mb-0" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Registration successful! Redirecting to login...
                              </div>
                            </div>
                          )}

                          {/* Error Message */}
                          {status === 'error' && errors.submit && (
                            <div className="col-12">
                              <div className="alert alert-danger mb-0" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {errors.submit}
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Right Column - Benefits */}
                    <div className="col-12 col-md-5 mt-4 mt-md-0">
                      <div className="ps-md-4 border-start-0 border-md-start h-100 d-flex flex-column justify-content-center">
                        <h5 className="fw-bold mb-3">Why Join Us?</h5>
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">Buy verified social media accounts</span>
                          </li>
                          <li className="mb-3">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">Order professional video editing</span>
                          </li>
                          <li className="mb-3">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">Get custom website development</span>
                          </li>
                          <li className="mb-3">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">Access to graphics design services</span>
                          </li>
                          <li className="mb-3">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">Secure payments & fast delivery</span>
                          </li>
                          <li>
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span className="small">24/7 customer support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="text-muted small mb-0">
                      Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Sign in here</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppChat />
    </div>
  )
}

export default Register
