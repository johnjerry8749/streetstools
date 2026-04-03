import express from 'express';
const router = express.Router();

// Middleware imports
import { verifyToken } from '../mildleware/authentication.js';
import { adminAuthMiddleware } from '../mildleware/adminauthentication.js';

// Controller imports
import { getSiteSettings, getAdminSiteSettings, updateSiteSettings } from '../controller/index.js';
import { adminLogin } from '../controller/adminlogincontroller.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  uploadProfileImage,
  removeProfileImage,
  userLogin
} from '../controller/userController.js';
import { 
  getUserNotifications, 
  markNotificationRead, 
  sendNotificationToUser, 
  sendNotificationToAll 
} from '../controller/notificationcontroller.js';
import {getAllUsers, deleteUser, updateUserStatus, adminupdateUserProfile } from '../controller/admin/users.js';
import { Payment, verifyPayment } from '../controller/payment.js';
// Service imports
import { upload } from '../services/cloudinary.js';
import { insertProduct, getAllProducts, updateProduct, deleteProduct } from '../controller/productcontroller.js';


//pAYMENT ROUTE
router.post('/payment/initialization', verifyToken, Payment);
router.get('/payment/verify', verifyToken, verifyPayment);

// Route to get site settings for footer
router.get('/site-settings', getSiteSettings);

// Route to get user profile data
router.get('/user/profile', verifyToken, getUserProfile);

// User login route
router.post('/api/auth/login', userLogin);

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
router.get('/user/userproducts',verifyToken, getAllProducts); // Public route to fetch products for user dashboard

// Admin login route
router.post('/api/auth/adminlogin', adminLogin);

// Admin verification route
router.get('/admin/verify', adminAuthMiddleware, (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Admin verified', 
    admin: req.admin 
  });
});

// Admin notification routes
router.post('/admin/notifications/send-to-user', adminAuthMiddleware, sendNotificationToUser);
router.post('/admin/notifications/send-to-all', adminAuthMiddleware, sendNotificationToAll);

// Admin dashboard route
router.get('/admin/dashboard', adminAuthMiddleware, (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Welcome to admin dashboard', 
    admin: req.admin 
  });
});

// Admin site settings routes
router.get('/admin/site-settings', adminAuthMiddleware, getAdminSiteSettings);
router.put('/admin/site-settings', adminAuthMiddleware, upload.single('sitelogo'), updateSiteSettings);

router.get('/admin/users', adminAuthMiddleware, getAllUsers);
router.delete('/admin/users/:id', adminAuthMiddleware, deleteUser);
router.put('/admin/users/:id/status', adminAuthMiddleware, updateUserStatus);
router.put('/admin/users/:id/profile', adminAuthMiddleware, adminupdateUserProfile);

//Admin product routes will be added here later
router.post('/admin/products', adminAuthMiddleware, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'productFile', maxCount: 1 }
]), insertProduct);
router.post('/admin/delete-product/:id', adminAuthMiddleware, deleteProduct);
router.get('/admin/get-products', adminAuthMiddleware, getAllProducts);
router.post('/admin/products/update/:id', adminAuthMiddleware, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'productFile', maxCount: 1 }
]), updateProduct);


export default router;