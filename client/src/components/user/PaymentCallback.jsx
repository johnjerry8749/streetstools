import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying payment...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    if (!reference) {
      setError('No payment reference found. Please contact support if you completed a payment.');
      return;
    }

    // Check if already verified in this session
    const verifiedKey = `payment_verified_${reference}`;
    if (sessionStorage.getItem(verifiedKey)) {
      setMessage('Payment verification already completed. Please check your orders.');
      setTimeout(() => navigate('/dashboard/products'), 3000);
      return;
    }

    // Verify payment with backend
    fetch(`${apiUrl}/payment/verify?reference=${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('Payment reference not found. This may mean the payment was already processed or the reference is invalid.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please contact support.');
          } else {
            throw new Error('Payment verification failed.');
          }
        }
        return response.json();
      })
      .then(data => {
        sessionStorage.setItem(verifiedKey, 'true');
        
        if (data.status === 'success') {
          setMessage('Payment successful! Your product is ready.');
          setTimeout(() => {
            navigate('/dashboard/products', { 
              state: { 
                paymentSuccess: true, 
                message: 'Payment successful! Your product is ready. Reference: ' + reference 
              } 
            });
          }, 2000);
        } else {
          setError('Payment verification failed. Reference: ' + reference);
          setTimeout(() => {
            navigate('/dashboard/products', { 
              state: { 
                paymentFailed: true, 
                message: 'Payment verification failed. Reference: ' + reference 
              } 
            });
          }, 3000);
        }
      })
      .catch(err => {
        sessionStorage.setItem(verifiedKey, 'true');
        setError(err.message + ' Reference: ' + reference);
        setTimeout(() => {
          navigate('/dashboard/products', { 
            state: { 
              paymentFailed: true, 
              message: err.message + ' Reference: ' + reference 
            } 
          });
        }, 3000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h4 className="card-title">Payment Verification</h4>

              {error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <br />
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/dashboard/products')}
                  >
                    Return to Products
                  </button>
                </div>
              ) : (
                <div>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;