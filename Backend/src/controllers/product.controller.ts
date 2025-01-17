import { Request, Response } from "express";
import Product from "../models/product.model";
import SubCategory from "../models/subcategory.model";
import Order from "../models/order.model";

// Create a Product
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { subcategoryID, REF, attributes, stock, price, isActive } = req.body;

    if (!subcategoryID || !REF || !attributes || stock === undefined || price === undefined) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const subcategory = await SubCategory.findById(subcategoryID);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const product = new Product({
      subcategoryID,
      REF,
      attributes,
      stock,
      price,
      isActive: isActive !== undefined ? isActive : true,
    });
    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(400).json({ message: "Error creating product", error });
  }
};

// Get all Products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('subcategoryID');
    console.log('Products with populated subcategory:', products[0]); // Debug log
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get Products by Subcategory
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ subcategoryID: id }).populate('subcategoryID');
    console.log('Products by category with populated subcategory:', products[0]); // Debug log
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Update a Product
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a Product
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product", error });
  }
};


// top selling products
export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query;
    const endDate = new Date();
    const startDate = new Date();

    // Handle time range logic here (e.g., 7d, 30d, etc.)
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '12m':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Your aggregation query to fetch the top-selling products
    const products = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "Approved",  // Only consider approved orders
        },
      },
      { $unwind: "$cartItems" },  // Unwind cartItems to process each product
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },  // Unwind the product array
      {
        $group: {
          _id: "$cartItems.productId",  // Group by productId
          totalRevenue: { $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] } },  // Correct revenue calculation
          totalSales: { $sum: "$cartItems.quantity" },  // Sum the quantity for each product
          productName: { $first: "$product.REF" },  // Get the product REF (or name, if available)
          subcategoryName: { $first: "$subcategory.name" },  // Get the subcategory name

        },
      },
      { $sort: { totalRevenue: -1 } },  // Sort by total revenue in descending order
      { $limit: 10 },  // Get top 5 selling products
    ]);
    
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ message: 'Error fetching top-selling products', error });
  }
};