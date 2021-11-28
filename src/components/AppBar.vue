<template>
  <div>
    <v-app-bar elevate-on-scroll app flat style="border-bottom: 1px solid #ccc">

      

      <v-btn icon color="primary" @click="toggleMode" v-if="mode != 'auto'">
        <v-icon v-text="navigatorIcon"></v-icon>
      </v-btn>
      <span class="mx-1"></span>
      <v-btn rounded color="primary" @click="toggleAutoMode" :icon="mode != 'auto'">
        <v-icon>mdi-auto-fix</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <lang-switch />
      <v-btn text icon color="primary" class="mx-2" @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <profile />
    </v-app-bar>

    <navigation-drawer :mode="mode" />
  </div>
</template>

<script>
import { mainEventBus } from "../main";
import LangSwitch from "./appbar/LangSwitch.vue";
import NavigationDrawer from "./appbar/NavigationDrawer.vue";
import Profile from "./appbar/Profile.vue";
export default {
  components: { Profile, LangSwitch, NavigationDrawer },
  props: {},
  data() {
    return {
      mode: "auto",
    };
  },
  created() {
    if (window.localStorage.getItem("NavigationDraweMode")) {
      this.mode = window.localStorage.getItem("NavigationDraweMode");
    }
  },
  computed: {
    navigatorIcon() {
      switch (this.mode) {
        case "minified":
          return "mdi-menu-open mdi-rotate-180";
        case "opened":
          return "mdi-menu-open mdi-rotate-0";
        case "auto":
          return "mdi-playlist-star";
        default:
          return "mdi-cancel";
      }
    },
  },
  methods: {
    toggleTheme() {
      mainEventBus.$emit("toggleTheme");
    },
    toggleMode() {
      if (this.mode != "opened") {
        this.mode = "opened";
      } else this.mode = "minified";
    },
    toggleAutoMode() {
      if (this.mode == "auto") {
        this.mode = "opened";
      } else this.mode = "auto";
    },
  },
};
</script>

<style scoped></style>
