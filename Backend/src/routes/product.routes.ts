
import express from "express";
import {
  createProduct,
  getProductsByCategory,
  getProducts,
  updateProduct,
  deleteProduct,
  getTopSellingProducts,
} from "../controllers/product.controller";
const router = express.Router();

// Middleware wrapper for async functions
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route definitions
router.post("/addproduct", asyncHandler(createProduct)); // Route to add a product
router.get("/getproducts", asyncHandler(getProducts)); // Route to get all products
router.get("/getproductsbycategory/:id", asyncHandler(getProductsByCategory)); // Route to get products by subcategory
router.put("/updateproduct/:id", asyncHandler(updateProduct)); // Route to update a product
router.delete("/deleteproduct/:id", asyncHandler(deleteProduct)); // Route to delete a product




// Top Selling Products Endpoint
router.get("/top", getTopSellingProducts);


export default router;
