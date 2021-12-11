<template>
  <div>
    <v-text-field
      :type="showPassword ? 'text' : 'password'"
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
      prepend-inner-icon="mdi-lock"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showPassword = !showPassword"
      @input="update"
    ></v-text-field>
    <div class="my-2"></div>
    <v-text-field
      :type="showPassword ? 'text' : 'password'"
      :placeholder="field.placeholder"
      :label="field.confirmation.label || field.confirmation.name"
      v-model="confirmationValue"
      outlined
      color="primary"
      class="pa-0 ma-0"
      clearable
      counter
      :min="field.min"
      :max="field.max"
      prepend-inner-icon="mdi-lock"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showPassword = !showPassword"
      @input="update"
    ></v-text-field>
  </div>
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
      showPassword: false,
      confirmationValue: "",
    };
  },
  mounted() {
    if (!this.field.value) this.inputtedValue = this.field.default;
    else this.inputtedValue = this.field.value;
  },
  methods: {
    update() {
      this.$emit("input", {
        value: this.inputtedValue,
        confirmation: this.confirmationValue,
      });
    },
  },
  computed: {},
};
</script>

<style></style>
