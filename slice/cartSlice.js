import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Async thunk to add to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (payload , { dispatch }) => {
  try {
    const res = await fetch(`${process.env.API}/user/add-to-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Add to cart failed");
    toast.success("Item added to cart successfully!");
  
   dispatch(fetchCart()); // Fetch updated cart after adding
    return data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  try {
    const res = await fetch(`${process.env.API}/user/add-to-cart`);
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch cart");
    return data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId , { dispatch }   ) => {
    try {
      const res = await fetch(`${process.env.API}/user/cart/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove item");
      toast.success("Item removed from cart successfully!");
      dispatch(fetchCart());
      return itemId;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      toast.success("Cart cleared successfully!");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
