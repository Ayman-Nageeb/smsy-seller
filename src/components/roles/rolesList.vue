<template>
  <v-card class="pa-1" flat>
    <confirm-delete
      :show="showConfirmDeleteDialog"
      @cancel="
        showConfirmDeleteDialog = false;
        roleToDelete = -1;
      "
      @confirm="removeRoleFromBackEnd"
    />
    <v-card-text>
      <search-field v-model="search" />

      <v-data-table
        :headers="headers"
        :items="roles"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ value, item }">
          <editable
            :field="{ name: 'name', value: value }"
            :apiEndPoint="getEditRoleNameURL(item.id)"
            @updated="item.name = $event"
          >
          </editable>
        </template>
        <template v-slot:[`item.permissions`]="{ item }">
          <list-permissions
            :permissions="item.permissions"
            :role="item"
            @updated="loadRoles"
          />
        </template>
        <template v-slot:[`item.supervisors`]="{ item }">
          <list-supervisors :supervisors="item.supervisors" />
        </template>
        <template v-slot:[`item.remove`]="{ item }">
          <v-btn
            icon
            color="error"
            :disabled="item.supervisors.length > 0"
            @click="confirmDeletion(item.id)"
            :loading="removingRole && roleToDelete == item.id"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { editURL, getAllRoles, removeRole } from "../../api/roles";
import { mainEventBus } from "../../main";
import ConfirmDelete from "../confirmDelete.vue";
import Editable from "../Editable.vue";
import { datatableColumn } from "../ListDataTable.vue";
import SearchField from "../searchField.vue";
import ListPermissions from "./listPermissions.vue";
import ListSupervisors from "./listRoleSupervisors.vue";
export default {
  components: {
    SearchField,
    ListPermissions,
    ListSupervisors,
    Editable,
    ConfirmDelete,
  },
  data() {
    return {
      roles: [],
      loading: true,
      search: "",
      roleToDelete: -1,
      showConfirmDeleteDialog: false,
      removingRole: false,
    };
  },
  computed: {
    requestParams() {
      const withPermissions = this.$permissions().hasOneOf([
        "roles::view_permissions",
        "roles::set_permissions",
      ]);
      const withSupervisors = this.$permissions().has([
        "supervisors::view_permissions",
      ]);

      return {
        with_permissions: Number(withPermissions),
        with_supervisors: Number(withSupervisors),
      };
    },
    headers() {
      const headers = [
        datatableColumn(this.$t("pages.roles.datatable.headers.title"), "name"),
        datatableColumn(
          this.$t("pages.roles.datatable.headers.permissions"),
          "permissions",
          () => this.requestParams.with_permissions,
          {
            filerable: false,
          }
        ),
        datatableColumn(
          this.$t("pages.roles.datatable.headers.supervisors"),
          "supervisors",
          () => this.requestParams.with_supervisors
        ),
        datatableColumn(
          this.$t("pages.roles.datatable.headers.remove"),
          "remove",
          () => this.$permissions().has(["roles::remove"]),
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
  async created() {
    mainEventBus.$on("roleCreated", this.loadRoles);
    await this.loadRoles();
  },
  methods: {
    async loadRoles() {
      this.loading = true;

      const response = await getAllRoles(
        this.requestParams.with_permissions,
        this.requestParams.with_supervisors
      );
      this.roles = response.data.data;

      this.roles = this.roles.reverse();

      this.loading = false;
    },
    filterPermissions(value, search) {
      for (let permission of value) {
        console.log(
          this.$t(`permissions.${permission.name}`).toLowerCase(),
          this.$t(`permissions.${permission.name}`)
            .toLowerCase()
            .search(search)
        );
        if (
          this.$t(`permissions.${permission.name}`)
            .toLowerCase()
            .search(search) > -1
        ) {
          return true;
        }
      }
      return false;
    },
    getEditRoleNameURL(roleID) {
      return editURL(roleID);
    },
    confirmDeletion(roleID) {
      this.roleToDelete = roleID;
      this.showConfirmDeleteDialog = true;
    },
    async removeRoleFromBackEnd() {
      this.showConfirmDeleteDialog = false;
      this.removingRole = true;
      try {
        await removeRole(this.roleToDelete);
        for (let role of this.roles) {
          if (role.id == this.roleToDelete) {
            this.roles.splice(this.roles.indexOf(role), 1);
          }
        }
      } catch (error) {
        alert(error);
      }
      this.roleToDelete = -1;
      this.removingRole = false;
    },
  },
};
</script>

<style></style>
