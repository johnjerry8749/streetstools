import pool from '../config/db.js';

    //site settings for footer
    export const getSiteSettings = async (req, res) => {
      try {
        // Query to fetch site settings from the database
        const result = await pool.query('SELECT sitename, sitelogo, sitelivechat, email, phone, address, description FROM settings LIMIT 1');
        if (result.rows.length > 0) {
          const { sitename, sitelogo, email, phone, address, description } = result.rows[0];
          res.json({ status: 'success', sitename, sitelogo, email, phone, address, description });
        } else {
          res.json({ status: 'error', message: 'Site settings not found' });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    };