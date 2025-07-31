
import mongoose from "mongoose";

const OrderPlacedNotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  order_id: {
    type: Number, // You can change this to `mongoose.Schema.Types.ObjectId` if order is another model
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  seen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This adds `createdAt` and `updatedAt` fields like Laravel's $table->timestamps()
});

export default mongoose.models.Notification  || mongoose.model('Notification', OrderPlacedNotificationSchema);
