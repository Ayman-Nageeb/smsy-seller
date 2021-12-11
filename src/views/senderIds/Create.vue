<template>
  <v-dialog width="800" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_sender_id.title") }}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title class="d-inline-block "> </v-card-title>

      <v-card-text class="pt-4">
        <v-text-field
          type="text"
          :placeholder="$t('pages.create_sender_id.form.name.placeholder')"
          :label="$t('pages.create_sender_id.form.name.label')"
          v-model="name"
          outlined
          :error-messages="nameErrors"
          block
        ></v-text-field>
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-2">
        <v-spacer></v-spacer>

        <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("misc.cancel") }}</span>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large color="primary" :loading="loading" @click="save">
          <v-icon>mdi-content-save</v-icon>
          <span class="mx-2"></span>
          <span>{{ $t("misc.save") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../api";
import responseCodes from "../../api/responseCodes";
import { mainEventBus } from "../../main";
export default {
  components: {},
  data() {
    return {
      name: "",
      dialog: true,
      nameErrors: [],
      loading: false,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_sender_id.form.name.errors.empty")
        );
        return;
      }

      this.loading = true;
      try {
        const response = await api.post("/sender-ids", {name: this.name});
        mainEventBus.$emit("updateSenderIds", response.data.data);
        this.goBack();
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          else alert(error);
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
