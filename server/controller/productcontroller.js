import pool from '../config/db.js';
import cloudinary from '../services/cloudinary.js';



// Insert new product
export const insertProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        // Fix: Match the actual field names from request body
        const {product_name, category, price, status, quantity, description} = req.body;
        
        // Files are already uploaded to Cloudinary by multer
        const productImage = req.files['productImage'] ? req.files['productImage'][0] : null;
        const productFile = req.files['productFile'] ? req.files['productFile'][0] : null; // Fixed field name
        
        // Get URLs from already uploaded files
        let imageUrl = null;
        let fileUrl = null;
        
        if (productImage) {
            imageUrl = productImage.path;
        }
        
        if (productFile) {
            fileUrl = productFile.path;
        }

        console.log('Image URL:', imageUrl);
        console.log('File URL:', fileUrl);

        // Insert product into database with correct field mapping
        const insertResult = await pool.query(
            `INSERT INTO digital_products
            (product_name, category, price, status, quantity, description, product_image_path, digital_file_path, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
            [product_name, category, price, status, quantity, description, imageUrl, fileUrl]
        );

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            product: insertResult.rows[0]
        });

    } catch (error) {
        console.error('Error inserting product:', error);
        res.status(500).json({
            status: 'error', 
            message: 'Internal server error',
            details: error.message
        });
    }
};


// Delete product 
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Enhanced validation
        if (!productId) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Product ID is required' 
            });
        }

        // Check if product exists before deleting
        const checkResult = await pool.query('SELECT id FROM digital_products WHERE id = $1', [productId]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Product not found' 
            });
        }

        // delete associated files from Cloudinary if needed
            const productToDelete = checkResult.rows[0];
            if (productToDelete.product_image_path) {
                await cloudinary.uploader.destroy(productToDelete.product_image_path);
            }
            if (productToDelete.digital_file_path) {
                await cloudinary.uploader.destroy(productToDelete.digital_file_path);
            }else{
                console.log('No associated files to delete from Cloudinary');
            }


        // Delete product from database
        const deleteResult = await pool.query('DELETE FROM digital_products WHERE id = $1 RETURNING *', [productId]);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Product deleted successfully',
            deletedProduct: deleteResult.rows[0]
        });

             } catch (error) {
        console.error('Error deleting product:', error);
        
        // Handle specific database errors
        if (error.code === '22P02') { // Invalid input syntax for integer
            return res.status(400).json({ 
                status: 'error', 
                message: 'Invalid product ID format' 
            });
        }
        
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error', 
            details: error.message 
        });
    }
}


//get all products
export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM digital_products ORDER BY created_at DESC');
        res.status(200).json({ 
            status: 'success', 
            products: result.rows 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error', 
            details: error.message 
        });
    }
};


//update product details
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {product_name, category, price, status, quantity, description} = req.body;
        const updateResult = await pool.query(
            `UPDATE digital_products 
            SET product_name = $1, category = $2, price = $3, status = $4, quantity = $5, description = $6, updated_at = NOW() 
            WHERE id = $7 RETURNING *`,
            [product_name, category, price, status, quantity, description, productId]
        );
        if (updateResult.rows.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Product not found' 
            });
        }
        res.status(200).json({ 
            status: 'success', 
            updatedProduct: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error', 
            details: error.message 
        });
    }
};