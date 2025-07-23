// slice/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single coupon by ID
export const fetchCouponById = createAsyncThunk(
  'coupons/fetchCouponById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch coupon: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading coupon: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all coupons (admin)
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons`);
      if (!response.ok) {
        throw new Error(`Failed to fetch coupons: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading coupons: ${error.message}`);
      throw error;
    }
  }
);

// Fetch active coupons for customers
export const fetchActiveCoupons = createAsyncThunk(
  "coupons/fetchActiveCoupons",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/coupons`);
      if (!response.ok) {
        throw new Error(`Failed to fetch active coupons: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading active coupons: ${error.message}`);
      throw error;
    }
  }
);

// Create new coupon
export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create coupon: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Coupon created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating coupon: ${error.message}`);
      throw error;
    }
  }
);

// Update existing coupon
export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, couponData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update coupon: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Coupon updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating coupon: ${error.message}`);
      throw error;
    }
  }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete coupon: ${response.status}`);
      }
      toast.success("Coupon deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting coupon: ${error.message}`);
      throw error;
    }
  }
);

// Validate coupon code
export const validateCoupon = createAsyncThunk(
  "coupons/validateCoupon",
  async (code) => {
    try {
      const response = await fetch(`${process.env.API}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`Invalid coupon: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Coupon validation failed: ${error.message}`);
      throw error;
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    list: [],
    loading: false,
    error: null,
    activeCoupons: [], // Separate list for active coupons (customer-facing)
    validatedCoupon: null, // Currently validated coupon
  },
  reducers: {
    clearValidatedCoupon: (state) => {
      state.validatedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Active Coupons
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCoupons = action.payload;
      })
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Coupon
      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the coupon in the list
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Validate Coupon
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.validatedCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.validatedCoupon = null;
      });
  },
});

export const { clearValidatedCoupon } = couponSlice.actions;
export default couponSlice.reducer;