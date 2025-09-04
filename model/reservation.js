import mongoose from "mongoose";

import User from "./user";

import ReservationTime from "./reservationTime"
const reservationSchema = new mongoose.Schema(
  {
    reservation_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationTime",
    },
    persons: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);
