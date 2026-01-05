import pool from "../../config/db.js";

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    // Updated query to match actual database columns
    const result = await pool.query(`
      SELECT 
        id, 
        fullname, 
        email, 
        phonenumber,
        country,
        role, 
        is_verified,
        profile_image,
        created_at,
        updated_at
      FROM users 
      WHERE role != 'superadmin'
      ORDER BY created_at DESC
    `);

    // Map the data to match frontend expectations
    const users = result.rows.map(user => ({
      id: user.id,
      fullName: user.fullname,
      email: user.email,
      username: user.email ? user.email.split('@')[0] : 'N/A', // Generate username from email
      role: user.role,
      status: user.is_verified ? 'active' : 'inactive', // Map is_verified to status
      profileImage: user.profile_image,
      joinedDate: user.created_at,
      lastActive: user.updated_at,
      phoneNumber: user.phonenumber,
      country: user.country,
      actions: ['edit', 'delete'] // Available actions for frontend
    }));

    res.json({
      status: 'success',
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      status: 'error', 
      error: 'Failed to fetch users' 
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status values
    const validStatuses = ['active', 'inactive', 'suspended', 'banned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid status value'
      });
    }

    // Validate user ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid user ID'
      });
    }

    // Prevent admin from changing their own status
    if (parseInt(id) === req.admin.id) {
      return res.status(403).json({
        status: 'error',
        error: 'Cannot change your own status'
      });
    }

    // Check if user exists and is not superadmin
    const userCheck = await pool.query(
      'SELECT id, role FROM users WHERE id = $1 AND role != $2',
      [id, 'superadmin']
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'User not found or cannot be modified'
      });
    }

    // Map status to is_verified field
    const isVerified = status === 'active';

    // Update user status using is_verified field
    const result = await pool.query(
      'UPDATE users SET is_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id, fullname, is_verified',
      [isVerified, id]
    );

    res.json({
      status: 'success',
      message: 'User status updated successfully',
      user: {
        id: result.rows[0].id,
        name: result.rows[0].fullname,
        status: result.rows[0].is_verified ? 'active' : 'inactive'
      }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to update user status'
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid user ID'
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.admin.id) {
      return res.status(403).json({
        status: 'error',
        error: 'Cannot delete your own account'
      });
    }

    // Check if user exists and get their role
    const userCheck = await pool.query(
      'SELECT id, role, fullname FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'User not found'
      });
    }

    const user = userCheck.rows[0];

    // Prevent deletion of superadmin and other admins
    if (user.role === 'superadmin' || user.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        error: 'Cannot delete admin accounts'
      });
    }

    // Delete the user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      status: 'success',
      message: `User ${user.fullname} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to delete user'
    });
  }
};

// Update user profile (by admin)
export const adminupdateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role, phonenumber, country } = req.body;

    // Validate inputs
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid user ID'
      });
    }

    if (!fullname || !email) {
      return res.status(400).json({
        status: 'error',
        error: 'Full name and email are required'
      });
    }

    // Validate role
    const validRoles = ['user', 'moderator', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid role'
      });
    }

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'User not found'
      });
    }

    // Prevent modification of superadmin
    if (userCheck.rows[0].role === 'superadmin') {
      return res.status(403).json({
        status: 'error',
        error: 'Cannot modify superadmin account'
      });
    }

    // Build dynamic query with correct column names
    let query = 'UPDATE users SET fullname = $1, email = $2, updated_at = NOW()';
    let params = [fullname, email];
    let paramIndex = 2;

    if (role) {
      paramIndex++;
      query += `, role = $${paramIndex}`;
      params.push(role);
    }

    if (phonenumber !== undefined) {
      paramIndex++;
      query += `, phonenumber = $${paramIndex}`;
      params.push(phonenumber);
    }

    if (country !== undefined) {
      paramIndex++;
      query += `, country = $${paramIndex}`;
      params.push(country);
    }

    paramIndex++;
    query += ` WHERE id = $${paramIndex} RETURNING id, fullname, email, role, phonenumber, country`;
    params.push(id);

    const result = await pool.query(query, params);

    res.json({
      status: 'success',
      message: 'User updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to update user'
    });
  }
};