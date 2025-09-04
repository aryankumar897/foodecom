// models/ProductRating.js
import mongoose from "mongoose";

import productRating from "./productRating"

import User from "./user"

import Orders from "./orders"

const productRatingSchema = new mongoose.Schema(
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
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders", // reference to orders collection
      required: false, // sometimes rating can be without order
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true, // active by default
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProductRating ||
  mongoose.model("ProductRating", productRatingSchema);
