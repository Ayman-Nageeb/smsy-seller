<template>
  <v-text-field
    outlined
    :placeholder="
      placeholder.trim() == ''
        ? $t('components.search_field.placeholder')
        : placeholder
    "
    v-model="value"
    :append-icon="`mdi-magnify ${$t('direction').toLowerCase() == 'rtl'? 'mdi-rotate-90': ''}`"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    filterQuery: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["input", "update:filterQuery"],
  created() {
    
  },
  computed: {
    value: {
      get() {
        return this.filterQuery;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style></style>
