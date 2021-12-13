<template>
  <div>
    <router-view />
    <v-row>
      <v-col>
        <p class="headline">
          {{ $t("pages.show_seller.tabs.sender_ids.title") }}
          <span class="mx-2">
            <v-progress-circular
              color="primary"
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </span>
          <add-form-route
            :has="['seller::sender_id::add']"
            routeName="SenderIds.create"
          />
        </p>
        
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <search-field :filterQuery="search" v-if="false"/>
        {{search}}
        <v-data-table
          :headers="headers"
          :items="sellerSenderIds"
          item-key="id"
          :loading="loading"
          :search="search"
        >
          <template v-slot:[`item.name`]="{ item }">
            <span> {{ item.name }} </span>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <relative-date :date="item.created_at" />
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <sender-id-status-view :status="item.status" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import api from "../../api";
import AddFormRoute from "../../components/AddFormRoute.vue";
import { datatableColumn } from "../../components/ListDataTable.vue";
import RelativeDate from "../../components/RelativeDate.vue";
import SearchField from "../../components/searchField.vue";
import SenderIdStatusView from "../../components/sender_ids/SenderIdStatusView.vue";
import { mainEventBus } from "../../main";

export default {
  components: {
    SenderIdStatusView,
    AddFormRoute,
    SearchField,
    RelativeDate,
  },
  props: ["user-name"],
  data() {
    return {
      loading: false,
      senderIds: [],
      sellerSenderIds: [],
      selectedIDs: [],
      search: "",
    };
  },
  created() {
    this.loadSellerSenderIds();
    mainEventBus.$on("updateSenderIds", this.loadSellerSenderIds);
  },
  computed: {
    sellerSenderIdsIds() {
      const list = [];
      for (let field of this.sellerSenderIds) {
        list.push(field.id);
      }
      return list;
    },
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.status"),
          "status"
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.creation_date"),
          "created_at",
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
    async loadSellerSenderIds() {
      this.loading = true;
      try {
        const response = await api.get(`/current-seller/sender-ids`);
        this.sellerSenderIds = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async setSenderIds() {
      this.loading = true;
      try {
        const data = {
          sender_ids: this.selectedIDs,
        };

        await api.post(`/sellers/${this.userName}/sender-ids`, data);
        this.editMode = false;
        this.loadSellerSenderIds();
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
