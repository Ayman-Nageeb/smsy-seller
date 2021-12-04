import store from "../store";
import api from "./index";

export const BaseURL = "supervisors/";
export const loginURL = BaseURL + "login/";
export const logoutURL = BaseURL + "logout/";
export const systemPermissionsURL = BaseURL + "permissions/";
export const permissionsURL = (supervisorId) => {
  return BaseURL + `${supervisorId}/permissions`;
};

export const currentSupervisorPermissionsURL = () => {
  let supervisorId = "un_authenticated_" + Math.random();
  if (store.getters["Supervisors/isAuthenticated"]) {
    supervisorId = store.getters["Supervisors/supervisor"].id;
  }
  return permissionsURL(supervisorId);
};

export const login = async function(data) {
  const response = await api.post(loginURL, data);
  return response;
};

export const logout = async function(tokens = null) {
  if (!tokens) tokens = "current";

  const response = await api.get(logoutURL, tokens);
  return response;
};

export const getCurrentSupervisorPermissions = async function() {
  const response = await api.get(currentSupervisorPermissionsURL());
  return response;
};

export const refreshCurrentSupervisorPermissions = async function() {
  if (!store.getters["Supervisors/isAuthenticated"]) return false;
  const response = await getCurrentSupervisorPermissions();
  const permissions = response.data.data.permissions;
  store.commit("Supervisors/setPermissions", permissions);
};

export const getSystemPermissions = async function() {
  const response = await api.get(systemPermissionsURL);
  return response;
};

export default {};
