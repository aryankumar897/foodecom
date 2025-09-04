// slice/testimonialSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


// Fetch single testimonial by ID
export const fetchTestimonialById = createAsyncThunk(
  'testimonials/fetchTestimonialById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/testimonials/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonial: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading testimonial: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all testimonials (admin)
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/testimonials`);
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading testimonials: ${error.message}`);
      throw error;
    }
  }
);

// Fetch testimonials for home page
export const fetchHomeTestimonials = createAsyncThunk(
  "testimonials/fetchHomeTestimonials",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/testimonials`);
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading testimonials: ${error.message}`);
      throw error;
    }
  }
);

// Create new testimonial
export const createTestimonial = createAsyncThunk(
  "testimonials/createTestimonial",
  async (testimonialData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create testimonial: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Testimonial created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating testimonial: ${error.message}`);
      throw error;
    }
  }
);

// Update existing testimonial
export const updateTestimonial = createAsyncThunk(
  "testimonials/updateTestimonial",
  async ({ id, testimonialData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update testimonial: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Testimonial updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating testimonial: ${error.message}`);
      throw error;
    }
  }
);

// Delete testimonial
export const deleteTestimonial = createAsyncThunk(
  "testimonials/deleteTestimonial",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete testimonial: ${response.status}`);
      }
      toast.success("Testimonial deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting testimonial: ${error.message}`);
      throw error;
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeTestimonials: [], // Separate list for home page testimonials
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Testimonials
      .addCase(fetchHomeTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.homeTestimonials = action.payload;
      })
      .addCase(fetchHomeTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Testimonial
      .addCase(fetchTestimonialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the testimonial in the list
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchTestimonialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default testimonialSlice.reducer;