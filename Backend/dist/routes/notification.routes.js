"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
// Middleware wrapper for async functions
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Add Order Route
router.get("/getnotifications", notification_controller_1.getNotifications);
router.get("/download/:filePath", asyncHandler(notification_controller_1.downloadInvoice));
router.put("/markasread/:id", notification_controller_1.markAsRead);
router.delete("/deletenotification/:id", notification_controller_1.deleteNotification); // Add this line for delete
exports.default = router;
