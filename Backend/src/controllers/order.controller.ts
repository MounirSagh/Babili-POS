import { Request, Response } from "express";
import Order, { IOrderDocument } from "../models/order.model";
import Notification from "../models/notification.model";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Cart from "../models/cart.model";
import axios from "axios";
import Product from "../models/product.model";
import { Document as MongooseDocument } from 'mongoose';

type OrderDocument = IOrderDocument & { _id: string };

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userDetails, cartItems } = req.body;

    // Validate request body
    if (!userDetails || !cartItems || cartItems.length === 0) {
      console.error("Invalid order details:", { userDetails, cartItems });
      return res.status(400).json({ message: "Invalid order details" });
    }

    // Validate cart items - Simplified validation
    for (const item of cartItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        console.error("Invalid cart item:", item);
        return res.status(400).json({ message: "Invalid cart item detected" });
      }
    }

    // Calculate total price - Simplified calculation
    const totalPrice = cartItems.reduce((total: number, item: any) => {
      return total + (item.quantity * (item.productId.price || 0));
    }, 0);

    // Create order with simplified structure
    const order = new Order({
      userDetails,
      cartItems: cartItems.map((item: any) => ({
        productId: item.productId._id,
        REF: item.productId.REF,
        price: item.productId.price,
        quantity: item.quantity,
        subcategoryID: item.productId.subcategoryID,
        attributes: item.productId.attributes || []
      })),
      totalPrice,
      date: new Date()
    });

    await order.save();
    console.log("Order saved successfully:", order._id);

     // Remove ordered items from the cart
     const cartItemIds = cartItems.map((item: any) => item._id);
     await Cart.deleteMany({ _id: { $in: cartItemIds } });



    // Refetch the product stock in the ProductPage

  
        
    // Generate invoice with basic path handling
    const invoiceFileName = `${userDetails.firstName}_${order._id}.pdf`;
    const invoiceDir = path.resolve("./invoices");
    const invoiceFullPath = path.join(invoiceDir, invoiceFileName);

    // Ensure directory exists
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    // Generate PDF
    await generateInvoicePDF(
      {
        orderId: String(order._id),
        userDetails,
        cartItems: order.cartItems,
        totalPrice,
        date: order.date.toISOString()
      },
      invoiceFullPath
    );

    // Create notification with relative path
    const notification = new Notification({
      type: "order",
      title: `New Invoice: ${userDetails.firstName}`,
      message: `Order ID: ${order._id} has been placed.`,
      filePath: `invoices/${invoiceFileName}`,
      date: new Date(),
      read: false
    });

    await notification.save();

    // Return success response
    res.status(201).json({
      message: "Order placed successfully",
      order,
      invoicePath: `invoices/${invoiceFileName}`
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "Error placing order",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const generateInvoicePDF = async (data: any, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
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
      doc.text("Quantity", 200, doc.y, { continued: true });
      doc.text("Price", 300, doc.y, { continued: true });
      doc.text("Subtotal", 400, doc.y);
      doc.moveDown();

      // Order Items
      data.cartItems.forEach((item: any, index: number) => {
        const itemName = item.REF || "Undefined";
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const subtotal = quantity * price;

        doc.text(`${index + 1}. ${itemName}`, 50, doc.y, { continued: true });
        doc.text(quantity, 200, doc.y, { continued: true });
        doc.text(`$${price.toFixed(2)}`, 300, doc.y, { continued: true });
        doc.text(`$${subtotal.toFixed(2)}`, 400, doc.y);
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
    } catch (error) {
      reject(error);
    }
  });
};

// export const getOrders = async (_req: Request, res: Response) => {
//   try {
//     const orders = await Order.find();
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// };
export const getOrders = async (req: Request, res: Response) => {
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

    const orders = await Order.find(dateFilter)
      .populate('cartItems.subcategoryID', 'name')
      .sort({ date: 1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to fetch orders." });
    }

    const orders = await Order.find({ "userDetails.userId": userId })
      .sort({ date: -1 })
      .populate({
        path: "cartItems.productId",
        populate: { path: "subcategoryID", select: "name" },
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders", error });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("cartItems.subcategoryID", "name"); // Populate subcategory name

    // Process each order
    const ordersWithDetails = orders.map((order) => {
      // Calculate total price dynamically
      const totalPrice = order.cartItems.reduce(
        (sum, item) => sum + item.quantity * (item.price || 0),
        0
      );

      // Generate invoice path
      const invoiceDir = path.resolve(__dirname, "../../invoices");
      const invoiceFileName = `${order._id}.pdf`;
      const invoicePath = `/invoices/${invoiceFileName}`;
      const fullPath = path.join(invoiceDir, invoiceFileName);

      // Check if invoice file exists, generate if missing
      if (!fs.existsSync(fullPath)) {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(fullPath);

        doc.pipe(writeStream);

        // Invoice content
        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(
          `Customer: ${order.userDetails.firstName} ${order.userDetails.lastName}`
        );
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
          const itemName = item.REF || "Undefined";
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const subtotal = quantity * price;
          const subcategoryName =
            item.subcategoryID?.name || "Unknown Subcategory";

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
        doc.fontSize(10).text(
          "Thank you for your purchase! For questions, contact support@example.com.",
          { align: "center" }
        );

        doc.end();
      }

      // Return updated order object
      return {
        ...order.toObject(),
        totalPrice,
        invoicePath,
      };
    });

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status
  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the order
    const order = await Order.findById(orderId).populate("cartItems.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Handle stock adjustment logic
    if (order.status === "Pending" && status === "Approved") {
      // Transition from Pending to Approved: Deduct stock
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({
              message: `Insufficient stock for product ${product.REF}. Available stock: ${product.stock}, Requested quantity: ${item.quantity}`,
            });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    } else if (order.status === "Approved" && status === "Rejected") {
      // Transition from Approved to Rejected: Add stock back
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    } else if (order.status === "Rejected" && status === "Approved") {
      // Transition from Rejected to Approved: Deduct stock
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({
              message: `Insufficient stock for product ${product.REF}. Available stock: ${product.stock}, Requested quantity: ${item.quantity}`,
            });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    } else if (order.status === "Approved" && status === "Pending") {
      // Transition from Approved to Pending: Add stock back
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    } else if (order.status === "Rejected" && status === "Pending") {
      // Transition from Rejected to Pending: No stock changes
    } else if (order.status === "Pending" && status === "Rejected") {
      // Transition from Pending to Rejected: No stock changes
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Error updating order status",
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get daily summary
export const getDailySummary = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).sort({ date: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily summary', error });
  }
};

// End day and generate report
export const endDay = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const summary = {
      date: today,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((acc, order) => acc + order.totalPrice, 0),
      orders: orders
    };

    // You could save this summary to a DayEndReport collection if needed
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error ending day', error });
  }
};

// Get reports by date
export const getReports = async (req: Request, res: Response) => {
  try {
    const date = new Date(req.query.date as string);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      date: {
        $gte: date,
        $lte: endDate
      }
    }).sort({ date: 1 });

    const report = {
      _id: date.toISOString(),
      date: date,
      totalRevenue: orders.reduce((acc, order) => acc + order.totalPrice, 0),
      totalOrders: orders.length,
      orders: orders
    };

    res.json([report]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

// Generate and download PDF report
export const downloadReport = async (req: Request, res: Response) => {
  try {
    const date = new Date(req.query.date as string);
    const orders = await Order.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    }).sort({ date: 1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${date.toISOString().split('T')[0]}.pdf`);
    
    doc.pipe(res);

    // Add report content
    doc.fontSize(20).text('Daily Sales Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${date.toLocaleDateString()}`);
    doc.moveDown();

    // Add summary
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    doc.text(`Total Orders: ${orders.length}`);
    doc.text(`Total Revenue: ${totalRevenue.toFixed(2)} MAD`);
    doc.moveDown();
// Add orders table
orders.forEach((order: IOrderDocument) => {
  const orderId = order.id.toString();
  const orderDate = new Date(order.date);
  const formattedTime = orderDate.toLocaleTimeString();
  const paymentMethod =  order.paymentMethod === 'card' ? 'Card Payment' : 'Cash Payment';
  const totalPrice = order.totalPrice ? order.totalPrice.toFixed(2) : '0.00';

  doc.text(`Order ID: ${orderId.slice(-6)}`);
  doc.text(`Time: ${formattedTime}`);
  doc.text(`Payment Method: ${paymentMethod}`);
  doc.text(`Total: ${totalPrice} MAD`);
  doc.moveDown();
});


    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};
