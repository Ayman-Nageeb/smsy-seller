import router from "../../../router/index";

export default {
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  supervisor(state) {
    return state.supervisor;
  },
  authorizationToken(state) {
    return state.authorizationToken;
  },
  permissions(state) {
    return {
      all: state.permissions,
      has: function(permissions) {
        if (!permissions) return false;

        const supervisorPermissions = state.permissions;
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
      },
      hasOneOf: function(permissions) {
        if (!permissions) return false;

        const supervisorPermissions = state.permissions;
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
      },
      authorize: function(permissions) {
        if (!this.has(permissions)) {
          router.push({ name: "Unauthorized" });
        }
      },
      authorizeOneOf: function(permissions) {
        if (!this.hasOneOf(permissions)) {
          router.push({ name: "Unauthorized" });
        }
      },
    };
  },
};
