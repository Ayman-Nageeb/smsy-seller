<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="300"
      offset-y
      class="pt-4"
      rounded="lg"
      open-on-hover
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="primary" dark v-bind="attrs" v-on="on">
          <v-icon dark>mdi-account-circle-outline</v-icon>
        </v-btn>
      </template>

      <v-card class="pa-0">
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item
              route
              :to="{
                name: 'Supervisors.show',
                params: {
                  user_name: $store.getters['Supervisors/supervisor'].user_name,
                },
              }"
            >
              <v-list-item-avatar>
                <v-icon size="50" color="primary">mdi-account-circle</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-bold"
                  >{{ $store.getters["Supervisors/supervisor"].name }}
                  <span class="font-weight-regular primary--text">
                    (@{{ $store.getters["Supervisors/supervisor"].user_name }})
                  </span>
                </v-list-item-title>

                <v-list-item-subtitle>{{
                  $t("appbar.go_to_your_profile")
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-divider></v-divider>

        <v-list class="">
          <v-list-item-group>
            <v-list-item
              v-for="(route, index) of routes"
              :key="index"
              route
              :to="route.route"
            >
              <v-list-item-icon>
                <v-icon size="36">{{ route.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ route.text }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon v-if="$t('direction').toLocaleLowerCase() == 'rtl'"
                  >mdi-chevron-left</v-icon
                >
                <v-icon v-else>mdi-chevron-right</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    routes: [],
  }),
  methods: {
    setRoutes() {
      let initialRoutes = [
        {
          text: this.$t("pages.logout.logout"),
          icon: "mdi-logout",
          route: "/logout",
        },
      ];

      for (let route of initialRoutes) {
        this.routes.push(route);
      }
    },
  },
  created() {
    this.setRoutes();
  },
};
</script>

<style></style>
