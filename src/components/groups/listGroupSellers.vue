<template>
  <div>
    <v-dialog
      v-model="showAllSupervisorsDialog"
      scrollable
      max-width="750px"
      transition="dialog-transition"
    >
      <v-card class="" elevation="" max-width="">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="showAllSupervisorsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class=""></v-divider>
        <v-card-text>
          <checkboxes-list
            :auto-selected="supervisorsIDs"
            :fields="supervisorsList"
            :readonly="true"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-chip
      v-for="(supervisor, index) in firstTwoSupervisors"
      :key="index"
      color="primary"
      outlined
      class="mx-1"
      small
    >
      {{ supervisor.user_name }}
    </v-chip>
    <v-btn
      small
      @click="showAllSupervisorsDialog = true"
      rounded
      color="primary"
      v-if="countNotViewedSupervisors"
    >
      <span> +{{ countNotViewedSupervisors }} </span>
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
    supervisors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showAllSupervisorsDialog: false,
    };
  },
  computed: {
    firstTwoSupervisors() {
      const supervisors = [];
      if (this.supervisors.length > 0) supervisors.push(this.supervisors[0]);
      if (this.supervisors.length > 1) supervisors.push(this.supervisors[1]);
      return supervisors;
    },
    countNotViewedSupervisors() {
      return this.supervisors.length - this.firstTwoSupervisors.length;
    },
    supervisorsList() {
      const list = [];
      for (let supervisor of this.supervisors) {
        list.push({
          value: supervisor.id,
          label: `${supervisor.name} (@${supervisor.user_name})` ,
        });
      }
      return list;
    },
    supervisorsIDs() {
      const list = [];
      for (let supervisor of this.supervisors) {
        list.push(supervisor.id);
      }
      return list;
    },
  },
};
</script>

<style></style>
