// models/Wishlist.js
import mongoose from "mongoose";
import User from "./user";
import Product from "./product";

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to users collection
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // reference to products collection
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
