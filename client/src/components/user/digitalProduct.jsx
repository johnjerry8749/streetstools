import Navbar from './layout/navbar';
import Footer from './layout/footer';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DigitalProduct = () => {

const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(new Set());
const location = useLocation();

useEffect(() => {
  // Show payment status messages
  if (location.state?.paymentSuccess) {
    alert(' ' + location.state.message);
  } else if (location.state?.paymentFailed) {
    alert(' ' + location.state.message);
  }
}, [location.state]);

useEffect(() => {
  const apiUrl = import.meta.env.VITE_API_URL ?? '';
  fetch(`${apiUrl}/user/userproducts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setProducts(data.products);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    })
    .catch(error => console.error('Error fetching products:', error));
}, []);


//Handle Paystack Payment
const handlePayment = async (product) => {
  if (loadingProducts.has(product.id)) return;
  setLoadingProducts(prev => new Set(prev).add(product.id));

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    
    // Try multiple ways to get email
    const email = user?.email || user?.user?.email;

    console.log('Full localStorage user:', userStr);
    console.log('Parsed user object:', user);
    console.log('Email extracted:', email);
    console.log('Token:', token);
    console.log('Amount:', product.price);

    if (!token) {
      alert("You must be logged in to make a payment.");
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      alert("Invalid email address. Please log in again. Current: " + email);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL ?? '';
  try {
    const response = await fetch(`${apiUrl}/payment/initialization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        email: email,
        amount: product.price
      })
    });

    if (!response.ok) {
      let errorMessage = "Something went wrong";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // response not JSON
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate Paystack response
    if (!data.authorization_url) {
      throw new Error("Invalid payment response from server");
    }

    //  Redirect safely
    window.location.href = data.authorization_url;

  } catch (error) {
    console.error("Payment Error:", error);

    //  User-friendly message
    alert(error.message || "Payment initialization failed. Try again.");
  } finally {
    setLoadingProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });
  }
};



  return (
    <div className="dashboard-container">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h4> Welcome to Product Page</h4>
          <div>

      {/* Display products */}
      <div className="row">
        {products.map(product => (
          <div
            key={product.id}
            className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card h-100 shadow-sm">
              <img
                src={product.product_image_path}
                className="card-img-top"
                alt={product.product_name}
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.product_name}</h5>

                <p className="card-text text-muted small">
                  {product.description}
                </p>

                <p className="mb-1">
                  <strong>Category:</strong> {product.category}
                </p>

                <h6 className="text-success">₦{product.price}</h6>

                <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handlePayment(product)}
                    disabled={loadingProducts.has(product.id)}
                  >
                    {loadingProducts.has(product.id) ? "Processing..." : "Buy"}
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default DigitalProduct
