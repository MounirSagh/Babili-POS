import mongoose, { Schema, Document } from 'mongoose';

interface ISale extends Document {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode: string;
    country: string;
  };
  cartItems: {
    REF: string;
   // Poitrine: string;
    subcategoryID: mongoose.Schema.Types.ObjectId; // Reference to subcategory model
    attributes: { key: string; value: string }[]; // Attributes for the product
    quantity: number;
  }[];
  date: Date;
  totalPrice: number;
}

const SaleSchema: Schema = new Schema({
  userDetails: {
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
      REF: { type: String, required: true },
      //Poitrine: { type: String, required: true },
      subcategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
      attributes: [{ key: { type: String }, value: { type: String } }], // New attributes field
      quantity: { type: Number, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
});

const Sale = mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
