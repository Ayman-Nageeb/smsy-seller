import store from "../store";
import api from "./index";


export const getCurrentSellerPermissions = async function() {
  const response = await api.get('/current-seller/permissions');
  return response;
};

let loadingCurrentSellerPermissions = false;
export const refreshCurrentSellerPermissions = async function() {
  if(loadingCurrentSellerPermissions) return;
  loadingCurrentSellerPermissions = true;
  if (!store.getters["Seller/isAuthenticated"]) return false;
  const response = await getCurrentSellerPermissions();
  const permissions = response.data.data;
  store.commit("Seller/setPermissions", permissions);
  loadingCurrentSellerPermissions = false;
};

export default {};