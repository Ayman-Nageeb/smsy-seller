<template>
  <div class="d-inline-block justify-center">
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <checkboxes-list :autoSelected="autoSelected" :fields="groupsList" @input="selected = $event" />
  </div>
</template>

<script>
import { getAllGroups } from '../../api/groups';
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
      groups: [],
      selected: [],
      loading: true,
    };
  },
  computed: {
    groupsList() {
      const list = [];
      for (let group of this.groups) {
        list.push({
          value: group.id,
          label: group.name,
        });
      }
      return list;
    },
  },
  async created() {
    await this.loadGroups();
  },
  methods: {
    async loadGroups() {
      this.lading = true;
      try {
        const response = await getAllGroups(false, false);
        this.groups = response.data.data;
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
