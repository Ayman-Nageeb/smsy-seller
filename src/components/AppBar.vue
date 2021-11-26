<template>
  <v-app-bar elevate-on-scroll app flat >
    <v-app-bar-nav-icon color="primary"> </v-app-bar-nav-icon>

    <div>
      <router-link :to="{ name: 'Home' }">
        <v-img :src="require('../assets/ocean_logo.png')"></v-img>
      </router-link>
    </div>
    <v-spacer></v-spacer>
    
    <lang-switch />
    <v-btn text icon color="primary" class="mx-2"  @click="toggleTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <profile />
  </v-app-bar>
</template>

<script>
import { mainEventBus } from '../main';
import LangSwitch from "./appbar/LangSwitch.vue";
import Profile from "./appbar/Profile.vue";
export default {
  components: { Profile, LangSwitch },
  methods: {
    toggleTheme() {
      mainEventBus.$emit("toggleTheme");
    },
  },
};
</script>

<style></style>
