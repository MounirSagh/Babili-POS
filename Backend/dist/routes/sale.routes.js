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
const express_1 = __importDefault(require("express"));
const sale_controller_1 = require("../controllers/sale.controller");
const router = express_1.default.Router();
// Route to create a new sale
router.post("/addsale", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, sale_controller_1.createSale)(req, res);
    }
    catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: "Error creating sale", error });
    }
}));
// Route to fetch all sales
router.get("/getsales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, sale_controller_1.getSales)(req, res);
    }
    catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: "Error fetching sales", error });
    }
}));
// Route to download an invoice
router.get("/download/:filePath", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, sale_controller_1.downloadInvoice)(req, res);
    }
    catch (error) {
        console.error("Error downloading invoice:", error);
        res.status(500).json({ message: "Error downloading invoice", error });
    }
}));
exports.default = router;
