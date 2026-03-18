import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_MEETING = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "Feedback/meeting/filter?" + createQueryString(data),
  });
};
export const EDIT_MEETING = async (data) => {
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "Meeting",
    data,
  });
};

export const DELETE_MEETING = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "Meeting/" + id,
  });
};
