import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ status: 'error', error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE role = $1 AND email = $2', ['admin', email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ status: 'error', error: 'Invalid email or password' });
    }
    
    const admin = result.rows[0];
    
    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {  
      return res.status(401).json({ status: 'error', error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key', 
      { 
        expiresIn: '24h' 
      }
    );
    
    res.json({ 
      status: 'success', 
      token, 
      user: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role 
      } 
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};