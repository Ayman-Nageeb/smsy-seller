import config from "../../../api/config";
import { refreshCurrentSellerPermissions } from "../../../api/seller";

export default {
  async login(context, payload) {
    context.commit("setAuthorizationToken", payload.token);
    context.commit("setSeller", payload.seller);
    context.commit("setAsAuthenticated");

    window.localStorage.setItem("authorizationToken", payload.token);
    window.localStorage.setItem(
      "seller",
      JSON.stringify(payload.seller)
    );

    config.setAuthorizationHeader(payload.token);
    await refreshCurrentSellerPermissions();
  },
  logout(context) {
    context.commit("setAuthorizationToken", null);
    context.commit("setSeller", null);
    context.commit("setAsUnAuthenticated");

    window.localStorage.removeItem("authorizationToken");
    window.localStorage.removeItem("seller");

    config.setAuthorizationHeader("");
  },
};
