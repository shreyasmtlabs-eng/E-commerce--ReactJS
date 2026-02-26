import  { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction} from '@reduxjs/toolkit'

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
    image: string;
};

const initialState: { cartItem: CartItem[] } = {
  cartItem: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const product = action.payload;

      const existingItem = state.cartItem.find(
        item => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItem.push({ ...product, quantity: 1 });
      }
    },

    increaseQty: (state, action: PayloadAction<number>) => {
      const item = state.cartItem.find( item => item.id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQty: (state, action: PayloadAction<number>) => {
      const item = state.cartItem.find(
        item => item.id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItem = state.cartItem.filter(
        item => item.id !== action.payload
      );
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;