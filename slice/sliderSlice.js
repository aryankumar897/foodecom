// slice/sliderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Add this new thunk
export const fetchSliderById = createAsyncThunk(
  'sliders/fetchSliderById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch slider: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading slider: ${error.message}`);
      throw error;
    }
  }
);

// Async thunks
export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sliders: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading sliders: ${error.message}`);
      throw error;
    }
  }
);





// Async thunks
export const fetchHomeSliders = createAsyncThunk(
  "sliders/fetchSliders",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/sliders`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sliders: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading sliders: ${error.message}`);
      throw error;
    }
  }
);



export const createSlider = createAsyncThunk(
  "sliders/createSlider",
  async (sliderData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sliderData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create slider: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Slider created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating slider: ${error.message}`);
      throw error;
    }
  }
);

export const updateSlider = createAsyncThunk(
  "sliders/updateSlider",
  async ({ id, sliderData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sliderData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update slider: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Slider updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating slider: ${error.message}`);
      throw error;
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "sliders/deleteSlider",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete slider: ${response.status}`);
      }
      toast.success("Slider deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting slider: ${error.message}`);
      throw error;
    }
  }
);

const sliderSlice = createSlice({
  name: "sliders",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Slider
      .addCase(createSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Sliders
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Slider
      .addCase(updateSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Slider
      .addCase(deleteSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default sliderSlice.reducer;
