import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_ORIENTATION = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "Feedback/client/filter?" + createQueryString(data),
  });
};
export const EDIT_ORIENTATION = async (data) => {
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "Orientation",
    data,
  });
};

export const DELETE_ORIENTATION = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "Orientation/" + id,
  });
};
