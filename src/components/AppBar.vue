<template>
  <v-app-bar elevate-on-scroll app flat outlined>
    <v-app-bar-nav-icon color="primary">

    </v-app-bar-nav-icon>

    <div>
      <router-link :to="{ name: 'Home' }">
        <v-img :src="require('../assets/ocean_logo.png')"></v-img>
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <lang-switch class="mx-2" />
    <profile />
  </v-app-bar>
</template>

<script>
import LangSwitch from './appbar/LangSwitch.vue';
import Profile from "./appbar/Profile.vue";
export default {
  components: { Profile, LangSwitch },
};
</script>

<style></style>
