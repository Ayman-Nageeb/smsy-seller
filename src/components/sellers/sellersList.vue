<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />
      <v-data-table
        :headers="headers"
        :items="sellers"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.user_name`]="{ item }">
          <protected-view
            :has="['sellers::retrieve']"
            v-if="$permissions().has(['sellers::retrieve'])"
          >
            <router-link
              :to="{
                name: 'Sellers.show',
                params: { user_name: item.user_name },
              }"
            >
              <v-btn color="primary" text> @{{ item.user_name }} </v-btn>
            </router-link>
          </protected-view>
          <span v-else> @{{ item.user_name }} </span>
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
          <seller-status :status="item.status" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Sugar, { Date } from "sugar";
import { datatableColumn } from "../ListDataTable.vue";
import RelativeDate from "../RelativeDate.vue";
import searchField from "../searchField.vue";
import ProtectedView from "../ProtectedView.vue";
import { mainEventBus } from "../../main";
import api from "../../api";
import SellerStatus from './SellerStatus.vue';
export default {
  components: { searchField, RelativeDate, ProtectedView, SellerStatus },
  async created() {
    await this.loadSellers();
    mainEventBus.$on("updateSellers", this.loadSellers);
  },
  data() {
    return {
      search: "",
      sellers: [],
      loading: false,
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.sellers.list.datatable.headers.user_name"),
          "user_name"
        ),
        datatableColumn(
          this.$t("pages.sellers.list.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.sellers.list.datatable.headers.company"),
          "company"
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
    async loadSellers() {
      this.loading = true;

      const response = await api.get("sellers");
      this.sellers = response.data.data;

      this.sellers = this.sellers.reverse();

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
