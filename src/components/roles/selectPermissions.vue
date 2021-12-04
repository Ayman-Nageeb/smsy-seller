<template>
  <div class="d-inline-block justify-center">
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <checkboxes-list :fields="permissionsList" @input="selected = $event" />
  </div>
</template>

<script>
import { getSystemPermissions } from "../../api/supervisors";
import checkboxesList from "../checkboxesList.vue";
export default {
  components: { checkboxesList },
  data() {
    return {
      permissions: [],
      selected: [],
      loading: true,
    };
  },
  computed: {
    permissionsList() {
      const list = [];
      for (let permission of this.permissions) {
        list.push({
          value: permission,
          label: this.$t(`permissions.${permission}`),
        });
      }
      return list;
    },
  },
  async created() {
    await this.loadPermissions();
  },
  methods: {
    async loadPermissions() {
      this.lading = true;
      try {
        const response = await getSystemPermissions();
        this.permissions = response.data.data.permissions;
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
