import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload.user;

      state.user = user;
      state.token = action.payload.token;
      state.userId = user?.sub || null;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", user?.sub || "");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      // Clear user data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
