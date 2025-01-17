// import mongoose, { Schema, Document } from "mongoose";

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

import mongoose, { Schema, Document } from "mongoose";

interface Attribute {
  key: string;
  value: any;
}

interface ICart extends Document {
  productId: mongoose.Types.ObjectId; // Reference to Product
  attributes: Attribute[]; // Dynamic attributes from Product schema
  quantity: number; // Quantity in cart
}

const CartSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    attributes: [
      {
        key: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
      },
    ],
    quantity: { type: Number, required: true, min: 1 },
  },
  { collection: "Cart", timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
