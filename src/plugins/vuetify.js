import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

import * as locales from "vuetify/lib/locale/index"

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: locales,
    current: process.env.VUE_APP_I18N_LOCALE || 'en',
  },
  theme: {
    themes: {
      light: {
        primary: "#2a5c93",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
