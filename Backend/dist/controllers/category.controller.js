"use strict";
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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = new category_model_1.default(req.body);
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating category', error });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hhh");
        const categories = yield category_model_1.default.find();
        console.log(categories);
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        }
        else {
            res.status(200).json(category);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        }
        else {
            res.status(200).json(category);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        }
        else {
            res.status(200).json({ message: 'Category deleted' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
});
exports.deleteCategory = deleteCategory;
