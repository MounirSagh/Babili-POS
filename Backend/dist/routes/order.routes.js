"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
// Middleware wrapper for async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Add Order Route
router.post("/addorder", asyncHandler(order_controller_1.placeOrder));
// Get Orders Route
router.get("/getorders", asyncHandler(order_controller_1.getOrders));
// Get User Orders Route
router.get("/userorders/:userId", asyncHandler(order_controller_1.getUserOrders));
// Get All Orders for Admin
router.get("/admin/getorders", asyncHandler(order_controller_1.getAllOrders));
// Update Order Status
router.put("/updateStatus/:orderId", asyncHandler(order_controller_1.updateOrderStatus));
exports.default = router;
