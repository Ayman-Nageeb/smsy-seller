<template>
  <v-app>
    
    <app-bar v-if="showAppBar"></app-bar>
    <v-main id="main-area">
      <router-view class="pa-4" />
    </v-main>
  </v-app>
</template>c

<script>
import { mainEventBus } from "./main";
import userConfig from "./config/index";

import AppBar from "./components/AppBar.vue";

export default {
  name: "App",
  components: { AppBar },
  data: () => ({
    //
  }),
  computed: {
    showAppBar() {
      return this.$store.getters["Supervisors/isAuthenticated"];
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.$vuetify.rtl = this.$t("direction") == "rtl";
      window.localStorage.setItem("locale", locale);
      this.$forceUpdate();
      // window.location.reload();
    },

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      window.localStorage.setItem(
        "isDarkTheme",
        Number(this.$vuetify.theme.dark)
      );
    },
  },
  created() {
    userConfig.loadTheme(this.$vuetify);
    mainEventBus.$on("toggleTheme", this.toggleTheme);

    mainEventBus.$on("changeLocale", this.changeLocale);
  },
};
</script>
