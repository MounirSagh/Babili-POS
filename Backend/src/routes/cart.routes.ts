import express from "express";
import {createCart,getCart,deleteFromCart,updateCart,clearCart} from "../controllers/cart.controller";

const router = express.Router();

// Middleware wrapper to handle async errors
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Add a new cart item
router.post("/addcart", asyncHandler(createCart));

// Get all cart items
router.get("/getcart", asyncHandler(getCart));

// Delete a cart item by ID
router.delete("/deletefromcart/:id", asyncHandler(deleteFromCart));

// Update a cart item by ID
router.put("/updatecart/:id", asyncHandler(updateCart));

// Clear the cart
router.delete("/clearcart", asyncHandler(clearCart));


export default router;
