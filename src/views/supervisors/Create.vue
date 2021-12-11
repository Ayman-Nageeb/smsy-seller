<template>
  <v-dialog width="800" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_supervisor.title") }}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>

      <v-card-text class="pt-4">
        <v-row>
          <v-col>
            <v-text-field
              type="text"
              :placeholder="$t('pages.create_supervisor.form.name.placeholder')"
              :label="$t('pages.create_supervisor.form.name.label')"
              v-model="name"
              outlined
              :error-messages="nameErrors"
              block
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              :placeholder="
                $t('pages.create_supervisor.form.user_name.placeholder')
              "
              :label="$t('pages.create_supervisor.form.user_name.label')"
              v-model="userName"
              outlined
              :error-messages="userNameErrors"
              block
              prepend-inner-icon="mdi-at"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="generatedPassword.trim() != ''">
          <v-col>
            <v-snackbar :timeout="3000" v-model="showPasswordCopiedSnakbar" color="success">
              <template v-slot:action="{ attrs }">
                {{ $t("pages.create_supervisor.password_copied_successfully") }}
                <v-btn
                  color="error"
                  icon
                  v-bind="attrs"
                  @click="showPasswordCopiedSnakbar = false"
                >
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-snackbar>
            <v-alert
              type="success"
              border="bottom"
              
              outlined
              prominent
              
              dense
              icon="mdi-lock"
              close-icon="mdi-check"
            >
              <p>
                {{ $t("pages.create_supervisor.copy_generated_password") }}
              </p>
              <v-text-field
                outlined
                class="d-inline-block mx-2"
                :readonly="true"
                v-model="generatedPassword"
                color="success"
                dense
                append-icon="mdi-content-copy"
                @click:append="copyGeneratedPassword"
                ref="generatedPasswordTextField"
              ></v-text-field>
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <span class="font-weight-bold">
                {{ $t("pages.create_supervisor.form.roles.label") }}
              </span>
              ({{ $t("pages.create_supervisor.form.roles.placeholder") }})
            </div>
            <v-alert
              type="error"
              border="bottom"
              outlined
              v-if="showEmptyRolesError"
            >
              {{ $t("pages.create_supervisor.form.roles.errors.empty") }}
            </v-alert>

            <select-supervisors @input="roles = $event" class="mx-auto" />
          </v-col>
        </v-row>
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
import { addSupervisor, setRoles } from "../../api/supervisors";
import SelectSupervisors from "../../components/supervisors/selectSupervisorRoles.vue";
import { mainEventBus } from "../../main";
export default {
  components: { SelectSupervisors },
  data() {
    return {
      name: "",
      userName: "",
      dialog: true,
      roles: [],
      permissions: [],
      nameErrors: [],
      userNameErrors: [],
      loading: false,
      showEmptyRolesError: false,
      generatedPassword: "",
      showPasswordCopiedSnakbar: false,
    };
  },

  methods: {
    copyGeneratedPassword() {
      let textToCopy = this.$refs.generatedPasswordTextField.$el.querySelector(
        "input"
      );
      textToCopy.select();
      window.document.execCommand("copy");
      this.showPasswordCopiedSnakbar = true;
    },
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.userNameErrors = [];
      this.showEmptyRolesError = false;
      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_supervisor.form.name.errors.empty")
        );
        return;
      }
      if (this.userName.trim() == "") {
        this.userNameErrors.push(
          this.$t("pages.create_supervisor.form.user_name.errors.empty")
        );
        return;
      }
      if (this.roles.length < 1) {
        this.showEmptyRolesError = true;
        return;
      }
      this.loading = true;
      try {
        const additionResponse = await addSupervisor(this.name, this.userName);
        const supervisor = additionResponse.data.data;
        
        await setRoles(supervisor.id, this.roles);
        this.generatedPassword = supervisor.password;

        mainEventBus.$emit("supervisorCreated", supervisor);
        this.$emit("supervisorCreated", supervisor);
        // this.goBack();
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.user_name)
            this.userNameErrors = error.response.data.errors.user_name;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
