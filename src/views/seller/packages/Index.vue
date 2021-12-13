<template>
  <div>
    <router-view></router-view>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">Custom Packages</h2>
            <p class="my-2">your clients subscription bundles</p>
          </div>
          <add-form-route routeName="MyPackages.create" />
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <search-field v-model="search" />
        <v-data-table
          :headers="headers"
          :items="smsPackages"
          :loading="loading"
          :search="search"
        >
          <template v-slot:[`item.name`]="{ item }">
            <router-link
              :to="{
                name: 'MyPackages.show',
                params: { id: item.id },
              }"
            >
              <v-btn color="primary" text> {{ item.name }} </v-btn>
            </router-link>
          </template>
          <template v-slot:[`item.duration`]="{ item }">
            {{ item.duration }}
            {{ $t(`models.packages.duration_units.${item.duration_unit}`) }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <package-status-view :status="item.status" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../../components/AddFormRoute.vue";

import api from "../../../api";
import { mainEventBus } from "../../../main";
import { datatableColumn } from "../../../components/ListDataTable.vue";
import SearchField from "../../../components/searchField.vue";
import PackageStatusView from "../../../components/packages/PackageStatusView.vue";
export default {
  components: { SearchField, PackageStatusView, AddFormRoute },
  data() {
    return {
      search: "",
      smsPackages: [],
      loading: false,
    };
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.packages.list.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.packages.list.datatable.headers.price"),
          "price"
        ),
        datatableColumn(
          this.$t("pages.packages.list.datatable.headers.capacity"),
          "capacity"
        ),
        datatableColumn(
          this.$t("pages.packages.list.datatable.headers.duration"),
          "duration"
        ),
        datatableColumn(
          this.$t("pages.packages.list.datatable.headers.status"),
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
  async created() {
    mainEventBus.$on("updateMyPackages", this.loadSmsPackages);
    await this.loadSmsPackages();
  },
  methods: {
    async loadSmsPackages() {
      this.loading = true;
      try {
        const response = await api.get("/current-seller/custom-packages");
        this.smsPackages = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
