// models/Address.js

import mongoose from "mongoose";

import User from "./user";
import DeliveryArea from "./deliveryArea";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivery_area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryArea",
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // If needed, you can add enum: ['home', 'office'] or similar
    },
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
