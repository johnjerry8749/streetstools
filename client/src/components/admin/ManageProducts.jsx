import React, { useEffect, useState } from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import { Link } from 'react-router-dom';

// Sample product data from database



const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/getallproducts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)
    .filter((p) => filterCategory === 'all' || p.category === filterCategory);

  const handleEdit = (id) => {
    console.log('Edit product:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete product:', id);
  };

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
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                      <h4 className="card-title mb-0">Manage Products</h4>
                      <p className="text-muted mb-0">{filtered.length} products</p>
                    </div>
                    <div className="col-12 col-md-6 mt-2 mt-md-0">
                      <div className="d-flex gap-2 flex-wrap justify-content-md-end align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ maxWidth: '220px' }}
                        />
                        <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: '140px' }}>
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="sold">Sold</option>
                        </select>
                        <select className="form-select form-select-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ maxWidth: '140px' }}>
                          <option value="all">All Categories</option>
                          {[...new Set(products.map((p) => p.category))].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <Link to="/admin/digitalproducts" className="btn btn-primary btn-sm">
                          Add Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0" style={{ overflow: 'visible' }}>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product Name</th>
                          <th className="text-center d-none d-md-table-cell">Category</th>
                          <th className="text-center d-none d-lg-table-cell">Description</th>
                          <th className="text-center d-none d-md-table-cell">Status</th>
                          <th className="text-center d-none d-lg-table-cell">Price</th>
                          <th className="text-center d-none d-md-table-cell">Created</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="fw-semibold">{p.name}</div>
                              <div className="d-md-none small text-muted">{p.category} • ${p.price}</div>
                            </td>
                            <td className="text-center d-none d-md-table-cell">{p.category}</td>
                            <td className="text-center d-none d-lg-table-cell text-truncate" style={{ maxWidth: 360 }}>{p.description}</td>
                            <td className="text-center d-none d-md-table-cell">
                              {p.status === 'active' ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">{p.status}</span>}
                            </td>
                            <td className="text-center d-none d-lg-table-cell">${p.price}</td>
                            <td className="text-center d-none d-md-table-cell">{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p.id)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageProducts;
