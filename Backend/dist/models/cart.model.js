"use strict";
// import mongoose, { Schema, Document } from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// interface ICart extends Document {
//   REF: string;
//   Poitrine: string;
//   Poids: string;
//   Flottabilité: string;
//   TYPE: string;
//   subcategoryID: string;
//   quantity: number;
// }
// const CartSchema: Schema = new Schema(
//   {
//     REF: { type: String, required: true },
//     Poitrine: { type: String, required: true },
//     Poids: { type: String, required: true },
//     Flottabilité: { type: String, required: true },
//     TYPE: { type: String, required: true },
//     // subcategoryID: { type: String, required: true },
//     subcategoryID: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
//     quantity: { type: Number, required: true },
//   },
//   { collection: "Cart" }
// );
// const Cart = mongoose.model<ICart>("Cart", CartSchema);
// export default Cart;
const mongoose_1 = __importStar(require("mongoose"));
const CartSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    attributes: [
        {
            key: { type: String, required: true },
            value: { type: mongoose_1.Schema.Types.Mixed, required: true },
        },
    ],
    quantity: { type: Number, required: true, min: 1 },
}, { collection: "Cart", timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);
const Cart = mongoose_1.default.model("Cart", CartSchema);
exports.default = Cart;
