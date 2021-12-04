<template>
  <v-text-field
    type="text"
    :placeholder="placeholder"
    :label="label"
    v-model="inputtedValue"
    outlined
    color="primary"
    class="pa-0 ma-0"
    clearable
    counter
    :min="min"
    :max="max"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: String,
      required: true,
    },
    min: {},
    max: {},
  },
  data() {
    return {
      inputtedValue: "",
    };
  },
  mounted() {
    this.inputtedValue = this.defaultValue;
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
