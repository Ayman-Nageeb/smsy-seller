<template>
  <v-dialog width="800" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_role.title") }}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-title class="d-inline-block ">
        <div>
          <v-text-field
            type="text"
            :placeholder="$t('pages.create_role.form.name.placeholder')"
            :label="$t('pages.create_role.form.name.placeholder')"
            v-model="name"
            outlined
            :error-messages="nameErrors"
            block
          ></v-text-field>
          <span class="font-weight-bold">
            {{ $t("pages.create_role.form.permissions.label") }}
          </span>
          ({{ $t("pages.create_role.form.permissions.placeholder") }})
        </div>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-alert
          type="error"
          border="bottom"
          outlined
          v-if="showEmptyPermissionsError"
        >
          {{ $t("pages.create_role.form.permissions.errors.empty") }}
        </v-alert>

        <select-permissions @input="permissions = $event" class="mx-auto" />
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-2">
        <v-spacer></v-spacer>

        <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("pages.create_role.form.cancel") }}</span>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large color="primary" :loading="loading" @click="save">
          <v-icon>mdi-content-save</v-icon>
          <span class="mx-2"></span>
          <span>{{ $t("pages.create_role.form.save") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import responseCodes from "../../api/responseCodes";
import { addRole } from "../../api/roles";
import SelectPermissions from "../../components/roles/selectPermissions.vue";
import { mainEventBus } from "../../main";
export default {
  components: { SelectPermissions },
  data() {
    return {
      name: "",
      dialog: true,
      permissions: [],
      nameErrors: [],
      loading: false,
      showEmptyPermissionsError: false,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.showEmptyPermissionsError = false;
      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_role.form.name.errors.empty")
        );
        return;
      }
      if (this.permissions.length < 1) {
        this.showEmptyPermissionsError = true;
        return;
      }
      this.loading = true;
      try {
        const response = await addRole(this.name, this.permissions);
        mainEventBus.$emit("roleCreated", response.data.data.role);
        this.$emit("roleCreated", response.data.data.role);
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
