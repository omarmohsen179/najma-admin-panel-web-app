import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_BRANDS = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "api/users/brands?" + createQueryString(data),
  });
};
export const EDIT_BRAND = async (data) => {
  return await REQUEST({
    method: data.id > 0 ? "PUT" : "POST",
    url: "api/brands",
    data,
  });
};

export const DELETE_BRAND = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "api/brands/" + id,
  });
};
