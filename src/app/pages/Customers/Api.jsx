import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_CUSTOMERS = async (data) => {
  console.log(data);
  // return await REQUEST({
  //   method: "POST",
  //   url: "customers/pagination?" + createQueryString(data),
  // });
  return await REQUEST({
    method: "GET",
    url: "api/customers?" + createQueryString(data),
  });
};
export const EDIT_CUSTOMER = async (data) => {
  console.log(data);
  return await REQUEST({
    method: data.id > 0 ? "PUT" : "POST",
    url: "api/customer",
    data,
  });
};

export const DELETE_CUSTOMER = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "api/customer/" + id,
  });
};
