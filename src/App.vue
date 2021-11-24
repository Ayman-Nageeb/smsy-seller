<template>
  <v-app>
    <app-bar v-if="showAppBar"></app-bar>
    <v-main id="main-area">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mainEventBus } from "./main";
import AppBar from './components/AppBar.vue';

export default {
  name: "App",
  components: {AppBar},
  data: () => ({
    //
  }),
  computed: {
    showAppBar(){
      return this.$store.getters["Supervisors/isAuthenticated"];
    }
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.$vuetify.rtl = this.$t("direction") == "rtl";
      window.localStorage.setItem("locale", locale);
      this.$forceUpdate();
      // window.location.reload();
    },
  },
  created() {
    mainEventBus.$on("changeLocale", (locale) => {
      this.changeLocale(locale);
    });
  },
};
</script>
