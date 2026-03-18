import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_USERS = async (data) => {
  return await REQUEST({
    method: "GET",
    url: "Auth?" + createQueryString(data),
  });
};
export const GET_USERS_ADMIN = async (data) => {
  return await REQUEST({
    method: "GET",
    url: "Auth/admin-sales?" + createQueryString(data),
  });
};
export const GET_USER_BY_ID = async (id) => {
  return await REQUEST({
    method: "GET",
    url: "Auth/" + id,
  });
};
export const GET_ROLES = async () => {
  return await REQUEST({
    method: "GET",
    url: "Auth/roles",
  });
};

export const EDIT_USER = async (data) => {
  // Check if Id exists and has a valid value for update vs register
  const isUpdate = data.Id && (typeof data.Id === 'string' ? data.Id.length > 1 : data.Id > 0);
  return await REQUEST({
    method: "POST",
    url: isUpdate ? "Auth/update" : "Auth/register",
    data,
  });
};

export const DELETE_USER = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "Auth/" + id,
  });
};

export const GET_BROKERS = async (data) => {
  return await REQUEST({
    method: "GET",
    url: "Broker?" + createQueryString(data)
  });
};
