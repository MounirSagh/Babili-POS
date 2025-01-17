"use strict";
// import { Request, Response } from 'express';
// import SubCategory from '../models/subcategory.model';
// import Cart from '../models/cart.model';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = exports.deleteFromCart = exports.getCart = exports.createCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Create a new cart item
// export const createCart = async (req: Request, res: Response): Promise<Response> => {
//     try {
//       const { productId, quantity } = req.body;
//       // Validate required fields
//       if (!productId || typeof quantity !== "number" || quantity < 1) {
//         return res.status(400).json({ message: "Invalid input. productId and quantity are required, and quantity must be at least 1." });
//       }
//       const newCartItem = new Cart({ productId, quantity });
//       await newCartItem.save();
//       return res.status(201).json(newCartItem);
//     } catch (error) {
//       console.error("Error creating cart item:", error);
//       return res.status(500).json({ message: "Error creating cart item", error });
//     }
//   };
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, attributes, quantity } = req.body;
        // Validate required fields
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }
        // Check if the product exists
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        // Create cart item
        const cart = new cart_model_1.default({
            productId,
            attributes: attributes || product.attributes, // Use default attributes if not provided
            quantity: quantity || 1, // Default quantity to 1
        });
        yield cart.save();
        res.status(201).json(cart);
    }
    catch (error) {
        console.error("Error creating cart:", error);
        res.status(400).json({ message: "Error creating cart", error });
    }
});
exports.createCart = createCart;
// export const createCart = async (req: Request, res: Response) => {
//     try {
//         const cart = new Cart({ ...req.body, quantity: 1 });
//         await cart.save();
//         await cart.save();
//         res.status(201).json(cart);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating cart', error });
//     }
// };
// Get all cart items
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItems = yield cart_model_1.default.find()
            .populate({
            path: "productId",
            select: "REF attributes price subcategoryID", // Include the necessary fields
            populate: { path: "subcategoryID", select: "name" }, // Populate subcategory name
        });
        return res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ message: "Error fetching cart items", error });
    }
});
exports.getCart = getCart;
// Delete a cart item by ID
const deleteFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedItem = yield cart_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found in the cart" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: "Error deleting item from cart", error });
    }
});
exports.deleteFromCart = deleteFromCart;
// Update a cart item by ID
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }
        const updatedCart = yield cart_model_1.default.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ message: "Item not found in the cart" });
        }
        res.status(200).json(updatedCart);
    }
    catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Error updating cart item", error });
    }
});
exports.updateCart = updateCart;
// Clear the cart for the user
