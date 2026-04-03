 import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Dynamic folder based on file type
    let folder = 'streetstools/profile_images'; // default
    let resourceType = 'image'; // default
    
    if (file.fieldname === 'productImage') {
      folder = 'streetstools/products/images';
      resourceType = 'image';
    } else if (file.fieldname === 'productFile') {
      folder = 'streetstools/products/files';
      resourceType = 'auto'; // For PDFs and other files
    }

    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: file.fieldname === 'productFile' ? ['pdf'] : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      public_id: `${file.fieldname}_${Date.now()}`,
      transformation: file.fieldname === 'productImage' ? [{ 
        width: 500, 
        height: 500, 
        crop: 'limit',
        quality: 'auto'
      }] : undefined
    };
  }
});

// Configure multer with Cloudinary storage
export const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (increased for PDF files)
  fileFilter: (req, file, cb) => {
    // Check field name to determine allowed file types
    if (file.fieldname === 'productImage') {
      // For product images: only allow image files
      const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedImageTypes.test(file.originalname.toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Product image must be JPEG, PNG, GIF, or WebP format!'));
      }
    } else if (file.fieldname === 'digitalFile') {
      // For digital files: only allow PDF files
      const isPDF = file.mimetype === 'application/pdf' || 
                    file.originalname.toLowerCase().endsWith('.pdf');

      if (isPDF) {
        cb(null, true);
      } else {
        cb(new Error('Digital product file must be a PDF!'));
      }
    } else {
      // For profile images and other uploads: only allow images
      const allowedImageTypes = /jpeg|jpg|png|gif|pdf|webp/;
      const extname = allowedImageTypes.test(file.originalname.toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
      }
    }
  }
});

// Export cloudinary instance for direct use
export default cloudinary;