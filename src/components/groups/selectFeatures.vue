<template>
  <div class="d-inline-block justify-center">
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <checkboxes-list :fields="featuresList" @input="selected = $event" />
  </div>
</template>

<script>
import { getSellersFeatures } from "../../api/sellers";
import checkboxesList from "../checkboxesList.vue";
export default {
  components: { checkboxesList },
  data() {
    return {
      features: [],
      selected: [],
      loading: true,
    };
  },
  computed: {
    featuresList() {
      const list = [];
      for (let feature of this.features) {
        list.push({
          value: feature,
          label: this.$t(`features.${feature}`),
        });
      }
      return list;
    },
  },
  async created() {
    await this.loadFeatures();
  },
  methods: {
    async loadFeatures() {
      this.lading = true;
      try {
        const response = await getSellersFeatures();
        this.features = response.data.data;
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
