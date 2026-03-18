import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl } from "../services/config";

import {
  ModelGroupStates,
  RecipeTypes,
  elements,
  seasonData,
} from "../services/SharedData";
import { RemoveUserData } from "../services/localStorageService";

// Calling API
// export const getData = createAsyncThunk(
//   "data/getData",
//   async (arg, { dispatch, getState }) => {
//     return axios({
//       url: `${ApiBaseUrl}/api/StoreLogs/data`,
//       method: "GET",
//     })
//       .then(({ data }) => {
//         return {
//           ...data,
//           seasonData: seasonData,
//           Elements: elements,
//           RecipeTypes: RecipeTypes,
//           ModelGroupStates: ModelGroupStates,
//           // UserElements: elements.filter((e) =>
//           //   data.UserElements.map((e) => +e).includes(e.Id)
//           // ),
//         };
//       })
//       .catch((error) => {
//         // notify("Error in information. try again!", "error", 3000);
//         dispatch(getData.rejected(error.response.status));
//       });
//   }
//);

// Create Slice
const DataReducer = createSlice({
  name: "data",
  initialState: {
    lookups: null,
    failed: false,
    loggedIn: false,
    //  date: new date(),
  },
  reducers: {},
  extraReducers: {
    // auth/register
    // [getData.pending](state, action) {
    //   state.lookups = null;
    // },
    // [getData.fulfilled](state, { payload }) {
    //   state.lookups = payload;
    //   // state.date = new date();
    // },
    // [getData.rejected](state, error) {
    //   console.log(error.error.message);
    //   // if (error.error.message == 401 || error.error.message == 400) {
    //   //   RemoveUserData();
    //   //   window.href = "/login";
    //   //   state.failed = true;
    //   // }
    //   RemoveUserData();
    //   window.href = "#/login";
    //   state.failed = true;
    //   state.lookups = null;
    // },
  },
});

// Export Selectors
export const data = DataReducer.reducer;

export const data_selector = (state) => {
  return state.data.lookups;
};
export const data_failed = (state) => {
  return state.data.failed;
};
export const get_name = (data, args, i18n) => {
  try {
    const res = data?.find((e) => e.Id == args);
    if (i18n) {
      return i18n?.language === "ar"
        ? res[Object.keys(res).find((e) => e.includes("Name"))]
        : res[Object.keys(res).find((e) => e.includes("NameEn"))];
    }

    return res != null
      ? res[Object.keys(res).find((e) => e.includes("Name"))]
      : "";
  } catch (err) {
    return "";
  }
};
export const get_obj = (data, args) => {
  try {
    const res = data?.find((e) => e.Id == args);
    return res;
  } catch (err) {
    return "";
  }
};
export const get_element_name = (data, type, Id) => {
  try {
    // const res =
    //   type == 0
    //     ? data.Accessories?.find((e) => e.Id == Id)
    //     : type == 1
    //     ? data.Items?.find((e) => e.Id == Id)
    //     : data.Models?.find((e) => e.Id == Id);
    const res = data.Items?.find((e) => e.Id == Id);
    return res != null ? res.ElementName : "";
  } catch (err) {
    return "";
  }
};
export const get_element_obj = (data, type, Id) => {
  try {
    const res =
      type == 0
        ? data.Accessories?.find((e) => e.Id == Id)
        : type == 1
        ? data.Items?.find((e) => e.Id == Id)
        : data.Models?.find((e) => e.Id == Id);

    return res != null ? res : null;
  } catch (err) {
    return "";
  }
};
