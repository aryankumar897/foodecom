const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fb: {
      type: String,
      default: null,
    },
    in: {
      type: String,
      default: null,
    },
    x: {
      type: String,
      default: null,
    },
    web: {
      type: String,
      default: null,
    },
    show_at_home: {
      type: Boolean,
      default: false, // same as default(0)
    },
    status: {
      type: Boolean,
      default: true, // same as default(1)
    },
  },
  { timestamps: true }
);


export default mongoose.models.Chef ||

mongoose.model("Chef", chefSchema);
