import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url } from "../components/common/api";
import { message } from "antd";
import axios from "axios";
import { Expand, getUser, userLogin } from "./authfunctions/userLogin";

const MOCK_PLACEHOLDER_TOKEN = "mock-token";

function safeJsonParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

const storedToken = localStorage.getItem("userToken");
const storedUserRaw = localStorage.getItem("user");
const storedSubscriptionRaw = localStorage.getItem("subscriptionData");

const hasRealToken = Boolean(storedToken && storedToken !== MOCK_PLACEHOLDER_TOKEN);
const storedUser = hasRealToken ? safeJsonParse(storedUserRaw) : null;
const storedSubscription = hasRealToken ? safeJsonParse(storedSubscriptionRaw) : null;

const initialState = {
  loading: false,
  columns: [],
  user: storedUser,
  userToken: hasRealToken ? storedToken : null,
  isAuthenticated: Boolean(hasRealToken && storedUser),
  subscriptionData: storedSubscription,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("subscriptionData");
      return {
        ...state,
        userToken: "",
        user: "",
        columns: [],

        loading: false,
        isAuthenticated: false,
        subscriptionData: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userToken = payload.accessToken;
        state.user = payload.user;
        state.subscriptionData = null;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userToken = null;
        state.user = null;
        state.subscriptionData = null;
      })

      //   get user
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.subscriptionData = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userToken = null;
        state.user = null;
        state.subscriptionData = null;
      });
  },
});

export const { logout } = userSlice.actions;

// export default userSlice.reducer;
export default userSlice.reducer;
