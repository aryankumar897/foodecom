// slice/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ------------------- Fetch single blog by ID -------------------
export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blogs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading blog: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Fetch all blogs (admin) -------------------
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/blogs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading blogs: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Fetch blogs for home page -------------------
export const fetchHomeBlogs = createAsyncThunk(
  "blogs/fetchHomeBlogs",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/blogs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading blogs: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Create new blog -------------------
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create blog: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Blog created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating blog: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Update blog -------------------
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update blog: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Blog updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating blog: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Delete blog -------------------
export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blogs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete blog: ${response.status}`);
      }
      toast.success("Blog deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting blog: ${error.message}`);
      throw error;
    }
  }
);

// ------------------- Slice -------------------
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeBlogs: [], // Separate list for home page blogs
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Blogs (Admin)
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Blogs
      .addCase(fetchHomeBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.homeBlogs = action.payload;
      })
      .addCase(fetchHomeBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Blog
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default blogSlice.reducer;
