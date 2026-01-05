import pool from '../config/db.js';

    //site settings for footer
    export const getSiteSettings = async (req, res) => {
      try {
        // Query to fetch site settings from the database
        const result = await pool.query('SELECT sitename, sitelogo, sitelivechat, email, phone, address, description FROM settings LIMIT 1');
        if (result.rows.length > 0) {
          const { sitename, sitelogo, email, phone, address,sitelivechat, description } = result.rows[0];
          res.json({ status: 'success', sitename, sitelogo, email, phone, address, sitelivechat, description });
        } else {
          res.json({ status: 'error', message: 'Site settings not found' });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    };

    export const updateSiteSettings = async (req, res) => {
  const {
    siteName,
    siteDescription,
    siteEmail,
    sitePhone,
    siteAddress,
    siteliveChat,
  } = req.body;

  // Handle logo file upload
  const sitelogo = req.file ? req.file.path : null;

  try {
    // Check if site settings exist
    const existingSettings = await pool.query('SELECT id FROM settings LIMIT 1');
    
    let query;
    let params;

    if (existingSettings.rows.length > 0) {
      // Update existing settings
      if (sitelogo) {
        query = `
          UPDATE settings
          SET sitename = $1, description = $2, email = $3, 
              phone = $4, address = $5, sitelivechat = $6, sitelogo = $7,
              updated_at = NOW()
          WHERE id = $8
          RETURNING *
        `;
        params = [
          siteName, siteDescription, siteEmail, sitePhone, 
          siteAddress, siteliveChat, sitelogo, 
          existingSettings.rows[0].id
        ];
      } else {
        query = `
          UPDATE settings
          SET sitename = $1, description = $2, email = $3, 
              phone = $4, address = $5, sitelivechat = $6,
              updated_at = NOW()
          WHERE id = $7
          RETURNING *
        `;
        params = [
          siteName, siteDescription, siteEmail, sitePhone, 
          siteAddress, siteliveChat, 
          existingSettings.rows[0].id
        ];
      }
    } else {

      // Insert new settings
      query = `
        INSERT INTO settings
        (sitename, description, email, phone, address, sitelivechat, sitelogo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      params = [siteName, siteDescription, siteEmail, sitePhone, siteAddress, siteliveChat, sitelogo];
    }

    const result = await pool.query(query, params);
    
    res.json({
      status: 'success',
      message: 'Site settings updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ 
      status: 'error', 
      error: 'Failed to update site settings' 
    });
  }
};

// Admin get site settings
export const getAdminSiteSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({
        status: 'success',
        siteName: '',
        siteDescription: '',
        siteEmail: '',
        sitePhone: '',
        siteAddress: '',
        siteliveChat: '',
        sitelogo: '',
      });
    }

    const settings = result.rows[0];
    res.json({
      status: 'success',
      siteName: settings.sitename,
      siteDescription: settings.description,
      siteEmail: settings.email,
      sitePhone: settings.phone,
      siteAddress: settings.address,
      siteliveChat: settings.sitelivechat,
      sitelogo: settings.sitelogo,
    });

  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ 
      status: 'error', 
      error: 'Failed to fetch site settings' 
    });
  }
};
