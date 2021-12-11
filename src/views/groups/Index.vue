<template>
  <div>
    <router-view></router-view>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.groups.title") }}</h2>
            <p class="my-2">{{ $t("pages.groups.subtitle") }}</p>
          </div>
          <add-form-route :has="['groups::add']" routeName="Groups.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['groups::retrieve']">
          <list-groups />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import ListGroups from "../../components/groups/ListGroups.vue";
import ProtectedView from "../../components/ProtectedView.vue";
export default {
  components: { AddFormRoute, ListGroups, ProtectedView },
  async created() {
    this.authorize();
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
        "groups::add",
        "groups::remove",
        "groups::retrieve",
        "groups::update",
        "groups::view_permissions",
        "groups::set_permissions",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
  },
};
</script>

<style></style>
