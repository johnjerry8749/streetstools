import e from 'express';
import pool from '../config/db.js';



// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get personal notifications
    const personalNotifications = await pool.query(
      `SELECT id, title, message, type, is_read, created_at, expires_at
       FROM notifications 
       WHERE user_id = $1 
       AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );
    
    // Get global notifications with read status
    const globalNotifications = await pool.query(
      `SELECT n.id, n.title, n.message, n.type, n.created_at, n.expires_at,
              EXISTS(SELECT 1 FROM notification_reads WHERE notification_id = n.id AND user_id = $1) as is_read
       FROM notifications n
       WHERE n.is_global = TRUE 
       AND (n.expires_at IS NULL OR n.expires_at > NOW())
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );
    
    // Combine and sort all notifications
    const allNotifications = [
      ...personalNotifications.rows,
      ...globalNotifications.rows
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Count unread
    const unreadCount = allNotifications.filter(n => !n.is_read).length;
    
    res.json({ 
      status: 'success', 
      notifications: allNotifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.body;
    
    // Check if it's a global notification
    const notification = await pool.query(
      'SELECT is_global FROM notifications WHERE id = $1',
      [notificationId]
    );
    
    if (notification.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Notification not found' });
    }
    
    if (notification.rows[0].is_global) {
      // Mark global notification as read for this user
      await pool.query(
        `INSERT INTO notification_reads (notification_id, user_id) 
         VALUES ($1, $2) 
         ON CONFLICT (notification_id, user_id) DO NOTHING`,
        [notificationId, userId]
      );
    } else {
      // Mark personal notification as read
      await pool.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
        [notificationId, userId]
      );
    }
    
    res.json({ status: 'success', message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};


// Send notification to all users (Admin)
export const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message, type, expiresAt } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ status: 'error', message: 'title and message are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, is_global, expires_at) 
       VALUES (NULL, $1, $2, $3, TRUE, $4) 
       RETURNING id, title, message, type, created_at`,
      [title, message, type || 'info', expiresAt || null]
    );
    
    res.json({ 
      status: 'success', 
      message: 'Notification sent to all users',
      notification: result.rows[0]
    });
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};


//send notification to specific user

// Helper used by non-route code (e.g., payment verification)
export const sendNotificationByEmail = async (email, { title, message, type = 'info' }) => {
  if (!email) {
    throw new Error('Email is required to send notification');
  }
  if (!title || !message) {
    throw new Error('Notification title and message are required');
  }

  // Try to resolve user by email, if exists
  const userResult = await pool.query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1',
    [email]
  );

  const userId = userResult.rows?.[0]?.id || null;

  // Deduplicate notifications for the same user with same text within a short window
  const existingNotification = await pool.query(
    `SELECT id FROM notifications
     WHERE user_id = $1
       AND title = $2
       AND message = $3
       AND created_at >= NOW() - INTERVAL '5 minutes'
     LIMIT 1`,
    [userId, title, message]
  );

  if (existingNotification.rows.length > 0) {
    return { status: 'skipped', message: 'Duplicate notification ignored' };
  }

  await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, is_global, is_read, created_at)
     VALUES ($1, $2, $3, $4, FALSE, FALSE, NOW())`,
    [userId, title, message, type]
  );

  return { status: 'success', message: 'Notification queued' };
};

export const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ status: 'error', message: 'userId, title and message are required' });
    }

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, is_global, is_read, created_at)
       VALUES ($1, $2, $3, $4, FALSE, FALSE, NOW())`,
      [userId, title, message, type || 'info']
    );

    return res.json({ status: 'success', message: 'Notification sent to user' });
  } catch (error) {
    console.error('Error sending notification to user:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
