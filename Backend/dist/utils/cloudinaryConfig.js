"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cloudinaryConfig.ts
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // From your Cloudinary dashboard
    api_key: process.env.CLOUDINARY_API_KEY, // From your Cloudinary dashboard
    api_secret: process.env.CLOUDINARY_API_SECRET, // From your Cloudinary dashboard
});
exports.default = cloudinary_1.v2;
