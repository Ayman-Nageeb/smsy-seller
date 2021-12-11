<template>
  <v-dialog
    :value="true"
    persistent
    scrollable
    max-width="950px"
    transition="dialog-transition"
  >
    <v-card :loading="loading" :disabled="loading" height="500">
      <v-card-title class="pa-0">
        <confirm-delete
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="remove"
    />
        <v-btn icon class="mx-2" @click="goBack">
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
            <v-tab href="#basic">{{
              $t("pages.show_package.tabs.basic")
            }}</v-tab>
            <v-tab
              href="#groups"
              v-if="$permissions().has(['packages::view_groups'])"
              >{{ $t("pages.show_package.tabs.groups") }}</v-tab
            >
            <v-tab
              href="#operations"
              v-if="$permissions().has(['packages::update'])"
              >{{ $t("pages.show_package.tabs.operations") }}</v-tab
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
            <v-card :disabled="!$permissions().has(['packages::update'])">
              <v-card-text>
                <packages-tab-basic
                  @update="sendUpdateSignal"
                  :sms-package="smsPackage"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item
            value="groups"
            v-if="$permissions().has(['packages::view_groups'])"
          >
            <package-tab-groups :id="smsPackage.id" />
          </v-tab-item>
          <v-tab-item
            value="operations"
            v-if="$permissions().has(['packages::update'])"
          >
            <package-tab-operations
              :status="smsPackage.status"
              @remove="showConfirmDelete = true"
              @deactivate="deactivate"
              @activate="activate"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../api";
import ConfirmDelete from '../../components/confirmDelete.vue';
import PackagesTabBasic from "../../components/packages/PackagesTabBasic.vue";
import PackageTabGroups from "../../components/packages/PackageTabGroups.vue";
import PackageTabOperations from '../../components/packages/PackageTabOperations.vue';
import { mainEventBus } from "../../main";
export default {
  components: { PackagesTabBasic, PackageTabGroups, PackageTabOperations, ConfirmDelete },
  data() {
    return {
      loading: false,
      openedTab: "",
      smsPackage: {},
      showConfirmDelete: false,
    };
  },
  created() {
    this.$permissions().authorize(["packages::retrieve"]);
    this.loadPackage();
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async loadPackage() {
      const id = this.$route.params.id;
      this.loading = true;
      const withGroups = this.$permissions().has(["packages::view_groups"]);
      try {
        const response = await api.get(`/packages/${id}`, {
          with_groups: withGroups,
        });
        this.smsPackage = response.data.data;
      } catch (error) {
        console.log(error);
        alert(error);
      }
      this.loading = false;
    },
    sendUpdateSignal(data) {
      mainEventBus.$emit("updatePackages", data);
    },
    async deactivate(){
      this.loading = true;
      await api.post(`/packages/${this.smsPackage.id}/deactivate`);
      await this.loadPackage();
      mainEventBus.$emit('updatePackages');
      this.loading = false;
    },
    async activate(){
      this.loading = true;
      await api.post(`/packages/${this.smsPackage.id}/activate`);
      await this.loadPackage();
      mainEventBus.$emit('updatePackages');
      this.loading = false;
    },
    async remove(){
      this.loading = true;
      await api.delete(`/packages/${this.smsPackage.id}`);
      mainEventBus.$emit('updatePackages');
      this.goBack();
      this.loading = false;
    }
  },
};
</script>

<style></style>
