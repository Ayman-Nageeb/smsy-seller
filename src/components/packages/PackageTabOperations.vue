<template>
  <div class="">
    <protected-view
      :has="['packages::update']"
      v-if="status.toUpperCase() == 'ACTIVE'"
    >
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="error" large @click="$emit('deactivate', 'UI EVENT')">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>{{$t('pages.show_package.actions.deactivate')}}</span>
        </v-btn>
      </locked-view>
    </protected-view>
    <protected-view
      :has="['packages::update']"
      v-if="status.toUpperCase() == 'INACTIVE'"
    >
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="success" large @click="$emit('activate', 'UI EVENT')">
          <v-icon>mdi-check</v-icon>
          <span class="mx-1"></span>
          <span>{{$t('pages.show_package.actions.activate')}}</span>
        </v-btn>
      </locked-view>
    </protected-view>
    <protected-view :has="['packages::remove']" class="">
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="error" large @click="$emit('remove', 'UI EVENT')">
          <v-icon>mdi-delete</v-icon>
          <span class="mx-1"></span>
          <span>{{$t('misc.remove')}}</span>
        </v-btn>
      </locked-view>
    </protected-view>
  </div>
</template>

<script>
import LockedView from "../LockedView.vue";
import ProtectedView from "../ProtectedView.vue";
export default {
  components: { LockedView, ProtectedView },
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
};
</script>

<style></style>
