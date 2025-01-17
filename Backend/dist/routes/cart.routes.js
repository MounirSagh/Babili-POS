"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
// Middleware wrapper to handle async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Add a new cart item
router.post("/addcart", asyncHandler(cart_controller_1.createCart));
// Get all cart items
router.get("/getcart", asyncHandler(cart_controller_1.getCart));
// Delete a cart item by ID
router.delete("/deletefromcart/:id", asyncHandler(cart_controller_1.deleteFromCart));
// Update a cart item by ID
router.put("/updatecart/:id", asyncHandler(cart_controller_1.updateCart));
// Clear the cart
exports.default = router;
