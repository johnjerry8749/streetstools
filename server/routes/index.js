import express from 'express';
const router = express.Router();
import { verifyToken } from '../mildleware/authentication.js'; // Changed 'middleware' to 'mildleware'
import {getSiteSettings} from '../controller/index.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
//sendVerificationEmail,
  uploadProfileImage,
  removeProfileImage
} from '../controller/userController.js';
import { getUserNotifications, markNotificationRead, sendNotificationToUser, sendNotificationToAll } from '../controller/notificationcontroller.js';
import { upload } from '../services/cloudinary.js';


// Route to get site settings for footer
router.get('/site-settings', getSiteSettings);

// Route to get user profile data
router.get('/user/profile', verifyToken, getUserProfile);


// Route to update user profile data
router.put('/user/profile', verifyToken, updateUserProfile);

// Route to change password
router.put('/user/change-password', verifyToken, changePassword);

// Route to upload profile image (uses multer middleware from cloudinary service)
router.post('/user/profile/upload-image', verifyToken, upload.single('profileImage'), uploadProfileImage);

// Route to remove profile image
router.delete('/user/profile/remove-image', verifyToken, removeProfileImage);

// User notification routes
router.get('/user/notifications', verifyToken, getUserNotifications);
router.post('/user/notifications/read', verifyToken, markNotificationRead);

// Admin notification routes
router.post('/admin/notifications/send-to-user', verifyToken, sendNotificationToUser);
router.post('/admin/notifications/send-to-all', verifyToken, sendNotificationToAll);



export default router;