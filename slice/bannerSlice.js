// slice/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single banner by ID
export const fetchBannerById = createAsyncThunk(
  "banners/fetchBannerById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/banners/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch banner: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading banner: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all banners (admin)
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/banners`);
      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading banners: ${error.message}`);
      throw error;
    }
  }
);

// Fetch banners for home page
export const fetchHomeBanners = createAsyncThunk(
  "banners/fetchHomeBanners",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/banners`);
      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading banners: ${error.message}`);
      throw error;
    }
  }
);

// Create new banner
export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (bannerData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create banner: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Banner created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating banner: ${error.message}`);
      throw error;
    }
  }
);

// Update existing banner
export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async ({ id, bannerData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update banner: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Banner updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating banner: ${error.message}`);
      throw error;
    }
  }
);

// Delete banner
export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/banners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete banner: ${response.status}`);
      }
      toast.success("Banner deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting banner: ${error.message}`);
      throw error;
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeBanners: [], // Separate list for home page banners
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Banners
      .addCase(fetchHomeBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.homeBanners = action.payload;
      })
      .addCase(fetchHomeBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Banner
      .addCase(fetchBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the banner in the list
        const index = state.list.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
