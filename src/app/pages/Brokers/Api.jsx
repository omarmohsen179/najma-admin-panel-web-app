import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_BROKERS = async (query) => {
  return await REQUEST({
    method: "GET",
    url: "Broker?" + createQueryString(query),
  });
};

export const EDIT_BROKER = async (data) => {

  return await REQUEST({
    method: data.Id >0 ? "PUT" : "POST",
    url: "Broker",
    data,
  });
};

export const DELETE_BROKER = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "Broker/" + id,
  });
};

