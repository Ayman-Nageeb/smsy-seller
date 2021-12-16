<template>
  <div>
    <p class="headline">
      {{ $t("pages.subscription_requests.title") }}
    </p>
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="
        showConfirmDelete = false;
        ActionSubscriptionId = null;
        ActionClientUserName = null;
      "
      @confirm="removeSubscription"
    />
    <v-data-table
      :headers="headers"
      :items="subscriptions"
      :loading="loading"
      :search="search"
    >
      <template v-slot:[`item.package`]="{ item }">
        <router-link
          :to="{
            name: 'MyPackages.show',
            params: { id: item.package.id },
          }"
        >
          <v-btn color="primary" text> {{ item.package.name }} </v-btn>
        </router-link>
      </template>

      <template v-slot:[`item.client`]="{ item }">
        <router-link
          :to="{
            name: 'Clients.show',
            params: { id: item.client.id },
          }"
        >
          <v-btn color="primary" text> @{{ item.client.user_name }} </v-btn>
        </router-link>
      </template>

      <template v-slot:[`item.price`]="{ item }">
        <editable
          v-if="$permissions().has(['sellers::update_subscription'])"
          :field="{ name: 'price', value: item.price }"
          :apiEndPoint="updateSubscriptionURL(item.id)"
          @updated="item.price = $event"
        >
        </editable>
        <span v-else> {{ item.price }} </span>
      </template>
      <template v-slot:[`item.capacity`]="{ item }">
        <editable
          v-if="$permissions().has(['sellers::update_subscription'])"
          :field="{ name: 'capacity', value: item.capacity }"
          :apiEndPoint="updateSubscriptionURL(item.id)"
          @updated="item.capacity = $event"
        >
        </editable>
        <span v-else> {{ item.capacity }} </span>
      </template>
      <template v-slot:[`item.used`]="{ item }">
        <editable
          v-if="$permissions().has(['sellers::update_subscription'])"
          :field="{ name: 'used', value: item.used }"
          :apiEndPoint="updateSubscriptionURL(item.id)"
          @updated="item.used = $event"
        >
        </editable>
        <span v-else> {{ item.used }} </span>
      </template>

      <template v-slot:[`item.remaining`]="{ item }">
        {{ item.capacity - item.used }}
      </template>

      

      <template v-slot:[`item.created_at`]="{ item }">
        <relative-date :date="item.created_at" />
      </template>
      <template v-slot:[`item.confirmed_at`]="{ item }">
        <relative-date :date="item.confirmed_at" />
      </template>
      <template v-slot:[`item.expired_at`]="{ item }">
       
          <relative-date :date="item.expired_at" />
        
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <seller-subscription-status-view :status="item.status" />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        
        <v-btn
          icon
          color="success"
          
          @click="confirmSubscription(item.client.user_name, item.id)"
        >
          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          color="error"
          @click="
            showConfirmDelete = true;
            ActionSubscriptionId = item.id;
            ActionClientUserName = item.client.user_name;
          "
          :loading="removingSubscription && ActionSubscriptionId == item.id"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "../api";
import ConfirmDelete from '../components/confirmDelete.vue';
import { datatableColumn } from "../components/ListDataTable.vue";
import RelativeDate from '../components/RelativeDate.vue';
import SellerSubscriptionStatusView from '../components/sellers/SellerSubscriptionStatusView.vue';
export default {
  components: { RelativeDate, SellerSubscriptionStatusView, ConfirmDelete },
  data() {
    return {
      showConfirmDelete: false,
      loading: false,
      subscriptions: [],
      search: "",
      ActionSubscriptionId: null,
      ActionClientUserName: null,
      removingSubscription: false,
    };
  },
  created() {
    this.loadRequests();
  },
  methods: {
    async loadRequests() {
      this.loading = true;
      try {
        const response = await api.get("/current-seller/subscription-requests");
        this.subscriptions = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    updateSubscriptionURL(id) {
      return `/current-seller/clients/${this.userName}/subscriptions/${id}`;
    },
    async confirmSubscription(clientId, id) {
      
      this.loading = true;
      try {
        await api.post(`/current-seller/clients/${clientId}/subscriptions/${id}/confirm`);
        this.loadRequests();
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async removeSubscription() {
      const id = this.ActionSubscriptionId;
      this.showConfirmDelete = false;
      this.removingSubscription = true;
      try {
        await api.delete(`/current-seller/clients/${this.ActionClientUserName}/subscriptions/${id}`);
        this.loadRequests();
      } catch (error) {
        alert(error);
      }
      this.removingSubscription = false;
      this.ActionSubscriptionId = null;
    },
  },
  computed: {
    headers() {
      const headers = [
        
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.client"),
          "client"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.package"),
          "package"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.capacity"),
          "capacity"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.used"),
          "used"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.remaining"),
          "remaining"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.price"),
          "price"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.payed"),
          "payed"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.creation_date"),
          "created_at"
        ),
        datatableColumn(
          this.$t(
            "pages.show_seller.tabs.subscriptions.headers.confirmation_date"
          ),
          "confirmed_at"
        ),
        datatableColumn(
          this.$t(
            "pages.show_seller.tabs.subscriptions.headers.expiration_date"
          ),
          "expired_at"
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.status"),
          "status",
          () => true,
          {
            align: "center",
          }
        ),
        datatableColumn(
          this.$t("pages.show_seller.tabs.subscriptions.headers.actions"),
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
};
</script>

<style></style>
