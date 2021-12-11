<template>
  <div
    class="d-inline-block justify-center align-center pa-2"
    :class="{ 'outlined-box': disabled }"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          icon
          @dblclick="disabled = !disabled"
          @click="disabled = true"
        >
          <v-icon color="error" v-if="disabled">mdi-lock</v-icon>
          <v-icon color="success" v-else>mdi-lock-open</v-icon>
        </v-btn>
      </template>
      <span v-if="disabled">{{
        $t("components.locked_view.tooltips.open")
      }}</span>
      <span v-else>{{ $t("components.locked_view.tooltips.lock") }}</span>
    </v-tooltip>

    <v-card class="d-inline-block pa-0" flat :disabled="disabled">
      <v-card-text class="pa-1 ma-o">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: true,
      setDisableTimeOutId: null,
    };
  },
  watch: {
    disabled(value){
      if(this.setDisableTimeOutId){
        window.clearTimeout(this.setDisableTimeOutId);
      }
      if(value == false){
        this.setDisableTimeOutId = window.setTimeout(this.lockView, 7500)
      }
    }
  },
  methods: {
    lockView(){
      if(this.setDisableTimeOutId){
        window.clearTimeout(this.setDisableTimeOutId);
      }
      this.setDisableTimeOutId = null;
      this.disabled = true;
    }
  },
};
</script>

<style scoped>
.outlined-box {
  border: 2px dashed #aaa;
  border-radius: 10px;
}
</style>
