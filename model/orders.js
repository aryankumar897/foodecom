import mongoose from "mongoose";

import User from "@/model/user";

const orderSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    grand_total: {
      type: Number,
      required: true,
    },
    product_qty: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      default: null,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    payment_approve_date: {
      type: Date,
      default: null,
    },
    transaction_id: {
      type: String,
      default: null,
    },
    coupon_info: {
      type: Object, // or use a Schema if it's structured
      default: null,
    },
    currency_name: {
      type: String,
      default: "INR", // optional default
    },
    order_status: {
      type: String,
      enum: ["pending",  "delivered", "cancelled","inprocess"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Orders || mongoose.model("Orders", orderSchema);
