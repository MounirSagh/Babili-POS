import express from "express";
import {
  placeOrder,
  getOrders,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  createOrder,
  getDailySummary,
  endDay,
  getReports,
  downloadReport,
} from "../controllers/order.controller";
const { approveOrder } = require('../controllers/order.controller'); // Adjust the path as needed

const router = express.Router();

// Middleware wrapper for async functions
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Add Order Route
router.post("/addorder", asyncHandler(placeOrder));

// GSet Orders Route
router.get("/getorders", asyncHandler(getOrders));

// Get User Orders Route
router.get("/userorders/:userId", asyncHandler(getUserOrders));

// Get All Orders for Admin
router.get("/admin/getorders", asyncHandler(getAllOrders));

// Update Order Status
router.put("/updateStatus/:orderId", asyncHandler(updateOrderStatus));

// Add these new routes
router.post('/create', createOrder);
router.get('/daily-summary', getDailySummary);
router.post('/end-day', endDay);
router.get('/reports', getReports);
router.get('/download-report', downloadReport);

export default router;
