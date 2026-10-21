
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  seller?: mongoose.Types.ObjectId;
  imageUrl?: string;
  imagePublicId?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
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

// Compound index for category filtering and price sorting
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
