import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinaryConfig';

// For subcategory images (formerly in the `uploads` folder)
export const subcategoryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      public_id: (req: Express.Request, file: Express.Multer.File) => `uploads/${file.originalname}`, // Cloudinary folder for subcategory images
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Allowed file types
    } as any, // Type assertion to bypass the type error
  });
  

// For table images (formerly in the `tables` folder)
export const tableStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      public_id: (req: Express.Request, file: Express.Multer.File) => `tables/${file.originalname}`, // Cloudinary folder for subcategory images
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Allowed file types
    } as any, // Type assertion to bypass the type error
  });

// Export multer instances
export const uploadSubcategoryImage = multer({ storage: subcategoryStorage });
export const uploadTableImage = multer({ storage: tableStorage });
