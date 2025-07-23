import mongoose from "mongoose";
import Product from "./product";
import ProductSize from "./productsize";
import ProductOption from "./productoption";
import User from "./user";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductSize",
        },
        option_ids: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductOption",
          },
        ],
        quantity: {
          type: Number,
          required: true,
        },
        item_price: {
          type: Number, // price * quantity
          required: true,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // pending, paid, shipped, delivered
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
