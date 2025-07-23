import mongoose from "mongoose";


const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    min_purchase_amount: {
      type: Number,
      default: 0,
      min: 0
    },
    expire_date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > Date.now();
        },
        message: 'Expiration date must be in the future'
      }
    },
    discount_type: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed'],
      lowercase: true
    },
    discount: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          if (this.discount_type === 'percentage') {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: 'Discount must be 0-100 for percentage, or positive for fixed'
      }
    },
    status: {
      type: Boolean,
      default: true
    },
    used_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);



export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);