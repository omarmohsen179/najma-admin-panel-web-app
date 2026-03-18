import axios from "axios";
import { ApiBaseUrl } from "./config";
import { RemoveUserData } from "./localStorageService";
export const client = axios.create({
  baseURL: ApiBaseUrl + "/api/",
});
const REQUEST = function (options) {
  const onSuccess = function (response) {
    return response.data;
  };
  const onError = function (error) {
    console.error("Request Failed:", error.config);

    if (error.response) {
      if (error.response.status === 401) {
        RemoveUserData();
        window.href = "/session/signin";
      }
    }

    return Promise.reject(error.response.data);
  };

  return client({
    ...options,
    headers: {
      ...axios.defaults.headers,
    },
  })
    .then(onSuccess)
    .catch(onError);
};

export default REQUEST;
