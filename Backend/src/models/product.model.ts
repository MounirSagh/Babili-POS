
import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  REF: string;
  subcategoryID: mongoose.Types.ObjectId;
  attributes: { key: string; value: any }[];
  stock: number;
  price: number;
  isActive: boolean;
  
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    REF: { type: String, required: true, unique: true },
    subcategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    attributes: [
      {
        key: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
      },
    ],
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true} // Explicitly set the collection name
);

// Adding indexes for optimization
ProductSchema.index({ subcategoryID: 1 });
ProductSchema.index({ isActive: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);
