<template>
  <protected-view :has="has" :hasOneOf="hasOneOf">
    <v-btn x-large route :to="{ name: routeName }" color="primary">
      <v-icon size="28">mdi-plus</v-icon>
      <span class="mx-1"></span>
      <span>
        {{
          text.trim() == "" ? $t("components.search_field.default_text") : text
        }}
      </span>
    </v-btn>
  </protected-view>
</template>

<script>
export default {
  props: {
    has: {
      type: Array,
      default: () => [],
    },
    hasOneOf: {
      type: Array,
      default: () => [],
    },
    routeName: {
      type: String,
      name: "NotFound",
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style></style>
