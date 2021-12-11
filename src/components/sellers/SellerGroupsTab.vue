<template>
  <div class="pa-2">
    <v-row>
      <v-col>
        <p class="headline">
          Groups
          <v-btn
            color="primary"
            v-if="!loadingGroups && !editGroupsMode"
            @click="editGroupsMode = true"
            >Edit</v-btn
          >

          <v-progress-circular
            color="primary"
            v-if="loadingGroups"
            indeterminate
          ></v-progress-circular>
        </p>
        <div v-if="editGroupsMode">
          <v-alert
            type="error"
            border="bottom"
            outlined
            v-if="showEmptyGroupError"
          >
            Please at least Select one group
          </v-alert>
          <select-seller-groups
            :autoSelected="groupsIds"
            @input="newGroups = $event"
          />
          <div class="my-2">
            <v-btn color="error" @click="editGroupsMode = false">
              <v-icon>mdi-cancel</v-icon>
              <span class="mx-1"></span>
              <span>{{ $t("misc.cancel") }}</span>
            </v-btn>
            <span class="mx-2"></span>
            <v-btn color="primary" @click="saveNewGroups">
              <v-icon>mdi-content-save</v-icon>
              <span class="mx-1"></span>
              <span>{{ $t("misc.save") }}</span>
            </v-btn>
          </div>
        </div>
        <div v-else>
          <v-chip
            color="primary"
            outlined
            class="ma-2"
            v-for="(group, index) of groups"
            :key="index"
            >{{ group.name }}</v-chip
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="headline my-4">
          Features
          <v-progress-circular
            color="primary"
            indeterminate
            v-if="loadingFeatures"
          ></v-progress-circular>
        </p>
        <div>
          <v-chip
            color="success"
            outlined
            class="ma-2"
            v-for="(feature, index) of features"
            :key="index"
            >{{ $t(`features.${feature}`) }}</v-chip
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import api from "../../api";
import { mainEventBus } from "../../main";
import selectSellerGroups from "./selectSellerGroups.vue";
export default {
  components: { selectSellerGroups },
  props: ["user-name"],
  created() {
    this.$permissions().authorizeOneOf([
      "sellers::view_groups",
      "sellers::set_group",
      "supervisors::revoke_group",
      "supervisors::view_features",
    ]);
    this.loadSellerGroups();
    this.loadSellerFeatures();
  },
  data() {
    return {
      groups: [],
      loadingGroups: false,
      features: [],
      loadingFeatures: false,
      editGroupsMode: false,
      newGroups: [],
      showEmptyGroupError: false,
    };
  },
  computed: {
    groupsIds() {
      const list = [];
      for (let group of this.groups) {
        list.push(group.id);
      }
      return list;
    },
  },
  methods: {
    async loadSellerGroups() {
      this.loadingGroups = true;
      try {
        const response = await api.get(`sellers/${this.userName}/groups`);
        this.groups = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loadingGroups = false;
    },
    async loadSellerFeatures() {
      this.loadingFeatures = true;
      try {
        const response = await api.get(`sellers/${this.userName}/features`);
        this.features = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loadingFeatures = false;
    },
    async saveNewGroups() {
      this.showEmptyGroupError = false;
      if (this.newGroups.length < 1) {
        this.showEmptyGroupError = true;
        return;
      }
      this.loadingGroups = true;
      try {
        await api.post(`/sellers/${this.userName}/groups`, {
          groups: this.newGroups,
        });

        this.editGroupsMode = false;
        this.loadSellerGroups();
        this.loadSellerFeatures();
        mainEventBus.$emit("updateSellers", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loadingRoles = true;
    },
  },
};
</script>

<style></style>
