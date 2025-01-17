// cloudinaryConfig.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // From your Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY, // From your Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // From your Cloudinary dashboard
});

export default cloudinary;
