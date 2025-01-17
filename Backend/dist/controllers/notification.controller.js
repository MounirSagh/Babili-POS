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
exports.deleteNotification = exports.markAsRead = exports.downloadInvoice = exports.getNotifications = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
// Assuming order is defined somewhere above
const order = { _id: "someOrderId" }; // Replace with actual order object
const userDetails = { firstName: "John" }; // Replace with actual user details
const invoicePath = `/invoices/${order._id}.pdf`; // Ensure this matches the actual file path
const createNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new notification_model_1.default({
        type: "order",
        title: `New Invoice: ${userDetails.firstName}`,
        message: `Order ID: ${order._id} has been placed.`,
        filePath: invoicePath,
        date: new Date(),
        read: false,
    });
    yield notification.save();
});
createNotification();
// Get all notifications
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_model_1.default.find().sort({ date: -1 }); // Sort by most recent
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications", error });
    }
});
exports.getNotifications = getNotifications;
// Download invoice
const downloadInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filePath } = req.params;
        const fullPath = path_1.default.resolve(`./invoices/${filePath}`);
        if (!fs_1.default.existsSync(fullPath)) {
            return res.status(404).json({ message: "File not found" });
        }
        res.download(fullPath);
    }
    catch (error) {
        res.status(500).json({
            message: "Error downloading file",
            error: error.message || error,
        });
    }
});
exports.downloadInvoice = downloadInvoice;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notification = yield notification_model_1.default.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        res.status(200).json({ message: "Notification marked as read", notification });
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Error marking notification as read", error });
    }
});
exports.markAsRead = markAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notification = yield notification_model_1.default.findByIdAndDelete(id);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification", error });
    }
});
exports.deleteNotification = deleteNotification;
