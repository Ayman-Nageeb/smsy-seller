<template>
  <div>
    <h2 class="display-2">{{ $t("pages.roles.title") }}</h2>
    <p class="my-2">{{ $t("pages.roles.subtitle") }}</p>
    <v-row>
      <v-col>
        <search-field v-model="filterQuery" />
      </v-col>
      <v-col>
        <add-form-route :has="['roles::add']" routeName="Roles.add" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from '../components/AddFormRoute.vue';
import searchField from "../components/searchField.vue";
export default {
  components: { searchField, AddFormRoute },
  async created() {
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
