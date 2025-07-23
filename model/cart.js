import mongoose from "mongoose";
import Product from "./product";
import ProductSize from "./productsize";
import ProductOption from "./productoption";

import User from "./user";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSize",
    },
    optionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductOption",
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // Optional: to associate cart with user (if you implement auth)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-cart", "ordered"],
      default: "in-cart",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
