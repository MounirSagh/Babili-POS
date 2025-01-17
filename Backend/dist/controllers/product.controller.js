"use strict";
// import { Request, Response } from 'express';
// import Category from '../models/category.model';
// import Product from '../models/product.model';
// import SubCategory from '../models/subcategory.model';
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
exports.deleteProduct = exports.updateProduct = exports.getProductsByCategory = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const subcategory_model_1 = __importDefault(require("../models/subcategory.model"));
// Create a Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subcategoryID, REF, attributes, stock, price, isActive } = req.body;
        if (!subcategoryID || !REF || !attributes || stock === undefined || price === undefined) {
            return res.status(400).json({ message: "Missing required product fields" });
        }
        const subcategory = yield subcategory_model_1.default.findById(subcategoryID);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        const product = new product_model_1.default({
            subcategoryID,
            REF,
            attributes,
            stock,
            price,
            isActive: isActive !== undefined ? isActive : true,
        });
        yield product.save();
        return res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error);
        return res.status(400).json({ message: "Error creating product", error });
    }
});
exports.createProduct = createProduct;
// Get all Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find().populate("subcategoryID", "name");
        console.log("Products sent to frontend:", products); // Debug log
        return res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getProducts = getProducts;
// Get Products by Subcategory
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const products = yield product_model_1.default.find({ subcategoryID: id }).populate("subcategoryID", "name");
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this subcategory" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products by subcategory:", error);
        return res.status(500).json({ message: "Error fetching products by subcategory", error });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// Update a Product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Error updating product", error });
    }
});
exports.updateProduct = updateProduct;
// Delete a Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Error deleting product", error });
    }
});
exports.deleteProduct = deleteProduct;
