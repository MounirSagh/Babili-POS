


import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";


// Create a new cart item

export const createCart = async (req: Request, res: Response) => {
  try {
    const { productId, attributes, quantity } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Create cart item
    const cart = new Cart({
      productId,
      attributes: attributes || product.attributes, // Use default attributes if not provided
      quantity: quantity || 1, // Default quantity to 1
    });
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(400).json({ message: "Error creating cart", error });
  }
};


// Get all cart items
export const getCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const cartItems = await Cart.find()
      .populate({
        path: "productId",
        select: "REF attributes price subcategoryID", // Include the necessary fields
        populate: { path: "subcategoryID", select: "name" }, // Populate subcategory name
      });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: "Error fetching cart items", error });
  }
};



// Delete a cart item by ID
export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ message: "Error deleting item from cart", error });
  }
};


// Update a cart item by ID
export const updateCart = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};


// Clear the cart for the user
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    await Cart.deleteMany({ userId }); // Clear items for the specific user
    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart.", error });
  }
};
