export default {
  setAsAuthenticated(state) {
    state.isAuthenticated = true;
  },
  setAsUnAuthenticated(state) {
    state.isAuthenticated = false;
  },
  setSupervisor(state, supervisor) {
    state.supervisor = supervisor;
  },
  setAuthorizationToken(state, token) {
    state.authorizationToken = token;
  },
};
