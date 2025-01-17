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
exports.generateInvoicePDF = void 0;
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateInvoicePDF = (data, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default();
            const writeStream = fs_1.default.createWriteStream(filePath);
            doc.pipe(writeStream);
            // Invoice Header
            doc.fontSize(20).text("Invoice", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Order ID: ${data.orderId}`);
            doc.text(`Date: ${new Date(data.date).toLocaleString()}`);
            doc.text(`Customer Name: ${data.userDetails.firstName} ${data.userDetails.lastName}`);
            doc.text(`Email: ${data.userDetails.email}`);
            doc.text(`Address: ${data.userDetails.address}, ${data.userDetails.city}, ${data.userDetails.postalCode}, ${data.userDetails.country}`);
            doc.moveDown();
            // Order Details Header
            doc.fontSize(14).text("Order Details", { underline: true });
            doc.moveDown();
            // Table Headers
            doc.fontSize(12).text("Item", 50, doc.y, { continued: true });
            doc.text("Subcategory", 200, doc.y, { continued: true });
            doc.text("Attributes", 350, doc.y, { continued: true });
            doc.text("Quantity", 450, doc.y, { continued: true });
            doc.text("Price", 500, doc.y, { continued: true });
            doc.text("Subtotal", 550, doc.y);
            doc.moveDown();
            // Order Items
            data.cartItems.forEach((item, index) => {
                const itemName = item.REF || "Undefined";
                const subcategoryName = item.subcategoryName || "Unknown Subcategory";
                const attributes = item.attributes
                    ? item.attributes.map((attr) => `${attr.key}: ${attr.value}`).join(", ")
                    : "No Attributes";
                const quantity = item.quantity || 0;
                const price = item.price || 0;
                const subtotal = quantity * price;
                doc.text(`${index + 1}. ${itemName}`, 50, doc.y, { continued: true });
                doc.text(subcategoryName, 200, doc.y, { continued: true });
                doc.text(attributes, 350, doc.y, { continued: true });
                doc.text(quantity.toString(), 450, doc.y, { continued: true });
                doc.text(`$${price.toFixed(2)}`, 500, doc.y, { continued: true });
                doc.text(`$${subtotal.toFixed(2)}`, 550, doc.y);
                doc.moveDown();
            });
            // Total Price
            doc.fontSize(14).text(`Total Price: $${data.totalPrice.toFixed(2)}`, {
                align: "right",
            });
            doc.moveDown();
            // Footer
            doc
                .fontSize(10)
                .text("Thank you for your purchase! If you have any questions about this invoice, please contact support@example.com", { align: "center" });
            doc.end();
            writeStream.on("finish", () => {
                resolve();
            });
            writeStream.on("error", (error) => {
                reject(error);
            });
        }
        catch (error) {
            reject(error);
        }
    });
});
exports.generateInvoicePDF = generateInvoicePDF;
