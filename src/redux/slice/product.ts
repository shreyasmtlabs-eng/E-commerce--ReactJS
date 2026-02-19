import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api/api";

 export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
    description?: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;        
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};


export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const res = await api.get("/products");
    return res.data;
  }
);

export const updateAPIProducts = createAsyncThunk(
  "products/updateApi",
  async (product: Product) => {
    
    // const res = await api.put(`/products/${product.id , product}`);
    const res = await api.put(`/products/${product.id}`, product);

    console.log(" UPDATE API:>>>>>>>", res.data);
    return res.data;
  }
);

export const deleteAPIProducts = createAsyncThunk(
  "products/delete",
  async (id) => {
    
    const res = await api.delete(`/products/${id}`);
     console.log(" DELETE API:>>>>>", res.data);
    return res.data;
  }
);


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
     addProduct: (state, action: PayloadAction<Product>) => {
        console.log("Redux add:>>>>", action.payload);

      state.products.unshift(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
       console.log(" Redux update:>>>>>", action.payload);
      const index = state.products.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    deleteProduct: (state, action: PayloadAction<number>) => {
        console.log(" Redux delete:>>>>>>", action.payload);
      state.products = state.products.filter(
        (p) => p.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load products";
      });
  },
});
export const {
  addProduct,
  updateProduct,
  deleteProduct,
} = productSlice.actions;
export default productSlice.reducer;
