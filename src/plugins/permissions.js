import store from "../store";

const permissions = () => store.getters["Supervisors/permissions"];
const hasPermissions = (permissions) => {
  if (!permissions) return false;

  const supervisorPermissions = store.getters["Supervisors/permissions"];
  //if has no permission always return false
  if (supervisorPermissions.length == 0) return false;

  //check the required permissions one by one
  for (let permission of permissions) {
    //if permission does not exits return false
    if (supervisorPermissions.indexOf(permission) == -1) {
      return false;
    }
  }

  // this means all permissions exists
  return true;
};

const hasOneOfPermissions = (permissions) => {
  if (!permissions) return false;

  const supervisorPermissions = store.getters["Supervisors/permissions"];
  //if has no permission always return false
  if (supervisorPermissions.length == 0) return false;

  //check the required permissions one by one
  for (let permission of permissions) {
    //if permission exits return true
    if (supervisorPermissions.indexOf(permission) > -1) {
      return true;
    }
  }

  // this means no permissions exists
  return false;
};

export default {
  has: hasPermissions,
  hasOneOf: hasOneOfPermissions,
  permissions: permissions,
};
