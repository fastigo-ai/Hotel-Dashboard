// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProperties,
  getPropertyDetail,
  deletePropertyById
} from "../api/API";

// Thunks using API
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => await getAllProperties()
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchOne",
  async (id) => await getPropertyDetail(id)
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id) => await deletePropertyById(id)
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    updateProductLocally: (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log(action.payload);
        
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct, updateProductLocally } = productSlice.actions;
export default productSlice.reducer;
