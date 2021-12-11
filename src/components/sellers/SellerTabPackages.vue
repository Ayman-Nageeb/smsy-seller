<template>
  <div class="px-6 align-top">
    <v-snackbar
      v-model="showSubscriptionSuccess"
      :timeout="2000"
      color="success"
      dark
      top
      left
    >
      {{ $t("pages.show_seller.tabs.packages.subscription_success") }}
    </v-snackbar>
    <div class="pa-2 mx-auto d-flex justify-space-around">
      <v-progress-circular
        color="primary"
        v-if="loading"
        indeterminate
        class="mx-auto"
      ></v-progress-circular>
    </div>
    <v-card
      outlined
      width="350"
      v-for="(smsPackage, index) of smsPackages"
      :key="index"
      class="d-inline-block ma-6"
      :loading="loading"
    >
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          large
          color="primary"
          v-if="$permissions().has(['packages::retrieve'])"
          :to="`/packages/${smsPackage.id}`"
        >
          <span class="headline font-weight-black">
            {{ smsPackage.name }}
          </span>
        </v-btn>
        <span v-else class="headline primary--text font-weight-black">
          {{ smsPackage.name }}
        </span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title>
        <span>
          {{ $t("pages.create_package.form.price.label") }}
        </span>
        <v-spacer></v-spacer>
        <span class="font-weight-black success--text">
          {{ smsPackage.price }}
          <v-icon color="success">mdi-currency-usd</v-icon>
        </span>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title>
        <span>
          {{ $t("pages.create_package.form.capacity.label") }}
        </span>
        <v-spacer></v-spacer>
        <span class="font-weight-black info--text">
          {{ smsPackage.price }}
          <v-icon color="info">mdi-message</v-icon>
        </span>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title>
        <span>
          {{ $t("pages.create_package.form.duration.label") }}
        </span>
        <v-spacer></v-spacer>
        <span class="font-weight-bold">
          {{ smsPackage.duration }}
          {{ $t(`models.packages.duration_units.${smsPackage.duration_unit}`) }}
        </span>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-text v-if="smsPackage.notes && smsPackage.notes.trim() != ''">
        <!-- <p class="headline">
          {{ $t("pages.create_package.form.notes.label") }}
        </p> -->
        <p>{{ smsPackage.notes }}</p>
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <protected-view :has="['packages::set_sellers']">
          <locked-view>
            <v-btn
              color="primary"
              large
              @click="setSubscription(smsPackage.id)"
            >
              <v-icon>mdi-message-flash</v-icon>
              <span class="mx-1"></span>
              <span>
                {{ $t("pages.show_seller.tabs.packages.subscribe") }}
              </span>
            </v-btn>
          </locked-view>
        </protected-view>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import api from "../../api";
import { mainEventBus } from "../../main";
import LockedView from "../LockedView.vue";
import ProtectedView from "../ProtectedView.vue";
// import { mainEventBus } from "../../main";
export default {
  components: { ProtectedView, LockedView },
  props: ["user-name"],
  created() {
    this.$permissions().authorize(["sellers::view_packages"]);
    this.loadSellerPackages();
  },
  data() {
    return {
      smsPackages: [],
      loading: false,
      showSubscriptionSuccess: false,
    };
  },
  computed: {},
  methods: {
    async loadSellerPackages() {
      this.loading = true;
      try {
        const response = await api.get(`sellers/${this.userName}/packages`);
        this.smsPackages = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async setSubscription(packageId) {
      this.loading = true;
      try {
        await api.post(
          `sellers/${this.userName}/packages/${packageId}/subscribe`
        );
        mainEventBus.$emit("updateSellerSubscriptions");
        this.showSubscriptionSuccess = true;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
