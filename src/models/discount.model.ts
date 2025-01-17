import { Schema, model, Document } from 'mongoose';

interface IDiscount extends Document {
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  applicableTo: string[];
}

const discountSchema = new Schema<IDiscount>({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  applicableTo: [String],
});

const Discount = model<IDiscount>('Discount', discountSchema);

export default Discount; 