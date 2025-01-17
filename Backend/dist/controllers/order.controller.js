"use strict";
//goooooof
// import { Request, Response } from "express";
// import Order from "../models/order.model";
// import Cart from "../models/cart.model";
// import Notification from "../models/notification.model";
// import fs from "fs";
// import path from "path";
// import PDFDocument from "pdfkit";
// import SubCategory from '../models/subcategory.model';
// //import { generateInvoicePDF } from '../utils/generateInvoice';
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
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.getOrders = exports.generateInvoicePDF = exports.placeOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userDetails, cartItems } = req.body;
        // Validate request body
        if (!userDetails || !cartItems || cartItems.length === 0) {
            console.error("Invalid order details:", { userDetails, cartItems });
            return res.status(400).json({ message: "Invalid order details" });
        }
        // Validate cart items
        for (const item of cartItems) {
            if (!item.productId ||
                !item.quantity ||
                item.quantity <= 0 ||
                !item.productId.REF ||
                typeof item.productId.price !== "number" ||
                !((_a = item.productId.subcategoryID) === null || _a === void 0 ? void 0 : _a.name)) {
                console.error("Invalid cart item:", item);
                return res.status(400).json({ message: "Invalid cart item detected", item });
            }
        }
        // Calculate total price
        const totalPrice = cartItems.reduce((total, item) => {
            const price = item.productId.price || 0;
            return total + item.quantity * price;
        }, 0);
        if (totalPrice <= 0) {
            return res.status(400).json({ message: "Total price must be greater than zero" });
        }
        // Save order to the database
        const order = new order_model_1.default({
            userDetails,
            cartItems: cartItems.map((item) => ({
                productId: item.productId._id,
                REF: item.productId.REF,
                price: item.productId.price,
                quantity: item.quantity,
                subcategoryID: { name: item.productId.subcategoryID.name },
                attributes: item.productId.attributes,
            })),
            totalPrice,
            date: new Date(),
        });
        yield order.save();
        console.log("Order saved successfully:", order._id);
        // Generate invoice
        const invoiceFileName = `${userDetails.firstName}_${order._id}.pdf`;
        const invoiceDir = path_1.default.resolve("./invoices");
        const invoiceFullPath = path_1.default.join(invoiceDir, invoiceFileName);
        if (!fs_1.default.existsSync(invoiceDir)) {
            fs_1.default.mkdirSync(invoiceDir, { recursive: true });
        }
        yield (0, exports.generateInvoicePDF)({
            orderId: String(order._id),
            userDetails,
            cartItems: order.cartItems.map((item) => {
                var _a;
                return ({
                    REF: item.REF,
                    price: item.price,
                    quantity: item.quantity,
                    subcategoryName: ((_a = item.subcategoryID) === null || _a === void 0 ? void 0 : _a.name) || "Unknown Subcategory",
                    attributes: item.attributes || [],
                });
            }),
            totalPrice,
            date: new Date(order.date).toISOString(),
        }, invoiceFullPath);
        const invoiceRelativePath = `invoices/${invoiceFileName}`;
        const notification = new notification_model_1.default({
            type: "order",
            title: `New Invoice: ${userDetails.firstName}`,
            message: `Order ID: ${order._id} has been placed.`,
            filePath: invoiceRelativePath,
            date: new Date(),
            read: false,
        });
        yield notification.save();
        const serverBaseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
        const invoicePath = `${serverBaseUrl}/${invoiceRelativePath}`;
        res.status(201).json({
            message: "Order placed successfully",
            order,
            invoicePath,
        });
    }
    catch (error) {
        console.error("Error placing order:", {
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : "No stack available",
        });
        res.status(500).json({
            message: "Error placing order",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.placeOrder = placeOrder;
// Function to generate invoice PDF
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
            doc.fontSize(14).text(`Total Price: $${data.totalPrice.toFixed(2)}`, { align: "right" });
            doc.moveDown();
            // Footer
            doc
                .fontSize(10)
                .text("Thank you for your purchase! If you have any questions about this invoice, please contact support@example.com", { align: "center" });
            doc.end();
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        }
        catch (error) {
            reject(error);
        }
    });
});
exports.generateInvoicePDF = generateInvoicePDF;
// export const placeOrder = async (req: Request, res: Response) => {
//   try {
//     const { userDetails, cartItems } = req.body;
//     if (!userDetails || !cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Invalid order details" });
//     }
//     // Calculate total price
//     const totalPrice = cartItems.reduce(
//       (total: number, item: { quantity: number; Poitrine: string }) =>
//         total + item.quantity * parseFloat(item.Poitrine || "0"),
//       0
//     );
//     // Create and save the order
//     const order = new Order({
//       userDetails,
//       cartItems,
//       totalPrice,
//       date: new Date(),
//     });
//     await order.save();
//     // Clear the user's cart
//     const userId = userDetails.userId; 
//     await Cart.deleteMany({ userId });
//     // Ensure the invoices directory exists
//     const invoiceDir = path.resolve(__dirname, "../../invoices");
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }
//     // Generate Invoice PDF
//     const invoiceFileName = `${userDetails.firstName}_${order._id}.pdf`;
//     const invoicePath = path.join(invoiceDir, invoiceFileName);
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     // Header
//     doc.pipe(fs.createWriteStream(invoicePath));
//     doc
//       .fontSize(20)
//       .font("Helvetica-Bold")
//       .text("Invoice", { align: "center" })
//       .moveDown();
//     // Order Details
//     doc
//       .fontSize(12)
//       .font("Helvetica")
//       .text(`Order ID: ${order._id}`)
//       .text(`Date: ${new Date(order.date).toLocaleString()}`)
//       .text(`Customer Name: ${userDetails.firstName} ${userDetails.lastName}`)
//       .text(`Email: ${userDetails.email}`)
//       .text(
//         `Address: ${userDetails.address}, ${userDetails.city}, ${userDetails.country}`
//       )
//       .moveDown();
//     // Table Header
//     doc
//       .fontSize(14)
//       .font("Helvetica-Bold")
//       .text("Order Details", { underline: true })
//       .moveDown();
//     doc
//       .fontSize(12)
//       .font("Helvetica-Bold")
//       .text(
//         `Item`.padEnd(20) +
//         `Quantity`.padEnd(20) +
//         `Price`.padEnd(20) +
//         `Subtotal`.padEnd(20),
//         { continued: false }
//       )
//       .moveDown();
//     // Table Rows
//     cartItems.forEach(
//       (item: { REF: string; quantity: number; Poitrine: string }, index: number) => {
//         const itemTotal = parseFloat(item.Poitrine) * item.quantity;
//         doc
//           .font("Helvetica")
//           .text(
//             `${index + 1}. ${item.REF}`.padEnd(20) +
//             `${item.quantity}`.padEnd(20) +
//             `$${parseFloat(item.Poitrine).toFixed(2)}`.padEnd(20) +
//             `$${itemTotal.toFixed(2)}`.padEnd(20),
//             { continued: false }
//           )
//           .moveDown();
//       }
//     );
//     // Total Price
//     doc.moveDown();
//     doc
//       .fontSize(14)
//       .font("Helvetica-Bold")
//       .text(`Total Price: $${totalPrice.toFixed(2)}`, { align: "right" })
//       .moveDown();
//     // Footer
//     doc
//       .fontSize(10)
//       .font("Helvetica")
//       .text(
//         "Thank you for your purchase! If you have any questions about this invoice, please contact support@example.com.",
//         { align: "center", width: 500 }
//       );
//     doc.end();
//     // Save notification
//     const notification = new Notification({
//       type: "order",
//       title: `New Invoice: ${userDetails.firstName}`,
//       message: `Order ID: ${order._id} has been placed.`,
//       filePath: `/invoices/${invoiceFileName}`,
//       date: new Date(),
//       read: false,
//     });
//     await notification.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order", error });
//   }
// };
// export const placeOrder = async (req: Request, res: Response) => {
//   try {
//     const { userDetails, cartItems } = req.body;
//     if (!userDetails || !cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Invalid order details" });
//     }
//     // Calculate total price
//     const totalPrice = cartItems.reduce(
//       (total: number, item: { quantity: number; Poitrine: string }) =>
//         total + item.quantity * 10,
//       0
//     );
//     // Create and save the order
//     const order = new Order({
//       userDetails,
//       cartItems,
//       totalPrice, // Add this when creating an order
//       date: new Date(),
//     });
//     await order.save();
//       // Clear the user's cart
//       const userId = userDetails.userId; // Ensure userId exists in userDetails
//       const deletedCart = await Cart.deleteMany({ userId });
//       if (deletedCart.deletedCount === 0) {
//         console.error("Cart deletion failed: No items found for user.");
//       }
//     // Ensure the invoices directory exists
//     const invoiceDir = path.resolve(__dirname, "../../invoices");
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }
//     // Generate Invoice PDF
//     const invoiceFileName = `${userDetails.firstName}_${order._id}.pdf`;
//     const invoicePath = path.join(invoiceDir, invoiceFileName);
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(invoicePath));
//     doc.fontSize(20).text("Invoice", { align: "center" });
//     doc.fontSize(14).text(`Order ID: ${order._id}`);
//     doc.text(`Name: ${userDetails.firstName} ${userDetails.lastName}`);
//     doc.text(`Email: ${userDetails.email}`);
//     doc.text(
//       `Address: ${userDetails.address}, ${userDetails.city}, ${userDetails.country}`
//     );
//     doc.text(`Date: ${new Date().toLocaleString()}`);
//     doc.text("\n");
//     doc.fontSize(16).text("Order Details");
//     cartItems.forEach(
//       (item: { REF: string; quantity: number; Poitrine: string }, index: number) => {
//         doc.text(
//           `${index + 1}. ${item.REF} - Quantity: ${item.quantity} - Price: $${item.Poitrine}`
//         );
//       }
//     );
//     doc.text("\n");
//     doc.text(`Total Price: $${totalPrice.toFixed(2)}`);
//     doc.end();
//     // Save notification
//     const notification = new Notification({
//       type: "order",
//       title: `New Invoice: ${userDetails.firstName}`,
//       message: `Order ID: ${order._id} has been placed.`,
//       filePath: `/invoices/${invoiceFileName}`, // Relative path for frontend
//       date: new Date(),
//       read: false,
//     });
//     await notification.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order", error });
//   }
// };
const getOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.getOrders = getOrders;
// export const getUserOrders = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required to fetch orders." });
//     }
//     const orders = await Order.find({ "userDetails.userId": userId }).sort({ date: -1 });
//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No orders found for this user." });
//     }
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ message: "Error fetching user orders", error });
//   }
// };
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to fetch orders." });
        }
        const orders = yield order_model_1.default.find({ "userDetails.userId": userId })
            .sort({ date: -1 })
            .populate({
            path: "cartItems.productId",
            populate: { path: "subcategoryID", select: "name" },
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching user orders", error });
    }
});
exports.getUserOrders = getUserOrders;
// export const getAllOrders = async (req: Request, res: Response) => {
//   try {
//     const orders = await Order.find()
//       .populate("cartItems.subcategoryID");
//     // Calculate totalPrice dynamically if not present
//     const ordersWithTotalPrice = orders.map(order => ({
//       ...order.toObject(),
//       totalPrice: order.cartItems.reduce(
//         (sum, item) =>
//           sum + item.quantity * (item.price || 0),
//         0
//       ),
//       }));
//       // Invoice file handling
//       const ordersWithInvoicePath = ordersWithTotalPrice.map(order => {
//         const invoiceDir = path.resolve(__dirname, "../../invoices");
//         const invoicePath = `/invoices/${order._id}.pdf`;
//         const fullPath = path.join(invoiceDir, `${order._id}.pdf`);
//         // Check if invoice file exists, generate if missing
//         if (!fs.existsSync(fullPath)) {
//           const doc = new PDFDocument();
//           doc.pipe(fs.createWriteStream(fullPath));
//           doc.fontSize(16).text(`Invoice for Order ID: ${order._id}`);
//           doc.text(`Customer: ${order.userDetails.firstName} ${order.userDetails.lastName}`);
//           doc.text(`Total Price: $${order.totalPrice.toFixed(2)}`);
//           doc.end();
//         }
//         return {
//           ...order,
//           invoicePath,
//         };
//       });
//     return res.status(200).json(ordersWithInvoicePath);
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// };
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .populate("cartItems.subcategoryID", "name"); // Populate subcategory name
        // Process each order
        const ordersWithDetails = orders.map((order) => {
            // Calculate total price dynamically
            const totalPrice = order.cartItems.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
            // Generate invoice path
            const invoiceDir = path_1.default.resolve(__dirname, "../../invoices");
            const invoiceFileName = `${order._id}.pdf`;
            const invoicePath = `/invoices/${invoiceFileName}`;
            const fullPath = path_1.default.join(invoiceDir, invoiceFileName);
            // Check if invoice file exists, generate if missing
            if (!fs_1.default.existsSync(fullPath)) {
                const doc = new pdfkit_1.default();
                const writeStream = fs_1.default.createWriteStream(fullPath);
                doc.pipe(writeStream);
                // Invoice content
                doc.fontSize(20).text("Invoice", { align: "center" });
                doc.moveDown();
                doc.fontSize(12).text(`Order ID: ${order._id}`);
                doc.text(`Customer: ${order.userDetails.firstName} ${order.userDetails.lastName}`);
                doc.text(`Date: ${new Date(order.date).toLocaleString()}`);
                doc.text(`Total Price: $${totalPrice.toFixed(2)}`);
                doc.moveDown();
                doc.text("Order Details:", { underline: true });
                doc.moveDown();
                // Table Headers
                doc.fontSize(12).text("Item", 50, doc.y, { continued: true });
                doc.text("Quantity", 200, doc.y, { continued: true });
                doc.text("Price", 300, doc.y, { continued: true });
                doc.text("Subtotal", 400, doc.y);
                doc.moveDown();
                // Order items
                order.cartItems.forEach((item, index) => {
                    var _a;
                    const itemName = item.REF || "Undefined";
                    const quantity = item.quantity || 0;
                    const price = item.price || 0;
                    const subtotal = quantity * price;
                    const subcategoryName = ((_a = item.subcategoryID) === null || _a === void 0 ? void 0 : _a.name) || "Unknown Subcategory";
                    doc.text(`${index + 1}. ${itemName}`, 50, doc.y, { continued: true });
                    doc.text(quantity.toString(), 200, doc.y, { continued: true });
                    doc.text(`$${price.toFixed(2)}`, 300, doc.y, { continued: true });
                    doc.text(`$${subtotal.toFixed(2)}`, 400, doc.y);
                    doc.moveDown();
                    // Add attributes or additional info
                    if (subcategoryName) {
                        doc.fontSize(10).text(`Subcategory: ${subcategoryName}`, {
                            indent: 20,
                        });
                    }
                });
                // Footer
                doc.fontSize(10).text("Thank you for your purchase! For questions, contact support@example.com.", { align: "center" });
                doc.end();
            }
            // Return updated order object
            return Object.assign(Object.assign({}, order.toObject()), { totalPrice,
                invoicePath });
        });
        res.status(200).json(ordersWithDetails);
    }
    catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.getAllOrders = getAllOrders;
//status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }
    try {
        // Find and update the order's status
        const order = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true } // Return the updated order
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
//9
// import { Request, Response } from "express";
// import Order from "../models/order.model";
// import Cart from "../models/cart.model";
// import Notification from "../models/notification.model";
// import fs from "fs";
// import path from "path";
// import PDFDocument from "pdfkit";
// export const placeOrder = async (req: Request, res: Response) => {
//   try {
//     const { userDetails, cartItems } = req.body;
//     if (!userDetails || !cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Invalid order details" });
//     }
//     // Calculate total price
//     const totalPrice = cartItems.reduce(
//       (total: number, item: { quantity: number; Poitrine: string }) =>
//         total + item.quantity * parseFloat(item.Poitrine || "0"),
//       0
//     );
//     // Create and save the order
//     const order = new Order({
//       userDetails,
//       cartItems,
//       totalPrice,
//       date: new Date(),
//     });
//     await order.save();
//     // Clear the user's cart
//     const userId = userDetails.userId;
//     await Cart.deleteMany({ userId });
//     // Ensure the invoices directory exists
//     const invoiceDir = path.resolve(__dirname, "../../invoices");
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }
//     // Generate Invoice PDF
//     const invoiceFileName = `${userDetails.firstName}_${order._id}.pdf`;
//     const invoicePath = path.join(invoiceDir, invoiceFileName);
//     generateInvoicePDF(order, invoicePath);
//     // Save notification
//     const notification = new Notification({
//       type: "order",
//       title: `New Invoice: ${userDetails.firstName}`,
//       message: `Order ID: ${order._id} has been placed.`,
//       filePath: `/invoices/${invoiceFileName}`,
//       date: new Date(),
//       read: false,
//     });
//     await notification.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Error placing order", error });
//   }
// };
// export const getOrders = async (_req: Request, res: Response) => {
//     try {
//       const orders = await Order.find();
//       res.status(200).json(orders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       res.status(500).json({ message: "Error fetching orders", error });
//     }
//   };
// export const getAllOrders = async (_req: Request, res: Response) => {
//   try {
//     const orders = await Order.find().populate("cartItems.subcategoryID");
//     const invoiceDir = path.resolve(__dirname, "../../invoices");
//     const ordersWithInvoicePath = orders.map((order: any) => {
//       const invoiceFileName = `${order._id}.pdf`;
//       const invoicePath = path.join(invoiceDir, invoiceFileName);
//       if (!fs.existsSync(invoicePath)) {
//         generateInvoicePDF(order, invoicePath);
//       }
//       return {
//         ...order.toObject(),
//         invoicePath: `/invoices/${invoiceFileName}`,
//       };
//     });
//     res.status(200).json(ordersWithInvoicePath);
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// };
// export const getUserOrders = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required to fetch orders." });
//     }
//     const orders = await Order.find({ "userDetails.userId": userId })
//       .sort({ date: -1 })
//       .populate("cartItems.subcategoryID");
//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No orders found for this user." });
//     }
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ message: "Error fetching user orders", error });
//   }
// };
// // Utility function to generate an invoice PDF
// const generateInvoicePDF = (order: any, filePath: string) => {
//   const doc = new PDFDocument({ margin: 50 });
//   doc.pipe(fs.createWriteStream(filePath));
//   // Header
//   doc.fontSize(20).text("Invoice", { align: "center" });
//   doc.moveDown();
//   // User Details
//   doc.fontSize(12).text(`Order ID: ${order._id}`);
//   doc.text(`Customer: ${order.userDetails.firstName} ${order.userDetails.lastName}`);
//   doc.text(`Email: ${order.userDetails.email}`);
//   doc.text(
//     `Address: ${order.userDetails.address}, ${order.userDetails.city}, ${order.userDetails.country}`
//   );
//   doc.text(`Date: ${new Date(order.date).toLocaleString()}`);
//   doc.moveDown();
//   // Order Details
//   doc.fontSize(16).text("Order Details:");
//   order.cartItems.forEach((item: any, index: number) => {
//     const itemTotal = item.quantity * parseFloat(item.Poitrine || "0");
//     doc.fontSize(12).text(
//       `${index + 1}. ${item.subcategoryID?.name || "Unknown"} (${item.REF}) - Qty: ${item.quantity} - Price: $${parseFloat(
//         item.Poitrine || "0"
//       ).toFixed(2)} - Total: $${itemTotal.toFixed(2)}`
//     );
//   });
//   doc.moveDown();
//   // Total Price
//   doc.fontSize(14).text(`Total Price: $${order.totalPrice.toFixed(2)}`, {
//     align: "right",
//   });
//   // Footer
//   doc.moveDown();
//   doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });
//   doc.end();
// };
