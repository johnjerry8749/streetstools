import Navbar from "./Layout/Navbar"
import Footer from "./Layout/footer"
import { useState } from "react";
import axios from "axios";


const Digitalproducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form data state
    const [formData, setFormData] = useState({
        product_name: '',
        category: '',
        price: '',
        status: 'active',
        quantity: '1',
        description: '',
        productImage: null,
        productFile: null
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('Starting form submission with data:', formData);

            // Client-side validation
            const validationErrors = [];
            
            if (!formData.product_name?.trim()) validationErrors.push('Product name is required');
            if (!formData.category) validationErrors.push('Category is required');
            if (!formData.description?.trim()) validationErrors.push('Description is required');
            
            const price = parseFloat(formData.price);
            if (!formData.price || isNaN(price) || price <= 0) {
                validationErrors.push('Valid price greater than 0 is required');
            }
            
            const quantity = parseInt(formData.quantity);
            if (!formData.quantity || isNaN(quantity) || quantity < 1) {
                validationErrors.push('Quantity must be at least 1');
            }
            
            if (!formData.productImage) {
                validationErrors.push('Product image is required');
            } else {
                // Validate image file type
                const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedImageTypes.includes(formData.productImage.type)) {
                    validationErrors.push('Invalid image format. Please upload JPEG, PNG, GIF, or WebP files only.');
                }
                
                // Validate image file size (10MB)
                if (formData.productImage.size > 10 * 1024 * 1024) {
                    validationErrors.push('Image file too large. Maximum size is 10MB.');
                }
            }
            
            // Validate PDF file if present
            if (formData.productFile) {
                if (formData.productFile.type !== 'application/pdf') {
                    validationErrors.push('Digital product file must be a PDF');
                }
                
                // Validate PDF file size (50MB)
                if (formData.productFile.size > 50 * 1024 * 1024) {
                    validationErrors.push('PDF file too large. Maximum size is 50MB.');
                }
            }
            
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join(', '));
            }

            // Create FormData for file upload
            const form = new FormData();
            form.append('product_name', formData.product_name.trim());
            form.append('category', formData.category);
            form.append('price', price.toString());
            form.append('status', formData.status);
            form.append('quantity', quantity.toString());
            form.append('description', formData.description.trim());
            
            if (formData.productImage) {
                form.append('productImage', formData.productImage);
            }
            if (formData.productFile) {
             form.append('productFile', formData.productFile); // ✅ Now matches server expectation
                }

            console.log('Sending request to server...');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${apiUrl}/admin/products`, form, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000, // 30 second timeout
            }); 
            

            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            
            if (response.data && response.data.status === 'success') {
                setSuccess(response.data.message || 'Product added successfully!');
                console.log('Product created successfully:', response.data.product);
                
                // Reset form
                setFormData({
                    product_name: '',
                    category: '',
                    price: '',
                    status: 'active',
                    quantity: '1',
                    description: '',
                    productImage: null,
                    productFile: null
                });
                
                // Reset file inputs
                const imageInput = document.getElementById('productImage');
                const fileInput = document.getElementById('productFile');
                if (imageInput) imageInput.value = '';
                if (fileInput) fileInput.value = '';
                
            } else {
                throw new Error('Unexpected response format from server');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    const { status, data } = error.response;
                    console.log('Server error response:', data);
                    
                    if (data && data.message) {
                        errorMessage = data.message;
                    } else if (data && data.errors && Array.isArray(data.errors)) {
                        errorMessage = data.errors.join(', ');
                    } else if (status === 401) {
                        errorMessage = 'Authentication failed. Please log in again.';
                        // Optionally redirect to login
                    } else if (status === 413) {
                        errorMessage = 'File too large. Please upload smaller files.';
                    } else if (status === 500) {
                        errorMessage = 'Server error. Please try again later.';
                    } else if (status >= 400) {
                        errorMessage = `Server error (${status}). Please try again.`;
                    }
                } else if (error.request) {
                    // Network error
                    console.log('Network error:', error.request);
                    errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else {
                    // Other axios error
                    errorMessage = error.message || 'Request failed. Please try again.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="mt-5">
        <Navbar />
        <div className="container-fluid px-2 px-md-4 ms-0 ms-lg-5 me-0 me-lg-3">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8">
                    <div className="card shadow-sm border-0 mx-1 mx-md-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h2 className="mb-0 text-center text-md-start fs-4 fs-md-3">Add Digital Product</h2>
                        </div>
                        <div className="card-body p-3 p-md-4">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12 col-md-8">
                                        <label htmlFor="productName" className="form-label fw-semibold">Product Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="productName"
                                            name="product_name"
                                            value={formData.product_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter product name" 
                                            required 
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="productCategory" className="form-label fw-semibold">Category</label>
                                        <select 
                                            className="form-select" 
                                            id="productCategory"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="vpn">VPN-Logs</option>
                                            <option value="NetFlix">NetFlix-Logs</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="ebook">E-book</option>
                                            <option value="tiktok">Tiktok</option>
                                            <option value="Facebook">Facebook</option> 
                                            <option value="Instagram">Instagram</option>
                                            <option value="graphics">Graphics</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3 mt-2">
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label htmlFor="productPrice" className="form-label fw-semibold">Price</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="productPrice"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00" 
                                            step="0.01" 
                                            min="0" 
                                            required 
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label htmlFor="productStatus" className="form-label fw-semibold">Status</label>
                                        <select 
                                            className="form-select" 
                                            id="productStatus"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="productQuantity" className="form-label fw-semibold">Quantity</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="productQuantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Enter quantity" 
                                            min="1" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="productDescription" className="form-label fw-semibold">Product Description</label>
                                    <textarea 
                                        className="form-control" 
                                        id="productDescription"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4" 
                                        placeholder="Enter product description..." 
                                        required
                                    ></textarea>
                                </div>

                                <div className="row g-3 mt-2">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="productImage" className="form-label fw-semibold">Product Image</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="productImage"
                                            name="productImage"
                                            onChange={handleFileChange}
                                            accept="image/*" 
                                            required 
                                        />
                                        <div className="form-text small">Upload product image (JPG, PNG, GIF)</div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="productFile" className="form-label fw-semibold">Digital Product File (PDF)</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="productFile"
                                            name="productFile"
                                            onChange={handleFileChange}
                                            accept=".pdf,application/pdf"
                                        />
                                        <div className="form-text small">Upload the PDF file that customers will download after purchase</div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-12">
                                        <div className="d-flex flex-column flex-sm-row justify-content-sm-end gap-2 gap-sm-3">
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary px-4 py-2 order-2 order-sm-1"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary px-4 py-2 order-1 order-sm-2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Adding...
                                                    </>
                                                ) : 'Add Product'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Digitalproducts
