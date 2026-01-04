import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in environment variables, using fallback');
}

export const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (!result.rows.length) {
      return res.status(401).json({ status: 'error', error: 'Unauthorized: Admin not found' });
    }

    const admin = result.rows[0];

    if (admin.role !== 'admin') {
      return res.status(403).json({ status: 'error', error: 'Forbidden: Admins only' });
    }

    req.admin = { id: admin.id, role: admin.role }; // Only attach minimal info
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ status: 'error', error: 'Unauthorized: Invalid or expired token' });
  }
};