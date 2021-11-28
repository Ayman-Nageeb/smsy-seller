<template>
  <v-navigation-drawer
    :mini-variant.sync="mini"
    permanent
    app
    primary
    :right="$t('direction').toLowerCase() == 'rtl'"
    :expand-on-hover="mode == 'auto'"
    mini-variant-width="72"
  >
    <v-divider class=""></v-divider>
    <v-list class="pa-0 ma-0">
      <v-list-item class="px-2" route :to="{ name: 'Home' }">
        <v-img :src="require('../../assets/ocean_logo.png')"></v-img>
      </v-list-item>
    </v-list>

    <v-list nav rounded color="primary--text">
      <protected-view
        v-for="(route, index) of routes"
        :key="index"
        :has="route.has ? route.has : []"
        :hasOneOf="route.hasOneOf ? route.hasOneOf : []"
      >
        <v-list-item route :to="{ name: route.name }">
          <v-list-item-icon>
            <v-icon>{{ route.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t(`navigation.drawer.${route.titleKey}`) }}</v-list-item-title>
        </v-list-item>
      </protected-view>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import navigationRouts from "./NavigationDrawerRoutes";
export default {
  props: {
    mode: {
      type: String,
      default: "auto",
    },
  },
  data() {
    return {
      drawer: true,
      mini: true,
      routes: navigationRouts,
    };
  },
  watch: {
    mode() {
      switch (this.mode) {
        case "opened":
          this.mini = false;
          break;
        case "minified":
          this.mini = true;
          break;
        case "auto":
          this.mini = false;
          break;
        default:
          break;
      }

      window.localStorage.setItem("NavigationDraweMode", this.mode);
    },
    mini() {
      if (this.mode == "minified") this.mini = true;
    },
  },
};
</script>

<style></style>
