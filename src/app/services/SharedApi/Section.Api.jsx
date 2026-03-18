import REQUEST from "../Request";

export const ALL = async (page) => {
  return await REQUEST({
    method: "get",
    url: "All",
  });
};

export const CONTACT_US = async (page) => {
  return await REQUEST({
    method: "get",
    url: "ContactUs",
  });
};
