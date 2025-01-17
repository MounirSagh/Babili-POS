"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./utils/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./routes/router"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const sale_routes_1 = __importDefault(require("./routes/sale.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use("/invoices", express_1.default.static(path_1.default.join(__dirname, "../invoices")));
app.use('/tables', express_1.default.static(path_1.default.join(__dirname, '../tables')));
(0, db_1.default)();
app.use('/api', router_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/notification", notification_routes_1.default);
app.use('/api/sale', sale_routes_1.default);
app.use("/api/order", order_routes_1.default);
app.use("/api/products", product_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
