import REQUEST from "../../services/Request";
export const GET_INVOICES = async (data) => {
  return await REQUEST({
    method: "post",
    url: "Invoices/filter",
    data: data,
  });
};
export const EDIT_INVOICES = async (data) => {
  return await REQUEST({
    method: "PUT",
    url: "Invoices",
    data,
  });
};

export const DELETE_INVOICE = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "Invoices/" + id,
  });
};
