<template>
  <div>
    <router-view></router-view>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.roles.title") }}</h2>
            <p class="my-2">{{ $t("pages.roles.subtitle") }}</p>
          </div>
          <add-form-route :has="['roles::add']" routeName="Roles.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['roles::retrieve']">
          <roles-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import RolesList from "../../components/roles/rolesList.vue";
export default {
  components: { AddFormRoute, RolesList },
  async created() {
    this.$permissions().authorizeOneOf([
      "roles::add",
      "roles::remove",
      "roles::retrieve",
      "roles::update",
      "roles::view_permissions",
      "roles::set_permissions",
    ]);
    await this.loadRoles();
  },
  data() {
    return {
      filterQuery: "",
    };
  },
  mounted() {
    // this.authorize();
  },
  methods: {
    authorize() {
      const permissions = [
        "roles::add",
        "roles::remove",
        "roles::retrieve",
        "roles::update",
        "roles::view_permissions",
        "roles::set_permissions",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadRoles() {},
  },
};
</script>

<style></style>
