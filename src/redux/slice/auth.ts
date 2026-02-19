import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  gender: string;
  password: string;
  dob: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  description: string;
}

interface AuthState {
  users: User[];
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  users: [],
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerSuccess: (state, action: PayloadAction<User>) => {
         console.log("Register:>>>>>>>", action.payload);

      const exists = state.users.find(
        (u) => u.email === action.payload.email
      );

      if (!exists) {
        state.users.push(action.payload);
           console.log(" User registered:>>>>>>", action.payload);
      }
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {


      console.log(" Login:>>>>>>", action.payload);
      console.log(" User:>>>>>", action.payload.user);
      console.log(" Token:>>>>", action.payload.token);

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

       console.log(" Updated Auth State:>>>", {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      });
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

       console.log(" after logout:", {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
  });

    },

  },
});

export const { loginSuccess, logout, registerSuccess } =
  authSlice.actions;

export default authSlice.reducer;
