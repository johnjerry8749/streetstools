import pool from '../config/db.js'; 


// Get user profile data
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    
    const result = await pool.query(
      'SELECT id, fullname, email, phonenumber, country FROM users WHERE id = $1',
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


// Update user profile data
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { firstName, lastName, email, country, phoneNumber } = req.body;
   
    //combine first and last name
    const fullname = `${firstName} ${lastName}`.trim();
    

    // Update user data in the database
    const result = await pool.query(
      'UPDATE users SET fullname = $1, email = $2, country = $3, phonenumber = $4 WHERE id = $5 RETURNING id, fullname, email, phonenumber, country',
      [fullname, email, country, phoneNumber, userId]
    );

    if (result.rows.length > 0) {
      res.json({ status: 'success', message: 'Profile updated successfully', user: result.rows[0] });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};



//user update password 
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    // Fetch current password hash from database
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    const storedHash = userResult.rows[0].password;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' });
    }
    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password in database
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [newHashedPassword, userId]
    );
    res.json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  } 
};