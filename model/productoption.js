import mongoose from "mongoose";
import Product from "./product"
const productOptionSchema = new mongoose.Schema(
  {
    // Reference to the 'products' collection
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming your model name is 'Product'
      required: true,
    },
    // Name of the size (e.g., Small, Medium, Large)
    name: {
      type: String,
      required: true,
    },
    // Price for the specific size
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.models.ProductOption ||
  mongoose.model("ProductOption", productOptionSchema);