import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './utils/db';
import bodyParser from "body-parser";
import router from './routes/router';
import cartRoutes from "./routes/cart.routes";
import notificationRoutes from "./routes/notification.routes";
import saleRoutes from './routes/sale.routes';
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Serve static files from the 'uploads' directory
//app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/invoices", express.static(path.join(__dirname, "../invoices")));
//app.use('/tables', express.static(path.join(__dirname, '../tables')));

connectDB();

app.use('/api', router);
app.use("/api/cart", cartRoutes);
app.use("/api/notification", notificationRoutes);
app.use('/api/sale', saleRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/products", productRoutes);

app.use("/api/sales", saleRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
