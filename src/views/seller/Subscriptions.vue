<template>
  <div>
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="
        showConfirmDelete = false;
        ActionSubscriptionId = null;
      "
      @confirm="removeSubscription"
    />
    <p class="headline">
      {{ $t("pages.show_seller.tabs.subscriptions.title") }}
    </p>
    <p class="primary--text">
      <v-icon color="primary">mdi-timer-sand</v-icon>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.capacity") }}
      <!-- <v-icon>mdi-message-plus</v-icon> -->
      {{ validCapacity }}
      <span class="mx-2"></span>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.used") }}
      <!-- <v-icon>mdi-message-minus</v-icon> -->
      {{ validUsed }}
      <span class="mx-2"></span>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.remaining") }}
      <!-- <v-icon>mdi-message</v-icon> -->
      {{ validRemaining }}

      <span class="mx-6"></span>
      (
      <v-icon color="primary">mdi-timer-sand-full</v-icon>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.capacity") }}
      <!-- <v-icon>mdi-message-plus</v-icon> -->
      {{ totalCapacity }}
      <span class="mx-2"></span>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.used") }}
      <!-- <v-icon>mdi-message-minus</v-icon> -->
      {{ totalUsed }}
      <span class="mx-2"></span>
      {{ $t("pages.show_seller.tabs.subscriptions.headers.remaining") }}
      <!-- <v-icon>mdi-message</v-icon> -->
      {{ totalRemaining }}
      )
    </p>
    <!-- <search-field v-model="search" /> -->
    <v-data-table
      :headers="headers"
      :items="subscriptions"
      :loading="loading"
      :search="search"
    >
      <template v-slot:[`item.package`]="{ item }">
        <span class="font-weight-bold"> {{ item.package.name }} </span>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <span> {{ item.price }} </span>
      </template>
      <template v-slot:[`item.capacity`]="{ item }">
        <span> {{ item.capacity }} </span>
      </template>
      <template v-slot:[`item.used`]="{ item }">
        <span> {{ item.used }} </span>
      </template>

      <template v-slot:[`item.remaining`]="{ item }">
        {{ item.capacity - item.used }}
      </template>

      <template v-slot:[`item.payed`]="{ item }">
        <span> {{ item.payed }} </span>
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
      <!-- <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon
          color="error"
          v-if="item.status.toUpperCase() == 'ACTIVE'"
          @click="deactivateSubscription(item.id)"
          :loading="updatingStatus && ActionSubscriptionId == item.id"
        >
          <v-icon>mdi-pause-circle-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          color="success"
          v-else
          @click="activateSubscription(item.id)"
          :loading="updatingStatus && ActionSubscriptionId == item.id"
        >
          <v-icon>mdi-play-circle-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          color="error"
          @click="
            showConfirmDelete = true;
            ActionSubscriptionId = item.id;
          "
          :loading="removingSubscription && ActionSubscriptionId == item.id"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
import api from "../../api";
import { mainEventBus } from "../../main";
import ConfirmDelete from "../../components/confirmDelete.vue";
import { datatableColumn } from "../../components/ListDataTable.vue";
import RelativeDate from "../../components/RelativeDate.vue";
import SellerSubscriptionStatusView from "../../components/sellers/SellerSubscriptionStatusView.vue";
import Sugar from "sugar";
export default {
  components: {
    RelativeDate,
    SellerSubscriptionStatusView,
    ConfirmDelete,
  },
  props: ["user-name"],
  created() {
    mainEventBus.$on("updateSellerSubscriptions", this.loadSellerSubscriptions);
    this.loadSellerSubscriptions();
  },
  data() {
    return {
      subscriptions: [],
      loading: false,
      search: "",
      ActionSubscriptionId: null,
      updatingStatus: false,
      showConfirmDelete: false,
      removingSubscription: false,
    };
  },
  computed: {
    totalCapacity() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        total += subscription.capacity;
      }
      return total;
    },
    totalUsed() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        total += subscription.used;
      }
      return total;
    },
    totalRemaining() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        total += subscription.capacity - subscription.used;
      }
      return total;
    },
    validCapacity() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        if (
          subscription.status == "ACTIVE" &&
          !Sugar.Date.isBefore(Sugar.Date(subscription.expired_at), "now") &&
          subscription.confirmed_at
        ) {
          total += subscription.capacity;
        }
      }
      return total;
    },
    validUsed() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        if (
          subscription.status == "ACTIVE" &&
          !Sugar.Date.isBefore(Sugar.Date(subscription.expired_at), "now") &&
          subscription.confirmed_at
        ) {
          total += subscription.used;
        }
      }
      return total;
    },
    validRemaining() {
      let total = 0;
      for (let subscription of this.subscriptions) {
        if (
          subscription.status == "ACTIVE" &&
          !Sugar.Date.isBefore(Sugar.Date(subscription.expired_at), "now") &&
          subscription.confirmed_at
        ) {
          total += subscription.capacity - subscription.used;
        }
      }
      return total;
    },
    headers() {
      const headers = [
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
            align:
              this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
          }
        ),
        // datatableColumn(
        //   this.$t("pages.show_seller.tabs.subscriptions.headers.actions"),
        //   "actions",
        //   () => true,
        //   {
        //     align:
        //       this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
        //   }
        // ),
      ];
      return headers.filter((item) => {
        if (item) return true;
        return false;
      });
    },
  },
  methods: {
    async loadSellerSubscriptions() {
      this.loading = true;
      try {
        const response = await api.get(`current-seller/subscriptions`);
        this.subscriptions = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async deactivateSubscription(id) {
      this.ActionSubscriptionId = id;
      this.updatingStatus = true;
      try {
        await api.post(
          `sellers/${this.userName}/subscriptions/${id}/deactivate`
        );
        this.loadSellerSubscriptions();
      } catch (error) {
        alert(error);
      }
      this.updatingStatus = false;
      this.ActionSubscriptionId = null;
    },

    updateSubscriptionURL(id) {
      return `sellers/${this.userName}/subscriptions/${id}`;
    },
    async activateSubscription(id) {
      this.ActionSubscriptionId = id;
      this.updatingStatus = true;
      try {
        await api.post(`sellers/${this.userName}/subscriptions/${id}/activate`);
        this.loadSellerSubscriptions();
      } catch (error) {
        alert(error);
      }
      this.updatingStatus = false;
      this.ActionSubscriptionId = null;
    },

    async removeSubscription() {
      const id = this.ActionSubscriptionId;
      this.showConfirmDelete = false;
      this.removingSubscription = true;
      try {
        await api.delete(`sellers/${this.userName}/subscriptions/${id}`);
        this.loadSellerSubscriptions();
      } catch (error) {
        alert(error);
      }
      this.removingSubscription = false;
      this.ActionSubscriptionId = null;
    },
  },
};
</script>

<style></style>
