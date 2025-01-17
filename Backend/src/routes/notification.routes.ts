import express from "express";
import { getNotifications, downloadInvoice, markAsRead, deleteNotification } from "../controllers/notification.controller";

const router = express.Router();

// Middleware wrapper for async functions
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Add Order Route

router.get("/getnotifications", getNotifications);
router.get("/download/:filePath", asyncHandler(downloadInvoice));
router.put("/markasread/:id", markAsRead);
router.delete("/deletenotification/:id", deleteNotification); // Add this line for delete

export default router;
