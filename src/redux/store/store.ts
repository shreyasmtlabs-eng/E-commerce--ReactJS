import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth";
import productReducer from "../slice/product";



const loadState = () => {
  try {
    const serialized = localStorage.getItem("reduxState");
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state", err);
  }
};



export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },

preloadedState: loadState(),

});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


