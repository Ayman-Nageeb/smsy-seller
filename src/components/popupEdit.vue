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
      <v-card-title >
        {{$t('components.pupup_edit.title')}}
        {{name}}
      </v-card-title>
      <v-card-text class="pt-8">
        <div v-if="datatype.toLowerCase() == 'string'">
          <string-edit
            :default-value="value"
            :label="name"
            @save="submitData"
            @input="syncValue"
          />
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
import StringEdit from "./popupEdits/StringEdit.vue";
export default {
  components: { StringEdit },
  props: {
    showDialog: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "",
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
      dataValue: "",
      loading: false,
      hasError: false,
      errorMsg: "",
      errorResponse: {},
    };
  },
  mounted() {
    this.dataValue = this.value;
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
      requestData[this.name] = this.dataValue;
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
