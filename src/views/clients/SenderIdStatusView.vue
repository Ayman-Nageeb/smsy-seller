<template>
  <v-chip small :color="status.toUpperCase() == 'ACTIVE' ? `success` : `error`">
    {{ $t(`models.sender_ids.status.${status}`) }}</v-chip
  >
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      default: ""
    },
  },
};
</script>

<style></style>
