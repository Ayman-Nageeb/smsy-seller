import api from "./index";

export const BaseURL = "roles/";
export const editURL = (id) => BaseURL + id + "/";
export const deleteURL = (id) => BaseURL + id;

export const getAllRoles = async function(
  withPermissions = false,
  withSupervisors = false
) {
  const response = await api.get(BaseURL, {
    with_permissions: Number(withPermissions),
    with_supervisors: Number(withSupervisors),
  });
  return response;
};

export const addRole = async function(name, permissions) {
  const data = { name, permissions };
  const response = api.post(BaseURL, data);
  return response;
};

export const removeRole = async function(id) {
  const response = api.delete(deleteURL(id));
  return response;
};

export const updateRolePermissions = async function(id, permissions) {
  const response = api.put(editURL(id), { permissions });
  return response;
};
