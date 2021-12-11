<template>
  <div class="pa-2">
    <v-row>
      <v-col>
        
        <p class="headline">
          {{$t('pages.show_package.tabs.groups')}}
          <v-btn
            color="primary"
            v-if="!loadingGroups && !editGroupsMode"
            @click="editGroupsMode = true"
            >{{$t('misc.edit')}}</v-btn
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
            {{$t('pages.create_package.form.groups.errors.empty')}}
          </v-alert>
          <select-package-groups
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
    
  </div>
</template>

<script>
import api from "../../api";
import { mainEventBus } from "../../main";
import SelectPackageGroups from './SelectPackageGroups.vue';
export default {
  components: { SelectPackageGroups },
  props: ["id"],
  created() {
    this.$permissions().authorizeOneOf([
      "packages::view_groups",
      "packages::set_group",
    ]);
    this.loadPackageGroups();
  },
  data() {
    return {
      groups: [],
      loadingGroups: false,
      
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
    async loadPackageGroups() {
      this.loadingGroups = true;
      try {
        const response = await api.get(`packages/${this.id}/groups`);
        this.groups = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loadingGroups = false;
    },
    
    async saveNewGroups() {
      this.showEmptyGroupError = false;
      if (this.newGroups.length < 1) {
        this.showEmptyGroupError = true;
        return;
      }
      this.loadingGroups = true;
      try {
        await api.post(`/packages/${this.id}/groups`, {
          groups: this.newGroups,
        });

        this.editGroupsMode = false;
        this.loadPackageGroups();
        
        mainEventBus.$emit("updatePackages", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loadingGroups = false;
    },
  },
};
</script>

<style></style>
