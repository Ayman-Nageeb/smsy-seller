<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />
      <v-data-table
        :headers="headers"
        :items="supervisors"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.user_name`]="{ item }">
          <protected-view
            :has="['supervisors::retrieve']"
            v-if="$permissions().has(['supervisors::retrieve'])"
          >
            <router-link :to="{ name: 'Supervisors.show', params: {user_name: item.user_name} }">
              <v-btn color="primary" text> @{{ item.user_name }} </v-btn>
            </router-link>
          </protected-view>
          <span v-else> @{{ item.user_name }} </span>
        </template>
        <template v-slot:[`item.roles`]="{ item }">
          <list-supervisor-roles :roles="item.roles" />
        </template>
        <template v-slot:[`item.last_activity`]="{ item }">
          <v-badge
            inline
            left
            :color="
              isSupervisorOnline(item.last_activity) ? `success` : `transparent`
            "
          >
            <relative-date :date="item.last_activity" />
          </v-badge>
        </template>
        <template v-slot:[`item.status`]="{item}">
          <supervisor-status :status="item.status" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Sugar, { Date } from "sugar";
import { getAllSupervisors } from "../../api/supervisors";
import { datatableColumn } from "../ListDataTable.vue";
import RelativeDate from "../RelativeDate.vue";
import searchField from "../searchField.vue";
import ProtectedView from "../ProtectedView.vue";
import ListSupervisorRoles from "./ListSupervisorRoles.vue";
import SupervisorStatus from './SupervisorStatus.vue';
import { mainEventBus } from '../../main';
export default {
  components: { searchField, RelativeDate, ProtectedView, ListSupervisorRoles, SupervisorStatus },
  async created() {
    await this.loadSupervisors();
    mainEventBus.$on("updateSupervisors", this.loadSupervisors);
    mainEventBus.$on('supervisorCreated', this.loadSupervisors);
  },
  data() {
    return {
      search: "",
      supervisors: [],
      loading: false,
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.supervisors.list.datatable.headers.user_name"),
          "user_name"
        ),
        datatableColumn(
          this.$t("pages.supervisors.list.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.supervisors.list.datatable.headers.roles"),
          "roles",
          () => {
            return this.$permissions().hasOneOf([
              "supervisors::view_role",
              "supervisors::set_role",
              "supervisors::revoke_role",
            ]);
          }
        ),
        datatableColumn(
          this.$t("pages.supervisors.list.datatable.headers.last_activity"),
          "last_activity"
        ),
        datatableColumn(
          this.$t("pages.supervisors.list.datatable.headers.status"),
          "status",
          () => true,
          {
            align:
              this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
          }
        ),
      ];
      return headers.filter((item) => {
        if (item) return true;
        return false;
      });
    },
  },
  methods: {
    async loadSupervisors() {
      this.loading = true;

      const withRoles = this.$permissions().hasOneOf([
        "supervisors::view_role",
        "supervisors::set_role",
        "supervisors::revoke_role",
      ]);
      const response = await getAllSupervisors(withRoles);
      this.supervisors = response.data.data;

      this.supervisors = this.supervisors.reverse();

      this.loading = false;
    },
    isSupervisorOnline(last_activity) {
      const lastActivityDate = Sugar.Date(last_activity);
      const tenSecondesAgo = Date.create("ten seconds before");
      if (lastActivityDate.isBefore(tenSecondesAgo)) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
