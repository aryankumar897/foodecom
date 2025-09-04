import mongoose from "mongoose"

const dailyOfferSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the products collection
      required: true,
    },
    status: {
      type: Boolean,
      default: true, // same as default(1)
    },
  },
  { timestamps: true } // same as $table->timestamps()
);



export default mongoose.models.DailyOffer || 

mongoose.model("DailyOffer", dailyOfferSchema);
