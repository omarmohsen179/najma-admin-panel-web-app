import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import notify from "devextreme/ui/notify";

import {
  RemoveUserData,
  StoreToLocalStorage,
} from "../services/localStorageService";
import REQUEST from "../services/Request";

// Calling API

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (arg, { dispatch, getState }) => {
    return await REQUEST({
      method: "post",
      url: "auth/login",
      data: arg,
    })
      .then((data) => {
        StoreToLocalStorage(data);
        return { ...data };
      })
      .catch((error) => {
        dispatch(userLogin.rejected(error.response?.data ?? error));
      });
  }
);

export const userLoginLocalStorage = createAsyncThunk(
  "auth/userLoginLocalStorage",
  async (arg, { dispatch, getState }) => {
    if (arg == null) {
      RemoveUserData();
    }
    return arg;
  }
);

// Create Slice
const AuthReducer = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    // auth/signOut
    signOut(state, { payload }) {
      RemoveUserData();
      state.user = null;
    },
  },
  extraReducers: {
    [userLogin.pending](state, action) {
      state.loading = true;
    },
    [userLogin.fulfilled](state, { payload }) {
      console.log(payload);
      if (payload) {
        axios.defaults.headers = {
          ...axios.defaults.headers,
          Authorization: `bearer ${payload.Token}`,
        };
        state.user = payload;
      }
      state.loading = false;
    },
    [userLogin.rejected](state, action) {
      notify(action.error?.message ?? "Error occured ..", "error", 3000);
      state.loading = false;
    },
    [userLoginLocalStorage.pending](state, action) {
      state.loading = true;
    },
    [userLoginLocalStorage.fulfilled](state, { payload }) {
      if (payload) {
        state.user = payload;
        axios.defaults.headers = {
          ...axios.defaults.headers,
          Authorization: `bearer ${payload.Token}`,
        };
        if (payload.Username) {
          notify(`${payload.Username} Logged in successfully`, "success", 3000);
        }
      }
      state.loading = false;
    },
    [userLoginLocalStorage.rejected](state, action) {
      notify(action.error?.message ?? "Error occured ..", "error", 3000);
      state.loading = false;
    },
  },
});

// Export Selectors
export const auth = AuthReducer.reducer;

export const { signOut } = AuthReducer.actions;

export const user_selector = (state) => {
  return state.auth.user;
};

export const auth_loading = (state) => {
  return state.auth.loading;
};
