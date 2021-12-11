<template>
  <div>
    <v-dialog
      v-model="showAllRolesDialog"
      scrollable
      max-width="750px"
      transition="dialog-transition"
    >
      <v-card class="" elevation="" max-width="">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="showAllRolesDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class=""></v-divider>
        <v-card-text>
          <checkboxes-list
            :auto-selected="rolesIDs"
            :fields="rolesList"
            :readonly="true"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-chip
      v-for="(role, index) in firstTwoRoles"
      :key="index"
      color="primary"
      outlined
      class="mx-1"
      small
    >
      {{ role.name }}
    </v-chip>
    <v-btn
      small
      @click="showAllRolesDialog = true"
      rounded
      color="primary"
      v-if="countNotViewedRoles"
    >
      <span> +{{ countNotViewedRoles }} </span>
      <span class="mx-2"></span>
      <v-icon>mdi-eye</v-icon>
    </v-btn>
  </div>
</template>

<script>
import checkboxesList from '../checkboxesList.vue';
export default {
  components: { checkboxesList },
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showAllRolesDialog: false,
    };
  },
  computed: {
    firstTwoRoles() {
      const roles = [];
      if (this.roles.length > 0) roles.push(this.roles[0]);
      if (this.roles.length > 1) roles.push(this.roles[1]);
      return roles;
    },
    countNotViewedRoles() {
      return this.roles.length - this.firstTwoRoles.length;
    },
    rolesList() {
      const list = [];
      for (let role of this.roles) {
        list.push({
          value: role.id,
          label: `${role.name}` ,
        });
      }
      return list;
    },
    rolesIDs() {
      const list = [];
      for (let role of this.roles) {
        list.push(role.id);
      }
      return list;
    },
  },
};
</script>

<style></style>
