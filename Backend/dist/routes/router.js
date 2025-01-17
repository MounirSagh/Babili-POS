"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_routes_1 = __importDefault(require("./category.routes"));
const subcategory_routes_1 = __importDefault(require("./subcategory.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const router = express_1.default.Router();
router.use("/categories", category_routes_1.default);
router.use("/subcategories", subcategory_routes_1.default);
router.use("/cart", cart_routes_1.default);
router.use("/product", product_routes_1.default);
router.use("/order", order_routes_1.default);
exports.default = router;
