import { mainEventBus } from "../main";
import VueI18n from "../i18n";
import store from "../store";

export default {
  loadConfig() {
    this.loadLocale();
    this.loadUser();
  },
  loadLocale() {
    if (window.localStorage.getItem("locale")) {
      const locale = window.localStorage.getItem("locale");
      if (VueI18n.locale != locale) {
        mainEventBus.$emit("changeLocale", locale);
      }
    }
  },
  loadUser() {
    try {
      if (
        window.localStorage.getItem("authorizationToken") &&
        window.localStorage.getItem("supervisor")
      ) {
        const token = window.localStorage.getItem("authorizationToken");
        const supervisor = JSON.parse(
          window.localStorage.getItem("supervisor")
        );
        const userPayload = {
          token,
          supervisor,
        };
        store.dispatch("Supervisors/login", userPayload);
      }
    }catch(error){
      console.error(error);
      store.dispatch("Supervisors/logout");
    }
  },
};
