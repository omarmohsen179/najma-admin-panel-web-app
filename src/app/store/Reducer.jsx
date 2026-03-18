import { combineReducers } from "redux";
import { auth } from "./AuthReducer";
import { data } from "./DataReducer";

export default combineReducers({
  auth: auth,
  data: data,
});
