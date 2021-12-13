import store from "../store";
import api from "./index";

export const BaseURL = "supervisors/";
export const loginURL = BaseURL + "login/";
export const logoutURL = BaseURL + "logout/";
export const supervisorUrl = (id) => BaseURL + id + "/";
export const supervisorRolesUrl = (id) => supervisorUrl(id) + "roles/";
export const supervisorPermissionsUrl = (id) =>
  supervisorUrl(id) + "permissions/";
export const suspendSupervisorUrl = (id) => supervisorUrl(id) + "suspend/";
export const activateSupervisorUrl = (id) => supervisorUrl(id) + "activate/";
export const resetSupervisorPasswordUrl = (id) =>
  supervisorUrl(id) + "reset-password/";
export const systemPermissionsURL = BaseURL + "permissions/";

export const permissionsURL = (supervisorId) => {
  return BaseURL + `${supervisorId}/permissions`;
};

export const currentSupervisorPermissionsURL = () => {
  let supervisorId = "un_authenticated_" + Math.random();
  if (store.getters["Seller/isAuthenticated"]) {
    supervisorId = store.getters["Seller/seller"].id;
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

let loadingCurrentSupervisorPermissions = false;
export const refreshCurrentSupervisorPermissions = async function() {
  if(loadingCurrentSupervisorPermissions) return;
  loadingCurrentSupervisorPermissions = true;
  if (!store.getters["Seller/isAuthenticated"]) return false;
  const response = await getCurrentSupervisorPermissions();
  const permissions = response.data.data;
  store.commit("Seller/setPermissions", permissions);
  loadingCurrentSupervisorPermissions = false;
};

export const getSystemPermissions = async function() {
  const response = await api.get(systemPermissionsURL);
  return response;
};

export const getAllSupervisors = async function(withRoles) {
  const params = withRoles ? { with_roles: Number(withRoles) } : null;
  const response = await api.get(BaseURL, params);
  return response;
};

export const addSupervisor = async function(name, userName, password = null) {
  const data = {};
  data.name = name;
  data.user_name = userName;
  if (password) data.password = password;
  const response = await api.post(BaseURL, data);
  return response;
};

export const setRoles = async function(supervisorId, roles) {
  const response = await api.post(supervisorRolesUrl(supervisorId), { roles });
  return response;
};

export const syncRoles = async function(supervisorId, roles) {
  const response = await api.post(
    supervisorRolesUrl(supervisorId),
    { roles },
    { sync: 1 }
  );
  return response;
};

export const getSupervisor = async function(supervisorId, with_roles = false) {
  const response = await api.get(supervisorUrl(supervisorId), {
    with_roles: Number(with_roles),
  });
  return response;
};

export const getSupervisorRoles = async function(supervisorId) {
  const response = await api.get(supervisorRolesUrl(supervisorId));
  return response;
};

export const getSupervisorPermissions = async function(supervisorId) {
  const response = await api.get(supervisorPermissionsUrl(supervisorId));
  return response;
};

export const removeSupervisor = async function(supervisorId) {
  const response = await api.delete(supervisorUrl(supervisorId));
  return response;
};

export const suspendSupervisor = async function(supervisorId) {
  const response = await api.post(suspendSupervisorUrl(supervisorId));
  return response;
};

export const activateSupervisor = async function(supervisorId) {
  const response = await api.post(activateSupervisorUrl(supervisorId));
  return response;
};

export const resetSupervisorPassword = async function(supervisorId) {
  const response = await api.post(resetSupervisorPasswordUrl(supervisorId));
  return response;
};
export default {};
