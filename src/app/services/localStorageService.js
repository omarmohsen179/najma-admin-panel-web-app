export function SetUserData(value) {
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  //new Date().setDate(new Date().getDate() + 7)
  localStorage.setItem("user", JSON.stringify(value));
}

export function GetUserToken() {
  const itemStr = localStorage.getItem("user");
  // if the item doesn't exist, return {}
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return {}
    localStorage.removeItem("user");
    return {};
  }
  return item.Token;
}
export function GetUserRoles() {
  const itemStr = localStorage.getItem("user");
  // if the item doesn't exist, return {}
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return {}
    localStorage.removeItem("user");
    return {};
  }
  return item.Roles;
}
export function RemoveUserData() {
  //alert("please refresh if it loading");

  console.log("remove - local");
  localStorage.removeItem("user");
}
export function StoreToLocalStorage(value) {
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    ...value,
    // expiry: new Date(expireOn).getTime(),
  };
  localStorage.setItem("user", JSON.stringify(item));
}

export function GetFromLocalStorage() {
  const key = "user";
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return {}
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return {}
    localStorage.removeItem(key);
    return null;
  }
  return item;
}
