<template>
  <div>
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="
        showConfirmDelete = false;
        ActionSenderId = null;
      "
      @confirm="removeSenderId"
    />
    <search-field :filterQuery="search" />
    <v-data-table
      :headers="headers"
      :items="senderIds"
      item-key="id"
      :loading="loading"
      :search="search"
    >
      <template v-slot:[`item.name`]="{ item }">
        <editable
          :field="{ name: 'name', value: item.name }"
          :apiEndPoint="getUpdateSenderIdEndPoint(item.id)"
          @updated="item.name = $event"
          v-if="$permissions().has(['sender_id::update'])"
        />
        <span v-else> @{{ item.name }} </span>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <relative-date :date="item.created_at" />
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <sender-id-status-view :status="item.status" />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon
          color="error"
          v-if="item.status.toUpperCase() == 'ACTIVE'"
          @click="deactivateSenderId(item.id)"
          :loading="updatingStatus && ActionSenderId == item.id"
        >
          <v-icon>mdi-pause-circle-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          color="success"
          v-else
          @click="activateSenderId(item.id)"
          :loading="updatingStatus && ActionSenderId == item.id"
        >
          <v-icon>mdi-play-circle-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          color="error"
          @click="
            showConfirmDelete = true;
            ActionSenderId = item.id;
          "
          :loading="removingSenderId && ActionSenderId == item.id"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "../../api";
import { mainEventBus } from "../../main";
import ConfirmDelete from '../confirmDelete.vue';
import Editable from "../Editable.vue";
import { datatableColumn } from "../ListDataTable.vue";
import RelativeDate from "../RelativeDate.vue";
import searchField from "../searchField.vue";
import SenderIdStatusView from "./SenderIdStatusView.vue";
export default {
  components: { searchField, Editable, RelativeDate, SenderIdStatusView, ConfirmDelete },
  data() {
    return {
      search: "",
      loading: false,
      senderIds: [],
      updatingStatus: false,
      ActionSenderId: null,
      showConfirmDelete: false,
      removingSenderId: false,
    };
  },
  created() {
    this.loadSenderIds();
    mainEventBus.$on("updateSenderIds", this.loadSenderIds);
  },
  computed: {
    headers() {
      const headers = [
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.name"),
          "name"
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.sellers"),
          "sellers"
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.creation_date"),
          "created_at"
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.status"),
          "status",
          () => true,
          {
            align:
              this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
          }
        ),
        datatableColumn(
          this.$t("pages.sender_ids.datatable.headers.actions"),
          "actions",
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
    async loadSenderIds() {
      this.loading = true;
      try {
        const response = await api.get("sender-ids");
        this.senderIds = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    getUpdateSenderIdEndPoint(id) {
      return `/sender-ids/${id}`;
    },
    async deactivateSenderId(id) {
      this.ActionSenderId = id;
      this.updatingStatus = true;
      try {
        await api.post(`sender-ids/${id}/deactivate`);
        this.loadSenderIds();
      } catch (error) {
        alert(error);
      }
      this.updatingStatus = false;
      this.ActionSenderId = null;
    },
    async activateSenderId(id) {
      this.ActionSenderId = id;
      this.updatingStatus = true;
      try {
        await api.post(`sender-ids/${id}/activate`);
        this.loadSenderIds();
      } catch (error) {
        alert(error);
      }
      this.updatingStatus = false;
      this.ActionSenderId = null;
    },

    async removeSenderId() {
      this.removingSenderId = true;
      this.showConfirmDelete = false;
      try {
        await api.delete(`sender-ids/${this.ActionSenderId}`);
        this.loadSenderIds();
      } catch (error) {
        alert(error);
      }
      this.removingSenderId = false;
      this.ActionSenderId = null;
    },
  },
};
</script>

<style></style>
