import { Schema, model, Document } from 'mongoose';

interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  purchaseHistory: { productId: string; amountSpent: number; date: Date }[];
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  loyaltyPoints: { type: Number, default: 0 },
  purchaseHistory: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      amountSpent: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Customer = model<ICustomer>('Customer', customerSchema);

export default Customer; 