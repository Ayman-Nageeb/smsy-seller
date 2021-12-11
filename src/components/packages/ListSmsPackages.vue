<template>
  <v-card class="pa-1" flat>
    <v-card-text>
      <search-field v-model="search" />
      <v-data-table
        :headers="headers"
        :items="smsPackages"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ item }">
          <protected-view
            :has="['groups::retrieve']"
            v-if="$permissions().has(['groups::retrieve'])"
          >
            <router-link
              :to="{
                name: 'Packages.show',
                params: { id: item.id },
              }"
            >
              <v-btn color="primary" text> {{ item.name }} </v-btn>
            </router-link>
          </protected-view>
          <span v-else> @{{ item.user_name }} </span>
        </template>
        <template v-slot:[`item.duration`]="{ item }">
          {{item.duration}} {{$t(`models.packages.duration_units.${item.duration_unit}`)}}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <package-status-view :status="item.status" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import api from "../../api";
import { mainEventBus } from '../../main';
import { datatableColumn } from "../ListDataTable.vue";
import ProtectedView from "../ProtectedView.vue";
import SearchField from '../searchField.vue';
import PackageStatusView from './PackageStatusView.vue';
export default {
  components: { ProtectedView, SearchField, PackageStatusView },
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
  async created(){
    mainEventBus.$on("updatePackages", this.loadSmsPackages);
    await this.loadSmsPackages()
  },
  methods: {
    async loadSmsPackages() {
      this.loading = true;
      try {
        const response = await api.get("packages");
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
