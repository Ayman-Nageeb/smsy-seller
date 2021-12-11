<template>
  <v-chip small :color="status.toUpperCase() == 'ACTIVE' ? `success` : `error`">
    {{ $t(`models.supervisor.status.${status}`) }}</v-chip
  >
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
};
</script>

<style></style>
