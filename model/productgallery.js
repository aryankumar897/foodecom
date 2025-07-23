// Import mongoose
import mongoose from 'mongoose';
import Product from "./product"
// Define schema for product gallery
const productGallerySchema = new mongoose.Schema({
  // Reference to the 'products' collection
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // assuming your Product model is named 'Product'
    required: true,
  },
  // Image URL or path
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the model
export default mongoose.models.ProductGallery || mongoose.model('ProductGallery', productGallerySchema);
