import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_SESSION_LOGS = async (data) => {
  return await REQUEST({
    method: "GET",
    url: "SessionLog/admin/sessions?" + createQueryString(data),
  });
};

export const GET_SESSION_ANALYTICS = async (data) => {
  return await REQUEST({
    method: "GET",
    url: "SessionLog/admin/analytics?" + createQueryString(data),
  });
};

export const GET_USER_STATS = async (userId) => {
  return await REQUEST({
    method: "GET",
    url: `SessionLog/admin/user-stats/${userId}`,
  });
};


