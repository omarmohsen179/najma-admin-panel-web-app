import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_CUSTOMERS = async (data) => {
  return await REQUEST({
    method: "post",
    url: "customer/pagination?" + createQueryString(data),
  });
};

export const EDIT_CUSTOMERS = async (data) => {
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "customer",
    data,
  });
};

export const DELETE_CUSTOMERS = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "customer/" + id,
  });
};

export const GET_SUPPLIERS = async (data) => {
  return await REQUEST({
    method: "post",
    url: "supplier/pagination?" + createQueryString(data),
  });
};
export const GET_SUPPLIER_BY_ID = async (id) => {
  return await REQUEST({
    method: "GET",
    url: "supplier/" + id,
  });
};
export const EDIT_SUPPLIER = async (data) => {
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "supplier",
    data,
  });
};

export const DELETE_SUPPLIER = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "supplier/" + id,
  });
};
