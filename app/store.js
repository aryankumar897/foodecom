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


export const store = configureStore({
  reducer: {
    sliders: sliderReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    coupons: couponReducer, // Add the coupon reducer
    deliveryAreas: deliveryAreaReducer, // ✅ Add delivery area reducer

    addresses: addressReducer, // ✅ Add address reducer here

    userdeliveryAreas: userdeliveryAreaReducer,
  
  },
});
