import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Fetch all delivery areas
export const fetchDeliveryAreas = createAsyncThunk(
  "userdeliveryAreas/fetchDeliveryAreas",  // Keep slice name consistent
  async () => {
    try {
      const res = await fetch(`${process.env.API}/user/delivery-areas`);
      if (!res.ok) throw new Error("Failed to fetch delivery areas");
      return await res.json();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);

const userdeliveryAreaSlice = createSlice({
  name: "userdeliveryAreas",  // Keep original slice name
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDeliveryAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userdeliveryAreaSlice.reducer;