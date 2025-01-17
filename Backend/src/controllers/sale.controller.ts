import Sale from '../models/sale.model';
import path from "path";
import fs from "fs";
import { Request, Response } from 'express';
import Order from '../models/order.model';


export const createSale = async (req: Request, res: Response) => {
  try {
      const sale = new Sale(req.body);
      await sale.save();
      res.status(201).json(sale);
  } catch (error) {
      res.status(400).json({ message: 'Error creating sale', error });
  }
};

// export const getSales = async (req: Request, res: Response) => {
// try {
//   const sales = await Sale.find().populate('cartItems.subcategoryID', 'name'); // Populate only the name of subcategory
//   console.log('Fetched Sales:', sales); // Log fetched data
//   res.status(200).json(sales);
// } catch (error) {    console.error('Error fetching sales:', error);
//   res.status(500).json({ message: 'Error fetching sales', error });
// }
// };


export const getSales = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query;
    let dateFilter = {};

    if (timeRange) {
      const now = new Date();
      const pastDate = new Date();

      switch (timeRange) {
        case '7d':
          pastDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          pastDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          pastDate.setDate(now.getDate() - 90);
          break;
        case '12m':
          pastDate.setMonth(now.getMonth() - 12);
          break;
        default:
          pastDate.setDate(now.getDate() - 7);
      }

      dateFilter = { date: { $gte: pastDate } };
    }

    const sales = await Sale.find(dateFilter)
      .populate('cartItems.subcategoryID', 'name')
      .sort({ date: -1 });

    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Error fetching sales', error });
  }
};

// Download invoice

export const downloadInvoice = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath } = req.params; // Get the file path from the URL parameter

    if (!filePath) {
      res.status(400).json({ message: "File path is required" });
      return res;
    }

    const absolutePath = path.resolve(__dirname, "../../invoices", filePath);

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
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
  } catch (error) {
    console.error("Error in downloadInvoice:", error);
    res.status(500).json({ message: "Server error", error });
    return res; // Ensure the function always returns a Response object
  }
};



// Get sales analytics
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query;
    const endDate = new Date();
    const startDate = new Date();

    // Adjust the date range based on the timeRange parameter
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '12m':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Fetch and aggregate data for all order statuses (approved, pending, rejected)
    const orders = await Order.aggregate([
      { 
        $match: { 
          date: { $gte: startDate, $lte: endDate }, 
          status: { $in: ["Approved", "Pending", "Rejected"] } 
        } 
      },
      {
        $group: {
          _id: "$status", // Group by order status (Approved, Pending, Rejected)
          totalRevenue: { 
            $sum: "$totalPrice"  // Calculate the total revenue for each status
          },
          totalOrders: { $sum: 1 }, // Count the total number of orders for each status
          salesData: { 
            $push: { 
              date: { $toString: "$date" }, 
              total: "$totalPrice" 
            }
          }
        }
      }
    ]);

    // Default structure for all orders
    const analyticsData = {
      approved: { totalOrders: 0, totalRevenue: 0, salesData: [] },
      pending: { totalOrders: 0, totalRevenue: 0, salesData: [] },
      rejected: { totalOrders: 0, totalRevenue: 0, salesData: [] },
      allOrders: { totalOrders: 0, totalRevenue: 0 },
      expectedRevenue: 0,
      actualRevenue: 0,
      conversionRate: 0
    };

    // Distribute the aggregated data into our response structure
    orders.forEach((order: any) => {
      if (order._id === "Approved") {
        analyticsData.approved.totalOrders = order.totalOrders;
        analyticsData.approved.totalRevenue = order.totalRevenue;
        analyticsData.approved.salesData = order.salesData;
      } else if (order._id === "Pending") {
        analyticsData.pending.totalOrders = order.totalOrders;
        analyticsData.pending.totalRevenue = order.totalRevenue;
        analyticsData.pending.salesData = order.salesData;
      } else if (order._id === "Rejected") {
        analyticsData.rejected.totalOrders = order.totalOrders;
        analyticsData.rejected.totalRevenue = order.totalRevenue;
        analyticsData.rejected.salesData = order.salesData;
      }
    });

    // Calculate totals for all orders
    analyticsData.allOrders.totalOrders = analyticsData.approved.totalOrders + analyticsData.pending.totalOrders + analyticsData.rejected.totalOrders;
    analyticsData.allOrders.totalRevenue = analyticsData.approved.totalRevenue;

    // Calculate expected revenue (approved + pending)
    analyticsData.expectedRevenue = analyticsData.approved.totalRevenue + analyticsData.pending.totalRevenue;

    // Calculate actual revenue (approved orders only)
    analyticsData.actualRevenue = analyticsData.approved.totalRevenue;

    // Calculate conversion rate (approved revenue / pending revenue)
    if (analyticsData.pending.totalRevenue > 0) {
      analyticsData.conversionRate = (analyticsData.actualRevenue / analyticsData.pending.totalRevenue) * 100;
    } else {
      analyticsData.conversionRate = 0; // Avoid divide by zero if pending revenue is 0
    }

    // Log the final analytics data before sending the response
    console.log("Final Analytics Data to Frontend:", JSON.stringify(analyticsData, null, 2));

    // Return the analytics data
    res.status(200).json(analyticsData);

  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Error fetching sales analytics', error });
  }
};
