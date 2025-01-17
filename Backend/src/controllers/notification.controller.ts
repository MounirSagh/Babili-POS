import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import Notification from "../models/notification.model";

// Assuming order is defined somewhere above
const order = { _id: "someOrderId" }; // Replace with actual order object
const userDetails = { firstName: "John" }; // Replace with actual user details
const invoicePath = `/invoices/${order._id}.pdf`; // Ensure this matches the actual file path
const createNotification = async () => {
  const notification = new Notification({
    type: "order",
    title: `New Invoice: ${userDetails.firstName}`,
    message: `Order ID: ${order._id} has been placed.`,
    filePath: invoicePath,
    date: new Date(),
    read: false,
  });
  await notification.save();
};

createNotification();

// Get all notifications
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find().sort({ date: -1 }); // Sort by most recent
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Download invoice

export const downloadInvoice = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { filePath } = req.params;
    const fullPath = path.resolve(`./invoices/${filePath}`);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(fullPath);
  } catch (error: any) {
    res.status(500).json({
      message: "Error downloading file",
      error: error.message || error,
    });
  }
};



export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read", error });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification", error });
  }
};