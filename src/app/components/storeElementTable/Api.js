import { createQueryString, mapArrayObject } from "app/services/SharedData";
import REQUEST from "../../services/Request";
export const GET_STORE_ELEMENTS_ELEMENTS_ALL = async (data) => {
  if (!data.SeasonYear) data.SeasonYear = 0;
  return await REQUEST({
    method: "post",
    url: "StoreElements/skip-and-take?" + createQueryString(data),
  });
};
export const GET_STORE_ELEMENTS_NEEDS_ELEMENTS_ALL = async (data) => {
  return await REQUEST({
    method: "get",
    url: "StoreElements/needs?" + createQueryString(data),
  });
};
export const EDIT_STORE_ELEMENTS = async (data) => {
  if (!data.SizeId) {
    data.SizeId = 0;
  }
  if (!data.DescriptionColorId) {
    data.DescriptionColorId = 0;
  }
  if (!data.StoreElementId) {
    data.StoreElementId = data?.Id;
  }
  if (!data.SupplierId) {
    data.SupplierId = 0;
  }
  data.Type = 1;
  return await REQUEST({
    method: "Put",
    url: "StoreElements",
    data: mapArrayObject("", data),
  });
};

export const ADD_STORE_ELEMENTS = async (data) => {
  if (!data.SizeId) {
    data.SizeId = 0;
  }
  if (!data.DescriptionColorId) {
    data.DescriptionColorId = 0;
  }
  if (!data.StoreElementId) {
    data.StoreElementId = data?.Id;
  }
  if (!data.SupplierId) {
    data.SupplierId = 0;
  }
  data.Type = 1;
  return await REQUEST({
    method: "Post",
    url: "StoreElements",
    data: mapArrayObject("", data),
  });
};
export const DELETE_STORE_ELEMENTS = async (data) => {
  return await REQUEST({
    method: "DELETE",
    url: "StoreElements/" + data,
  });
};
