"use strict";
// import express from 'express';
// import { createProduct, getProductsByCategory, getProducts, updateProduct, deleteProduct } from '../controllers/product.controller';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.post('/addproduct', createProduct);         
// router.get('/getproducts', getProducts);           
// router.get('/getproductsbycategory/:id', getProductsByCategory);    
// router.put('/updateproduct/:id', updateProduct);     
// router.delete('/deleteproduct/:id', deleteProduct);  
// export default router;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
// Middleware wrapper for async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Route definitions
router.post("/addproduct", asyncHandler(product_controller_1.createProduct)); // Route to add a product
router.get("/getproducts", asyncHandler(product_controller_1.getProducts)); // Route to get all products
router.get("/getproductsbycategory/:id", asyncHandler(product_controller_1.getProductsByCategory)); // Route to get products by subcategory
router.put("/updateproduct/:id", asyncHandler(product_controller_1.updateProduct)); // Route to update a product
router.delete("/deleteproduct/:id", asyncHandler(product_controller_1.deleteProduct)); // Route to delete a product
exports.default = router;
