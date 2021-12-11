<template>
  <div>
    <router-view></router-view>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">SMS Packages</h2>
            <p class="my-2">SMS package and subscription bundles</p>
          </div>
          <add-form-route
            :has="['packages::add']"
            routeName="Packages.create"
          />
        </div>
      </v-col>
    </v-row>

    <v-row> </v-row>
    <protected-view :has="['packages::retrieve']">
      <list-sms-packages />
    </protected-view>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import ListSmsPackages from "../../components/packages/ListSmsPackages.vue";
import ProtectedView from "../../components/ProtectedView.vue";
export default {
  components: { AddFormRoute, ListSmsPackages, ProtectedView },
  created() {
    this.$permissions().authorizeOneOf([
      "packages::add",
      "packages::remove",
      "packages::retrieve",
      "packages::update",
      "packages::view_sellers",
      "packages::set_sellers",
      "packages::view_groups",
      "packages::set_groups",
    ]);
  },
};
</script>

<style></style>
