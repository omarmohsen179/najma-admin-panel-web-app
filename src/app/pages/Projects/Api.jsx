import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_PROJECTS = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "project?" + createQueryString(data),
  });
};
export const EDIT_PROJECT = async (data) => {
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "project",
    data,
  });
};

export const DELETE_PROJECT = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "project/" + id,
  });
};
