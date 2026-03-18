import REQUEST from "../../services/Request";

export const GROUP_PAY = async (e) => {
  console.log(e);
  return await REQUEST({
    method: "post",
    url: "ProductionOrderActions/groupPay",
    data: e,
  });
};
export const SET_SELL_PRICE = async (data) => {
  return await REQUEST({
    method: "post",
    url: "ProductionOrder/info",
    data,
  });
};
export const DELETE_ACTION = async (data) => {
  return await REQUEST({
    method: "DELETE",
    url: "ProductionOrderActions/" + data.Id,
    data,
  });
};
export const REORDER = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "StoreRequests/reOrder/" + id,
  });
};
