<template>
  <v-dialog
    v-model="show"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        {{ $t("components.pupup_edit.title") }}
        {{ field.label || field.name }}
      </v-card-title>
      <v-card-text class="pt-8">
        <div v-if="datatype.toLowerCase() == 'string'">
          <string-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="datatype.toLowerCase() == 'password'">
          <password-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="datatype.toLowerCase() == 'text'">
          <text-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="datatype.toLowerCase() == 'numeric'">
          <numeric-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="datatype.toLowerCase() == 'menu'">
          <menu-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="datatype.toLowerCase() == 'combobox'">
          <combobox-edit :field="field" @save="submitData" @input="syncValue" />
        </div>
        <div v-if="hasError">
          <v-alert
            type="error"
            border="bottom"
            dismissible
            prominent
            dense
            outlined
          >
            <p class="">
              {{ errorMsg }}
            </p>
            <v-divider class=""></v-divider>
            <div class="my-2 font-wieght-black">
              {{ errorResponse.message }}
            </div>
            <details>
              <summary>{{ $t("errors.details.title") }}</summary>
              <ul>
                <li v-for="(messages, key) in errorResponse.errors" :key="key">
                  <details>
                    <summary>{{ key }}</summary>
                    <ul>
                      <li v-for="(message, index) in messages" :key="index">
                        {{ message }}
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
              <ul>
                <li
                  v-for="(message, index) in errorResponse.messages"
                  :key="index"
                >
                  {{ message }}
                </li>
              </ul>
            </details>
          </v-alert>
        </div>
      </v-card-text>
      <v-card-actions class="pa-4 ma-0">
        <v-spacer></v-spacer>
        <v-btn large text color="error" @click="cancel">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1">
            {{ $t("components.pupup_edit.actions.cancel") }}
          </span>
        </v-btn>
        <v-btn large color="primary" @click="submitData" :loading="loading">
          <v-icon class="mx-1">mdi-content-save</v-icon>

          <span class="mx-2">
            {{ $t("components.pupup_edit.actions.save") }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../api";
import ComboboxEdit from "./popupEdits/ComboboxEdit.vue";
import MenuEdit from "./popupEdits/MenuEdit.vue";
import NumericEdit from "./popupEdits/NumericEdit.vue";
import PasswordEdit from "./popupEdits/PasswordEdit.vue";
import StringEdit from "./popupEdits/StringEdit.vue";
import TextEdit from "./popupEdits/TextEdit.vue";
export default {
  components: {
    StringEdit,
    TextEdit,
    NumericEdit,
    MenuEdit,
    ComboboxEdit,
    PasswordEdit,
  },
  props: {
    field: {
      type: Object,
      default: () => {},
      required: true,
    },
    showDialog: {
      type: Boolean,
    },

    datatype: {
      type: String,
      default: "string",
    },
    apiEndPoint: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dataValue: null,
      loading: false,
      hasError: false,
      errorMsg: "",
      errorResponse: {},
    };
  },
  mounted() {
    if (this.field.default) {
      this.dataValue = this.field.default;
    } else {
      this.dataValue = this.field.value;
    }
  },
  computed: {
    show: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel", "UI EVENT");
    },
    syncValue(val) {
      this.dataValue = val;
    },
    async submitData() {
      this.hasError = false;
      if (this.apiEndPoint.toLowerCase() == "") {
        this.$emit("updated", this.dataValue);
        return;
      }
      this.loading = true;

      const requestData = {};
      if (this.field.confirmation) {
        requestData[this.field.name] = this.dataValue.value;
        requestData[this.field.confirmation.name] = this.dataValue.confirmation;
      } else {
        requestData[this.field.name] = this.dataValue;
      }

      try {
        const response = await api.put(this.apiEndPoint, requestData);
        console.log("popup edit :", response.data);
        this.$emit("updated", this.dataValue);
      } catch (error) {
        this.hasError = true;
        this.errorMsg = error;
        if (error.response.data) {
          console.error(error.response.data);
          this.errorResponse = error.response.data;
        }
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
