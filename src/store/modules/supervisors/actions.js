import config from "../../../api/config";
import { refreshCurrentSupervisorPermissions } from "../../../api/supervisors";

export default {
  async login(context, payload) {
    context.commit("setAuthorizationToken", payload.token);
    context.commit("setSupervisor", payload.supervisor);
    context.commit("setAsAuthenticated");

    window.localStorage.setItem("authorizationToken", payload.token);
    window.localStorage.setItem(
      "supervisor",
      JSON.stringify(payload.supervisor)
    );

    config.setAuthorizationHeader(payload.token);
    await refreshCurrentSupervisorPermissions();
  },
  logout(context) {
    context.commit("setAuthorizationToken", null);
    context.commit("setSupervisor", null);
    context.commit("setAsUnAuthenticated");

    window.localStorage.removeItem("authorizationToken");
    window.localStorage.removeItem("supervisor");

    config.setAuthorizationHeader("");
  },
};
