export default {
  setAsAuthenticated(state) {
    state.isAuthenticated = true;
  },
  setAsUnAuthenticated(state) {
    state.isAuthenticated = false;
  },
  setSeller(state, seller) {
    state.seller = seller;
  },
  setAuthorizationToken(state, token) {
    state.authorizationToken = token;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
  
};
