// slice/chefSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single chef by ID
export const fetchChefById = createAsyncThunk(
  'chefs/fetchChefById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/chefs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chef: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading chef: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all chefs (admin)
export const fetchChefs = createAsyncThunk(
  "chefs/fetchChefs",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/chefs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chefs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading chefs: ${error.message}`);
      throw error;
    }
  }
);

// Fetch chefs for home page
export const fetchHomeChefs = createAsyncThunk(
  "chefs/fetchHomeChefs",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/chefs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chefs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading chefs: ${error.message}`);
      throw error;
    }
  }
);

// Create new chef
export const createChef = createAsyncThunk(
  "chefs/createChef",
  async (chefData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/chefs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chefData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create chef: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Chef created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating chef: ${error.message}`);
      throw error;
    }
  }
);

// Update existing chef
export const updateChef = createAsyncThunk(
  "chefs/updateChef",
  async ({ id, chefData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/chefs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chefData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update chef: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Chef updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating chef: ${error.message}`);
      throw error;
    }
  }
);

// Delete chef
export const deleteChef = createAsyncThunk(
  "chefs/deleteChef",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/chefs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete chef: ${response.status}`);
      }
      toast.success("Chef deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting chef: ${error.message}`);
      throw error;
    }
  }
);

const chefSlice = createSlice({
  name: "chefs",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeChefs: [], // Separate list for home page chefs
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Chef
      .addCase(createChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChef.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Chefs
      .addCase(fetchChefs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChefs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchChefs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Chefs
      .addCase(fetchHomeChefs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeChefs.fulfilled, (state, action) => {
        state.loading = false;
        state.homeChefs = action.payload;
      })
      .addCase(fetchHomeChefs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Chef
      .addCase(updateChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChef.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Chef
      .addCase(deleteChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChef.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Chef
      .addCase(fetchChefById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChefById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the chef in the list
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchChefById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default chefSlice.reducer;