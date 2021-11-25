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
  permissions(state)
  {
    return state.permissions ;
  }
};
