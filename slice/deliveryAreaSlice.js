import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


// Fetch all delivery areas
export const fetchDeliveryAreas = createAsyncThunk(
  "deliveryAreas/fetchDeliveryAreas",
  async () => {
    try {
      const res = await fetch(`${process.env.API}/admin/delivery-areas`);
      if (!res.ok) throw new Error("Failed to fetch delivery areas");
      return await res.json();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);







// Fetch single delivery area by ID
export const fetchDeliveryAreaById = createAsyncThunk(
  "deliveryAreas/fetchDeliveryAreaById",
  async (id) => {
    try {
      const res = await fetch(`${process.env.API}/admin/delivery-areas/${id}`);
      if (!res.ok) throw new Error("Failed to fetch delivery area");
      return await res.json();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);







// Create new delivery area
export const createDeliveryArea = createAsyncThunk(
  "deliveryAreas/createDeliveryArea",
  async (areaData) => {
    try {
      const res = await fetch(`${process.env.API}/admin/delivery-areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(areaData),
      });
      if (!res.ok) throw new Error("Failed to create delivery area");
      const data = await res.json();
      toast.success("Delivery area created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);

// Update delivery area
export const updateDeliveryArea = createAsyncThunk(
  "deliveryAreas/updateDeliveryArea",
  async ({ id, areaData }) => {
    try {
      const res = await fetch(`${process.env.API}/admin/delivery-areas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(areaData),
      });
      if (!res.ok) throw new Error("Failed to update delivery area");
      const data = await res.json();
      toast.success("Delivery area updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);

// Delete delivery area
export const deleteDeliveryArea = createAsyncThunk(
  "deliveryAreas/deleteDeliveryArea",
  async (id) => {
    try {
      const res = await fetch(`${process.env.API}/admin/delivery-areas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete delivery area");
      toast.success("Delivery area deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  }
);

// Slice definition
const deliveryAreaSlice = createSlice({
  name: "deliveryAreas",
  initialState: {
    list: [],
 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createDeliveryArea.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createDeliveryArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Read All
      .addCase(fetchDeliveryAreas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDeliveryAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })






      // Read One
      .addCase(fetchDeliveryAreaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryAreaById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchDeliveryAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update
      .addCase(updateDeliveryArea.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateDeliveryArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteDeliveryArea.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteDeliveryArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default deliveryAreaSlice.reducer;
