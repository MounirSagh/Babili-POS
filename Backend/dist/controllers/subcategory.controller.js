"use strict";
// import { Request, Response } from 'express';
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
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategorybycategory = exports.getSubCategoryById = exports.getSubCategories = exports.createSubCategory = void 0;
const subcategory_model_1 = __importDefault(require("../models/subcategory.model"));
// cloudinary configuration
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';
// Configure storage for uploads folder
// const uploadsStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads', // Cloudinary folder name
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//   },
// });
// Configure storage for tables folder
// const tablesStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'tables', // Cloudinary folder name
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//   },
// });
// Create a new subcategory
const createSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categoryID, image } = req.body;
    try {
        const newSubCategory = new subcategory_model_1.default({ name, categoryID, image });
        yield newSubCategory.save();
        res.status(201).json(newSubCategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating subcategory', error });
    }
});
exports.createSubCategory = createSubCategory;
// Get all subcategories
const getSubCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategories = yield subcategory_model_1.default.find();
        res.status(200).json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories', error });
    }
});
exports.getSubCategories = getSubCategories;
// Get a subcategory by ID
const getSubCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategory = yield subcategory_model_1.default.findById(req.params.id);
        if (!subcategory) {
            res.status(404).json({ message: 'Subcategory not found' });
        }
        else {
            res.status(200).json(subcategory);
        }
    }
    catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ message: 'Invalid subcategory ID format', error });
        }
        else {
            res.status(500).json({ message: 'Error fetching subcategory', error });
        }
    }
});
exports.getSubCategoryById = getSubCategoryById;
// Get subcategories by category ID
const getSubCategorybycategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subcategories = yield subcategory_model_1.default.find({ categoryID: id });
        res.status(200).json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories', error });
    }
});
exports.getSubCategorybycategory = getSubCategorybycategory;
// Update a subcategory
const updateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, categoryID, image } = req.body;
        const subcategory = yield subcategory_model_1.default.findByIdAndUpdate(req.params.id, { name, categoryID, image }, { new: true });
        if (!subcategory) {
            res.status(404).json({ message: 'Subcategory not found' });
        }
        else {
            res.status(200).json(subcategory);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating subcategory', error });
    }
});
exports.updateSubCategory = updateSubCategory;
// Delete a subcategory
const deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategory = yield subcategory_model_1.default.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            res.status(404).json({ message: 'Subcategory not found' });
        }
        else {
            res.status(200).json({ message: 'Subcategory deleted' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting subcategory', error });
    }
});
exports.deleteSubCategory = deleteSubCategory;
