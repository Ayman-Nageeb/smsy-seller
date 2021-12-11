<template>
  <div class="d-inline-block">
    <popup-edit
      :show-dialog="showEditDialog"
      :datatype="type"
      :field="field"
      @cancel="showEditDialog = false"
      :apiEndPoint="apiEndPoint"
      @updated="updated"
    />
    <v-card
      class="d-flex align-center pa-0 ma-0"
      @mouseenter="showEditBtn = true"
      @mouseleave="showEditBtn = false"
      flat
      min-height="55"
      color="transparent"
    >
      <v-card-text class="pa-1">

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
              class="d-inline-block"
              @dblclick="showEditDialog = true"
            >
              <slot>
                <v-icon v-if="showEmptyValueIcon">mdi-dots-horizontal</v-icon>
                {{ field.value }}
              </slot>
            </div>
          </template>
          <span>{{
            fieldTooltip.toLowerCase() == ""
              ? $t("components.editable.field_tooltip")
              : fieldTooltip
          }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              class="mx-1"
              color="success"
              v-show="showEditBtn"
              @click="showEditDialog = true"
            >
              <v-icon
                >mdi-pencil
                {{
                  $t("direction").toLowerCase() == "rtl" ? "mdi-rotate-270" : ""
                }}</v-icon
              >
            </v-btn>
          </template>
          <span>{{
            btnTooltip.toLowerCase() == ""
              ? $t("components.editable.btn_tooltip")
              : btnTooltip
          }}</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import popupEdit from "./popupEdit.vue";
export default {
  components: { popupEdit },
  props: {
    type: {
      type: String,
      default: "string",
    },
    apiEndPoint: {
      type: String,
      default: "",
    },
    field: {
      type: Object,
      default: () => ({
        name: "",
        value: null,
        min: "",
        max: "",
        step: "",
      }),
    },
    btnTooltip: {
      type: String,
      default: "",
    },
    fieldTooltip: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showEditBtn: false,
      showEditDialog: false,
    };
  },
  computed: {
    showEmptyValueIcon() {
      
      if (this.field.value == null) {
        return true;
      }

      if (typeof this.field.value == "string") {
        const isEmptyString = this.field.value.trim() == "";
        return isEmptyString;
      }

      if (typeof this.field.value == "object") {
        const objectString = JSON.stringify(this.field.value);
        if (objectString == "{}" || objectString == "[]") return true;
        else return false;
      }



      if (!isNaN(this.field.value)) return false;

      return true;
    },
  },
  methods: {
    updated(newValue) {
      this.$emit("updated", newValue);
      this.showEditDialog = false;
    },
  },
};
</script>

<style></style>
