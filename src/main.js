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

import userConfig from './config/index';
import permissions from "./plugins/permissions";

userConfig.loadConfig();
APIConfig.setDefaults();


Vue.config.productionTip = false;

Vue.use(FlashMessage, {strategy: 'multiple'});
Vue.use(permissions, {});

export const mainEventBus = new Vue({store});

Vue.prototype.$permissions = Vue.observable(permissions);


let vm = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

vm.$data.$permissions = Vue.observable(permissions);