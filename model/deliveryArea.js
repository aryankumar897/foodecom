// models/DeliveryArea.js

import mongoose from "mongoose";

const deliveryAreaSchema = new mongoose.Schema(
  {
    area_name: {
      type: String,
      required: true,
    },
    min_delivery_time: {
      type: String,
      required: true,
    },
    max_delivery_time: {
      type: String,
      required: true,
    },
    delivery_fee: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DeliveryArea ||
  mongoose.model("DeliveryArea", deliveryAreaSchema);
