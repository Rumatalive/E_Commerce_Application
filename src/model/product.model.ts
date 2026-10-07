import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  imagePublicId?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;