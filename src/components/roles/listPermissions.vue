<template>
  <div>
    <v-dialog
      v-model="showAllPermissionsDialog"
      scrollable
      max-width="750px"
      transition="dialog-transition"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="showAllPermissionsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class=""></v-divider>
        <v-card-text class="pt-4">
          <v-alert
            type="error"
            border="bottom"
            outlined
            v-if="showEmptyPermissionsError"
          >
            {{ $t("pages.create_role.form.permissions.errors.empty") }}
          </v-alert>
          <checkboxes-list
            :auto-selected="supervisorPermissionsNames"
            :fields="permissionsList"
            @input="selected = $event"
            :readonly="!editMode && !loading"
          />
        </v-card-text>
        <v-divider class=""></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn v-if="!editMode" @click="editMode = true" color="primary">{{
            $t("components.list_permissions.edit_btn")
          }}</v-btn>
          <span v-else>
            <v-btn @click="editMode = false" color="error">
              {{ $t("components.list_permissions.cancel_edit_btn") }}
            </v-btn>
            <span class="mx-2"></span>
            <v-btn
              @click="updatePermissions"
              color="primary"
              :loading="loading"
            >
              {{ $t("components.list_permissions.save_edit_btn") }}
            </v-btn>
          </span>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-chip
      v-for="(permission, index) in firstTwoPermissions"
      :key="index"
      color="success"
      outlined
      class="mx-1"
      small
    >
      {{ $t(`permissions.${permission.name}`) }}
    </v-chip>
    <v-btn
      small
      @click="showAllPermissionsDialog = true"
      rounded
      color="success"
    >
      <span v-if="countNotViewedPermissions > 0">
        +{{ countNotViewedPermissions }}
        <span class="mx-2"></span>
      </span>
      <v-icon>mdi-eye</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { updateRolePermissions } from "../../api/roles";
import { getSystemPermissions } from "../../api/supervisors";
import checkboxesList from "../checkboxesList.vue";
export default {
  components: { checkboxesList },
  props: {
    permissions: {
      type: Array,
      default: () => [],
    },
    role: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      editMode: false,
      systemPermissions: [],
      selected: [],
      showAllPermissionsDialog: false,
      loading: false,
      showEmptyPermissionsError: false,
    };
  },
  computed: {
    firstTwoPermissions() {
      const permissions = [];
      if (this.permissions.length > 0) permissions.push(this.permissions[0]);
      if (this.permissions.length > 1) permissions.push(this.permissions[1]);
      return permissions;
    },
    countNotViewedPermissions() {
      return this.permissions.length - this.firstTwoPermissions.length;
    },
    permissionsList() {
      const list = [];
      for (let permission of this.systemPermissions) {
        list.push({
          value: permission,
          label: this.$t(`permissions.${permission}`),
        });
      }
      return list;
    },
    supervisorPermissionsNames() {
      const list = [];
      for (let permission of this.permissions) {
        list.push(permission.name);
      }
      return list;
    },
  },
  async created() {
    await this.loadPermissions();
  },
  methods: {
    async loadPermissions() {
      try {
        const response = await getSystemPermissions();
        this.systemPermissions = response.data.data.permissions;
      } catch (error) {
        alert(error);
      }
    },
    async updatePermissions() {
      this.showEmptyPermissionsError = false;

      if (this.selected.length < 1) {
        this.showEmptyPermissionsError = true;
        return;
      }
      this.loading = true;
      try {
        const response = await updateRolePermissions(
          this.role.id,
          this.selected
        );
        console.log(response);
        this.showAllPermissionsDialog = false;
        this.$emit("updated", "API Event");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
