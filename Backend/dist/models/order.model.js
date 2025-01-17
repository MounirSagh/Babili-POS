"use strict";
// import mongoose, { Schema, Document } from 'mongoose';
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
// interface IOrder extends Document {
//   userDetails: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     city: string;
//     address: string;
//     postalCode: string;
//     country: string;
//   };
//   cartItems: {
//     _id: number;
//     REF: string;
//     Poitrine: string;
//     Poids: string;
//     Flottabilité: string;
//     TYPE: string;
//     subcategoryID: string;
//     quantity: number;
//   }[];
//   date: Date;
// }
// const OrderSchema: Schema = new Schema({
//   userDetails: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     city: { type: String, required: true },
//     address: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true },
//   },
//   cartItems: [
//     {
//       REF: { type: String, required: true },
//       Poitrine: { type: String, required: true },
//       Poids: { type: String, required: true },
//       Flottabilité: { type: String, required: true },
//       TYPE: { type: String, required: true },
//       subcategoryID: { type: String, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   date: { type: Date, default: Date.now },
// });
// const Order = mongoose.model<IOrder>('Order', OrderSchema);
// export default Order;
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    userDetails: {
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    cartItems: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            REF: { type: String, required: true },
            attributes: [
                {
                    key: { type: String, required: true },
                    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
                },
            ],
            price: { type: Number, required: true },
            subcategoryID: { type: mongoose_1.Schema.Types.ObjectId, ref: "SubCategory" },
        },
    ],
    date: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
