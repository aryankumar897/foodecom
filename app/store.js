"use client";

import { configureStore } from "@reduxjs/toolkit";

import sliderReducer from "@/slice/sliderSlice";
import categoryReducer from "@/slice/categorySlice";
import productReducer from "@/slice/productSlice";
import cartReducer from "@/slice/cartSlice";
import couponReducer from "@/slice/couponSlice"; // Import the coupon slice
import deliveryAreaReducer from "@/slice/deliveryAreaSlice"; // ✅ Import delivery area slice
import addressReducer from "@/slice/addressSlice"; // ✅ Import address slice
import userdeliveryAreaReducer from "@/slice/userdeliveryAreaSlice";
import reservationTime from "@/slice/reservationTimeSlice";

import chefReducer from "@/slice/chefSlice"; // Import the chef slice
import testimonialReducer from "@/slice/testimonialSlice";

import bannerReducer from "@/slice/bannerSlice";
import blogReducer from "@/slice/blogSlice"; // ✅ Import the blog slice

export const store = configureStore({
  reducer: {
    sliders: sliderReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    coupons: couponReducer,
    deliveryAreas: deliveryAreaReducer,
    addresses: addressReducer,
    userdeliveryAreas: userdeliveryAreaReducer,
    reservationTimes: reservationTime,
    chefs: chefReducer,
    testimonials: testimonialReducer,
    banners: bannerReducer,
    blogs: blogReducer, // ✅ Add blog slice reducer
  },
});
