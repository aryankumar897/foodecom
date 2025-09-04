import mongoose from "mongoose";

const bannerSliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sub_title: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String, // you can store image URL or path here
      required: true,
    },

    url: {
      type: String, // you can store image URL or path here
      required: true,
    },

    status: {
      type: Boolean,
      default: true, // if you want default like MySQL boolean
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);


export default mongoose.models.BannerSlider || 

mongoose.model("BannerSlider", bannerSliderSchema);
