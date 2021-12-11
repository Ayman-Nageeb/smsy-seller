<template>
  <v-select
    v-model="inputtedValue"
    :items="field.items"
    :item-text="field.itemText"
    :item-value="field.itemValue"
    :label="field.label || field.name"
    outlined
  ></v-select>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputtedValue: "",
    };
  },
  mounted() {
    if (!this.field.value) this.inputtedValue = this.field.default;
    else this.inputtedValue = this.field.value;
  },
  watch: {
    inputtedValue() {
      this.$emit("input", this.inputtedValue);
    },
  },
  computed: {},
};
</script>

<style></style>
