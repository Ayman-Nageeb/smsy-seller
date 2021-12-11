<template>
  <v-combobox
    v-model="inputtedValue"
    :items="field.items"
    :label="field.label || field.name"
    clearable
    :multiple="field.multiple"
    outlined
    small-chips
    :placeholder="field.placeholder || field.label || field.name"
  ></v-combobox>
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
      inputtedValue: [],
    };
  },
  created() {
    if (!this.field.value) this.inputtedValue = this.field.default || [];
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
