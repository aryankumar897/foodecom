// Importing mongoose library
import mongoose from "mongoose";
import  Category from "./category"
// Defining the schema for 'products'
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    thumb_image: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // refers to the 'categories' collection
      required: true,
    },
    short_description: {
      type: String,
    },
    long_description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    offer_price: {
      type: Number,
    },
    
    sku: {
      type: String,
    },

    seo_title: {
      type: String,
      default: null,
    },

    seo_description: {
      type: String,
      default: null,
    },
    show_at_home: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model
export default mongoose.models.Product || mongoose.model("Product", productSchema);
