import {createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category:string;
};

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
    name:"wishlist",
    initialState,
    reducers: {
        addToWishlist : (state,action: PayloadAction<Product>) =>{
            const exists = state.items.find((item) => item.id === action.payload.id);
        
            if(!exists){
                state.items.push(action.payload);
            }
        },

  removeFromWishlist: (state, action: PayloadAction<number>) => {
  state.items = state.items.filter((item) => item.id !== action.payload);
},
},
    })

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
