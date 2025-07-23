import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single address by ID
export const fetchAddressById = createAsyncThunk(
  "addresses/fetchAddressById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/user/addresses/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch address: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading address: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/user/addresses`);
      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading addresses: ${error.message}`);
      throw error;
    }
  }
);

// Create new address
export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (addressData) => {
    try {
      const response = await fetch(`${process.env.API}/user/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create address: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Address created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating address: ${error.message}`);
      throw error;
    }
  }
);

// Update existing address
export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ id, addressData }) => {
    try {
      const response = await fetch(`${process.env.API}/user/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update address: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Address updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating address: ${error.message}`);
      throw error;
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/user/addresses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete address: ${response.status}`);
      }
      toast.success("Address deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting address: ${error.message}`);
      throw error;
    }
  }
);

const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});




export default addressSlice.reducer;
