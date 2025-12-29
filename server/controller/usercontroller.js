import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../services/cloudinary.js';

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await pool.query(
            'SELECT id, fullname, email, country, phonenumber, profile_image FROM users WHERE id = $1',
            [userId]
        );
        
        if (result.rows.length > 0) {
            res.json({ status: 'success', user: result.rows[0] });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const totalOrdersResult = await pool.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = $1',
            [userId]
        );
        
        const pendingOrdersResult = await pool.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = $1 AND status = $2',
            [userId, 'pending']
        );
        
        const stats = {
            totalOrders: parseInt(totalOrdersResult.rows[0].count),
            pendingOrders: parseInt(pendingOrdersResult.rows[0].count)
        };
        
        res.json({ status: 'success', stats });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, country, phoneNumber } = req.body;
        
        const fullname = `${firstName} ${lastName}`.trim();
        
        const result = await pool.query(
            `UPDATE users 
             SET fullname = $1, email = $2, country = $3, phonenumber = $4, updated_at = NOW()
             WHERE id = $5 
             RETURNING id, fullname, email, country, phonenumber`,
            [fullname, email, country, phoneNumber, userId]
        );
        
        if (result.rows.length > 0) {
            res.json({ 
                status: 'success', 
                message: 'Profile updated successfully',
                user: result.rows[0] 
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Upload profile image to Cloudinary
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Cloudinary URL is in req.file.path
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    // Get old image public_id to delete from Cloudinary
    const oldImageResult = await pool.query(
      'SELECT profile_image, cloudinary_public_id FROM users WHERE id = $1',
      [userId]
    );

    // Delete old image from Cloudinary if it exists
    if (oldImageResult.rows[0]?.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(oldImageResult.rows[0].cloudinary_public_id);
        console.log('Old image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Error deleting old image from Cloudinary:', deleteError);
        // Continue anyway - don't fail the upload
      }
    }

    // Save new image URL and public_id to database
    await pool.query(
      'UPDATE users SET profile_image = $1, cloudinary_public_id = $2, updated_at = NOW() WHERE id = $3',
      [imageUrl, publicId, userId]
    );

    res.json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Remove profile image from Cloudinary
export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current image public_id
    const result = await pool.query(
      'SELECT cloudinary_public_id FROM users WHERE id = $1',
      [userId]
    );

    // Delete image from Cloudinary if it exists
    if (result.rows[0]?.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(result.rows[0].cloudinary_public_id);
        console.log('Image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }

    // Set to default placeholder
    // const defaultImage = 'https://via.placeholder.com/150';
    await pool.query(
      'UPDATE users SET profile_image = $1, cloudinary_public_id = NULL, updated_at = NOW() WHERE id = $2',
      [ userId]
    );

    res.json({
      status: 'success',
      message: 'Profile image removed successfully',
      imageUrl: defaultImage
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Change user password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const userResult = await pool.query(
            'SELECT password FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Send email verification
export const sendVerificationEmail = async (req, res) => {
    try {
        const userId = req.user.id;

        const userResult = await pool.query(
            'SELECT email, fullname FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const { email, fullname } = userResult.rows[0];

        // TODO: Implement email sending logic here
        console.log(`Sending verification email to ${email}`);

        res.json({ status: 'success', message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};