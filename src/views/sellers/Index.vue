<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">
              {{ $t("pages.sellers.title") }}
            </h2>
            <p class="my-2">{{ $t("pages.sellers.subtitle") }}</p>
          </div>
          <add-form-route :has="['sellers::add']" routeName="Sellers.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['sellers::retrieve']">
          <sellers-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Sugar from "sugar";
import AddFormRoute from "../../components/AddFormRoute.vue";
import SellersList from "../../components/sellers/sellersList.vue";
import ProtectedView from "../../components/ProtectedView.vue";
export default {
  components: { AddFormRoute, SellersList, ProtectedView },
  methods: {
    showDate() {
      alert(Sugar.Date().relative());
    },
  },
  created() {
    this.$permissions().authorizeOneOf([
      "supervisors::add",
      "supervisors::remove",
      "supervisors::retrieve",
      "supervisors::update",
      "supervisors::view_role",
      "supervisors::set_role",
      "supervisors::revoke_role",
      "supervisors::view_permissions",
    ]);
  },
};
</script>

<style></style>
