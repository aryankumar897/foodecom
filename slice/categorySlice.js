// slice/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single category by ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading category: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all categories (admin)
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading categories: ${error.message}`);
      throw error;
    }
  }
);

// Fetch categories for home page
export const fetchHomeCategories = createAsyncThunk(
  "categories/fetchHomeCategories",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading categories: ${error.message}`);
      throw error;
    }
  }
);

// Create new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Category created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating category: ${error.message}`);
      throw error;
    }
  }
);

// Update existing category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status}`);
      }
      const data = await response.json();
      toast.success("Category updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating category: ${error.message}`);
      throw error;
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status}`);
      }
      toast.success("Category deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeCategories: [], // Separate list for home page categories
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Home Categories
      .addCase(fetchHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.homeCategories = action.payload;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Category
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the category in the list
        const index = state.list.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;