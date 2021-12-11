<template>
  <v-textarea
    type="text"
    :placeholder="field.placeholder"
    :label="field.label || field.name"
    v-model="inputtedValue"
    outlined
    color="primary"
    class="pa-0 ma-0"
    clearable
    counter
    :min="field.min"
    :max="field.max"
    rows="3"
    auto-grow
  ></v-textarea>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
      default: () => {},
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
