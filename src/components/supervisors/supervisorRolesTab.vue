<template>
  <div class="d-inline-block justify-center">
    <div>
      <p class="headline">
        {{ $t("components.supervisor_roles_tab.roles.title") }}
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="loadingRoles"
        ></v-progress-circular>
        <v-btn
          large
          v-if="!selectRolesMode && !loadingRoles"
          @click="selectRolesMode = true"
          color="primary"
        >
          <v-icon>mdi-pencil</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("misc.edit") }}</span>
        </v-btn>
      </p>
      <div>
        <div v-if="!selectRolesMode">
          <v-chip
            color="primary"
            v-for="(role, index) of supervisorRoles"
            :key="index"
            class="mx-2 my-1"
            outlined
          >
            {{ role.name }}
          </v-chip>
        </div>
        <div v-else>
          <v-alert
            type="error"
            border="bottom"
            outlined
            v-if="showEmptyRolesError"
          >
            {{ $t("pages.create_supervisor.form.roles.errors.empty") }}
          </v-alert>
          <select-supervisors
            :autoSelected="supervisorRolesIds"
            @input="newRoles = $event"
          />
          <v-btn large color="error" @click="selectRolesMode = false">
            <v-icon>mdi-cancel</v-icon>
            <span class="mx-1"></span>
            <span>{{ $t("misc.cancel") }}</span>
          </v-btn>
          <span class="mx-2"></span>
          <v-btn large color="primary" @click="saveNewRoles">
            <v-icon>mdi-content-save</v-icon>
            <span class="mx-1"></span>
            <span>{{ $t("misc.save") }}</span>
          </v-btn>
        </div>
      </div>
    </div>
    <div class="my-6"></div>
    <div>
      <p class="headline">
        {{ $t("components.supervisor_roles_tab.permissions.title") }}
        <v-progress-circular
          indeterminate
          color="success"
          v-if="loadingPermissions"
        ></v-progress-circular>
      </p>
      <div>
        <v-chip
          color="success"
          v-for="(permission, index) of supervisorPermissions"
          :key="index"
          class="mx-2 my-1"
          outlined
        >
          {{ $t(`permissions.${permission}`) }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllRoles } from "../../api/roles";
import {
  getSupervisorPermissions,
  getSupervisorRoles,
  syncRoles,
} from "../../api/supervisors";
import { mainEventBus } from '../../main';
import selectSupervisors from "./selectSupervisorRoles.vue";
export default {
  components: { selectSupervisors },
  props: {
    supervisorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectRolesMode: false,
      newRoles: [],
      showEmptyRolesError: false,

      loadingRoles: false,
      loadingPermissions: false,
      loadingSystemRoles: false,

      supervisorPermissions: [],
      supervisorRoles: [],
      systemRoles: [],
    };
  },
  computed: {
    supervisorRolesIds() {
      const list = [];
      for (let role of this.supervisorRoles) {
        list.push(role.id);
      }
      return list;
    },
  },
  async created() {
    this.$permissions().authorizeOneOf([
      "supervisors::view_role",
      "supervisors::set_role",
      "supervisors::revoke_role",
      "supervisors::view_permissions",
    ]);
    this.loadSupervisorRoles();
    this.loadSupervisorPermissions();
  },
  methods: {
    async loadSupervisorRoles() {
      this.loadingRoles = true;
      try {
        const response = await getSupervisorRoles(this.supervisorId);

        this.supervisorRoles = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loadingRoles = false;
    },
    async loadSupervisorPermissions() {
      this.loadingPermissions = true;
      try {
        const response = await getSupervisorPermissions(this.supervisorId);
        this.supervisorPermissions = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loadingPermissions = false;
    },
    async loadSystemRoles() {
      this.loadingSystemRoles = true;

      const response = await getAllRoles(false, false);
      this.systemRoles = response.data.data;

      this.systemRoles = this.roles.reverse();

      this.loadingSystemRoles = false;
    },
    async saveNewRoles() {
      this.showEmptyRolesError = false;
      if (this.newRoles.length < 1) {
        this.showEmptyRolesError = true;
        return;
      }
      this.loadingRoles = true;
      try {
        await syncRoles(this.supervisorId, this.newRoles);
        this.selectRolesMode = false;
        this.loadSupervisorRoles();
        this.loadSupervisorPermissions();
        mainEventBus.$emit("updateSupervisors", "API EVENT");

      } catch (error) {
        alert(error);
      }
      this.loadingRoles = true;
    },
  },
};
</script>

<style></style>
