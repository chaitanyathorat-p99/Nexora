import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url } from "../../components/common/api";
import { message } from "antd";
import axios from "axios";
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${url}/auth/login`,
        { username, password },
        config
      );
      const token = data?.data?.token;
      const user = data?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      message.success("Login Successful");
      return {
        accessToken: token,
        user,
      };
    } catch (err) {
      console.log(err);
      message.error("Invalid Credentials");
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "api/account/me",
  async (_, thunkAPI) => {
    const access = localStorage.getItem("userToken");
    if (!access) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("No token");
    }
    try {
      const res = await fetch(`${url}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data?.data));
      if (res.status === 200) {
        return data?.data;
      } else {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const columnsRender = createAsyncThunk(
  "api/columns",
  async () => []
);

export const Expand = createAsyncThunk("expand", async (username, thunkAPI) => {
  try {
    // configure header's Content-Type as JSON
    return username;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});
