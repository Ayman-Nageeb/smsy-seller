<template>
  <div class="d-inline-block justify-center">
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <checkboxes-list :autoSelected="autoSelected" :fields="rolesList" @input="selected = $event" />
  </div>
</template>

<script>
import { getAllRoles } from "../../api/roles";
import checkboxesList from "../checkboxesList.vue";
export default {
  props: {
    autoSelected: {
      type: Array,
      default: () => [],
    },
  },
  components: { checkboxesList },
  data() {
    return {
      roles: [],
      selected: [],
      loading: true,
    };
  },
  computed: {
    rolesList() {
      const list = [];
      for (let role of this.roles) {
        list.push({
          value: role.id,
          label: role.name,
        });
      }
      return list;
    },
  },
  async created() {
    await this.loadRoles();
  },
  methods: {
    async loadRoles() {
      this.lading = true;
      try {
        const response = await getAllRoles(false, false);
        this.roles = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
  watch: {
    selected(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style></style>
