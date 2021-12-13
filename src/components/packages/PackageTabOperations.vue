<template>
  <div class="">
    <locked-view v-if="status.toUpperCase() == 'ACTIVE'">
      <v-btn color="error" large @click="$emit('deactivate', 'UI EVENT')">
        <v-icon>mdi-cancel</v-icon>
        <span class="mx-1"></span>
        <span>{{ $t("pages.show_package.actions.deactivate") }}</span>
      </v-btn>
    </locked-view>
    <div class="my-4"></div>
    <locked-view  v-if="status.toUpperCase() == 'INACTIVE'">
      <v-btn color="success" large @click="$emit('activate', 'UI EVENT')">
        <v-icon>mdi-check</v-icon>
        <span class="mx-1"></span>
        <span>{{ $t("pages.show_package.actions.activate") }}</span>
      </v-btn>
    </locked-view>
    <div class="my-4"></div>
    <locked-view>
      <v-btn color="error" large @click="$emit('remove', 'UI EVENT')">
        <v-icon>mdi-delete</v-icon>
        <span class="mx-1"></span>
        <span>{{ $t("misc.remove") }}</span>
      </v-btn>
    </locked-view>
  </div>
</template>

<script>
import LockedView from "../LockedView.vue";
export default {
  components: { LockedView, },
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style></style>
