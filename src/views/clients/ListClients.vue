<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />
      <v-data-table
        :headers="headers"
        :items="clients"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.user_name`]="{ item }">
         
            <router-link
              :to="{
                name: 'Clients.show',
                params: { user_name: item.user_name },
              }"
            >
              <v-btn color="primary" text> @{{ item.user_name }} </v-btn>
            </router-link>
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
        <template v-slot:[`item.status`]="{ item }">
          <client-status-view :status="item.status" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Sugar, { Date } from "sugar";
import { datatableColumn } from "../../components/ListDataTable.vue";
import RelativeDate from "../../components/RelativeDate.vue";
import searchField from "../../components/searchField.vue";
import { mainEventBus } from "../../main";
import api from "../../api";
import ClientStatusView from './ClientStatusView.vue';
export default {
  components: { searchField, RelativeDate, ClientStatusView,  },
  async created() {
    await this.loadClients();
    mainEventBus.$on("updateClients", this.loadClients);
  },
  data() {
    return {
      search: "",
      clients: [],
      loading: false,
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.clients.list.datatable.headers.user_name"),
          "user_name"
        ),
        datatableColumn(
          this.$t("pages.clients.list.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.clients.list.datatable.headers.company"),
          "company"
        ),
        datatableColumn(
          this.$t("pages.clients.list.datatable.headers.last_activity"),
          "last_activity"
        ),
        datatableColumn(
          this.$t("pages.clients.list.datatable.headers.status"),
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
    async loadClients() {
      this.loading = true;

      const response = await api.get("/current-seller/clients");
      this.clients = response.data.data;

      this.clients = this.clients.reverse();

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
