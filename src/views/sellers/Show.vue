<template>
  <v-dialog
    :value="true"
    persistent
    scrollable
    max-width="1370px"
    transition="dialog-transition"
    
  >
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="remove"
    />
    <v-card :loading="loading" :disabled="loading" height="550">
      <v-card-title class="pa-0">
        <v-btn icon class="mx-2" large @click="goBack">
          <v-icon
            v-html="
              $t('direction').toLowerCase() == 'rtl'
                ? 'mdi-arrow-right '
                : 'mdi-arrow-left'
            "
          ></v-icon>
        </v-btn>

        <div class="d-inline-block">
          <v-tabs center-active v-model="openedTab">
            <v-tab
              v-if="$permissions().has(['sellers::retrieve'])"
              href="#basic"
              >{{ $t("pages.show_seller.tabs.basic.title") }}</v-tab
            >
            <v-tab
              v-if="$permissions().has(['sellers::view_group'])"
              href="#groups"
              >{{ $t("pages.show_seller.tabs.groups.title") }}</v-tab
            >
            <v-tab
              v-if="
                $permissions().hasOneOf([
                  'sellers::set_subscription',
                  'sellers::view_groups',
                ])
              "
              href="#packages"
              >{{ $t("pages.show_seller.tabs.packages.title") }}</v-tab
            >
            <v-tab
              v-if="$permissions().has(['sellers::set_subscription'])"
              href="#subscriptions"
              >{{ $t("pages.show_seller.tabs.subscriptions.title") }}</v-tab
            >

            <v-tab
              v-if="$permissions().has(['sellers::set_subscription'])"
              href="#sender_ids"
              >{{ $t("pages.show_seller.tabs.sender_ids.title") }}</v-tab
            >

            <v-tab
              v-if="
                $permissions().hasOneOf(['sellers::update', 'sellers::remove'])
              "
              href="#operations"
              >Operations</v-tab
            >
          </v-tabs>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon class="mx-2" color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-text class="pa-4">
        <v-tabs-items v-model="openedTab">
          <v-tab-item value="basic">
            <sellers-tab-basic @update="sendUpdateSignal" :seller="seller" />
          </v-tab-item>
          <v-tab-item value="groups">
            <seller-groups-tab :user-name="seller.user_name" />
          </v-tab-item>

          <v-tab-item value="packages">
            <seller-tab-packages :user-name="seller.user_name" />
          </v-tab-item>

          <v-tab-item value="subscriptions">
            <seller-tab-subscriptions :user-name="seller.user_name" />
          </v-tab-item>

          <v-tab-item value="sender_ids">
            <seller-tab-sender-ids :user-name="seller.user_name" />
          </v-tab-item>

          <v-tab-item value="operations">
            <seller-tab-operations
              :status="seller.status"
              :generatedPassword="generatedPassword"
              @remove="showConfirmDelete = true"
              @suspend="suspend"
              @activate="activate"
              @resetPassword="resetPassword"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-4">
        <seller-status :status="seller.status" />
        <v-spacer></v-spacer>

        <!-- <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("misc.close") }}</span>
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../api";
import ConfirmDelete from "../../components/confirmDelete.vue";
import SellerGroupsTab from "../../components/sellers/SellerGroupsTab.vue";
import SellersTabBasic from "../../components/sellers/SellersTabBasic.vue";
import SellerStatus from "../../components/sellers/SellerStatus.vue";
import SellerTabOperations from "../../components/sellers/SellerTabOperations.vue";
import SellerTabPackages from "../../components/sellers/SellerTabPackages.vue";
import SellerTabSenderIds from '../../components/sellers/SellerTabSenderIds.vue';
import SellerTabSubscriptions from "../../components/sellers/SellerTabSubscriptions.vue";
import { mainEventBus } from "../../main";
export default {
  components: {
    ConfirmDelete,
    SellerGroupsTab,
    SellersTabBasic,
    SellerStatus,
    SellerTabOperations,
    SellerTabPackages,
    SellerTabSubscriptions,
    SellerTabSenderIds,
  },
  async created() {
    this.$permissions().authorize(["sellers::retrieve"]);
    await this.loadSeller();
  },
  data() {
    return {
      showConfirmDelete: false,
      openedTab: "basic",
      loading: false,
      seller: {},
      generatedPassword: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    async loadSeller() {
      const userName = this.$route.params.user_name;
      this.loading = true;
      const withGroups = this.$permissions().has(["sellers::view_groups"]);
      try {
        const response = await api.get(`/sellers/${userName}`, {
          with_groups: Number(withGroups),
        });
        this.seller = response.data.data;
        if (typeof this.seller.phones == "string") {
          this.seller.phones = JSON.parse(this.seller.phones);
          
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
      this.loading = false;
    },
    sendUpdateSignal(data) {
      mainEventBus.$emit("updateSellers", data);
    },
    async remove() {
      this.loading = true;
      this.showConfirmDelete = false;
      try {
        await api.delete(`sellers/${this.seller.user_name}`);
        mainEventBus.$emit("updateSellers", "API EVENT");
        window.history.back();
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async suspend() {
      this.loading = true;
      try {
        await api.post(`sellers/${this.seller.user_name}/suspend`);
        this.seller.status = "SUSPENDED";
        mainEventBus.$emit("updateSellers", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async activate() {
      this.loading = true;
      try {
        await api.post(`sellers/${this.seller.user_name}/activate`);
        this.seller.status = "ACTIVE";
        mainEventBus.$emit("updateSellers", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async resetPassword() {
      this.loading = true;
      try {
        const response = await api.post(
          `sellers/${this.seller.user_name}/reset-password`
        );
        this.generatedPassword = response.data.data;
        mainEventBus.$emit("updateSellers", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
  watch: {
    seller(new_val, old_val) {
      if (old_val && new_val && JSON.stringify(old_val) != JSON.stringify({}))
        mainEventBus.$emit("updateSellers", "name updated");
    },
  },
};
</script>

<style></style>
