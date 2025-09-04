import mongoose from "mongoose";

const reservationTimeSchema = new mongoose.Schema(
  {
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true, // 1 in Laravel's boolean default becomes true
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);

export default  
mongoose.models.ReservationTime ||

mongoose.model("ReservationTime", reservationTimeSchema);
