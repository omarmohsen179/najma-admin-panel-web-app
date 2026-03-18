import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_CATEGORIES = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "api/content?" + createQueryString(data),
  });
};
export const EDIT_CATEGORY = async (data) => {
  return await REQUEST({
    method: data.id > 0 ? "PUT" : "POST",
    url: "api/content",
    data,
  });
};

export const DELETE_CATEGORY = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "api/content/" + id,
  });
};
