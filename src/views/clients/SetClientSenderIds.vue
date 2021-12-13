<template>
  <div>
    <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>
    <checkboxes-list
      :fields="systemSenderIdsFields"
      @input="selectedIDs = $event; $emit('input', $event)"
      :autoSelected="autoSelected"
    />
  </div>
</template>

<script>
import api from '../../api';
import checkboxesList from '../../components/checkboxesList.vue';
export default {
  components: { checkboxesList },
  props: {
    autoSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      senderIds: [],
      selectedIDs: [],
    };
  },
  computed: {
    systemSenderIdsFields() {
      const list = [];
      for (let field of this.senderIds) {
        list.push({ label: field.name, value: field.id });
      }
      return list;
    },
  },
  created() {
    this.loadSenderIds();
  },
  methods: {
    async loadSenderIds() {
      this.loading = true;
      try {
        const response = await api.get("/current-seller/sender-ids");
        this.senderIds = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
