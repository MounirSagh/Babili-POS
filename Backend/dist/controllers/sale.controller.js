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
exports.downloadInvoice = exports.getSales = exports.createSale = void 0;
const sale_model_1 = __importDefault(require("../models/sale.model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = new sale_model_1.default(req.body);
        yield sale.save();
        res.status(201).json(sale);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating sale', error });
    }
});
exports.createSale = createSale;
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield sale_model_1.default.find().populate('cartItems.subcategoryID', 'name'); // Populate only the name of subcategory
        console.log('Fetched Sales:', sales); // Log fetched data
        res.status(200).json(sales);
    }
    catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Error fetching sales', error });
    }
});
exports.getSales = getSales;
// Download invoice
const downloadInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filePath } = req.params; // Get the file path from the URL parameter
        if (!filePath) {
            res.status(400).json({ message: "File path is required" });
            return res;
        }
        const absolutePath = path_1.default.resolve(__dirname, "../../invoices", filePath);
        // Check if the file exists
        if (!fs_1.default.existsSync(absolutePath)) {
            return res.status(404).json({ message: "File not found" });
        }
        // Send the file as a download
        res.download(absolutePath, filePath, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
        return res; // Ensure the function always returns a Response object
    }
    catch (error) {
        console.error("Error in downloadInvoice:", error);
        res.status(500).json({ message: "Server error", error });
        return res; // Ensure the function always returns a Response object
    }
});
exports.downloadInvoice = downloadInvoice;
