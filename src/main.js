import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import FlashMessage from "@smartweb/vue-flash-message";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

import APIConfig from "./api/config";
import userConfig from "./config/index";

import ProtectedView from "./components/ProtectedView.vue";

APIConfig.setDefaults();
userConfig.loadConfig();

Vue.config.productionTip = false;

Vue.use(FlashMessage, { strategy: "multiple" });

export const mainEventBus = new Vue({ store });

Vue.component("protected-view", ProtectedView);
Vue.prototype.$permissions = () => {
  return mainEventBus.$store.getters["Supervisors/permissions"];
};
const vm = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
});

vm.$mount("#app");
