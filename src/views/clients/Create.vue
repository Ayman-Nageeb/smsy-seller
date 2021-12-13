<template>
  <v-dialog width="800" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_client.title") }}</p>
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
              :placeholder="$t('pages.create_client.form.name.placeholder')"
              :label="$t('pages.create_client.form.name.label')"
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
                $t('pages.create_client.form.user_name.placeholder')
              "
              :label="$t('pages.create_client.form.user_name.label')"
              v-model="userName"
              outlined
              :error-messages="userNameErrors"
              block
              prepend-inner-icon="mdi-at"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              type="text"
              :placeholder="$t('pages.create_client.form.email.placeholder')"
              :label="$t('pages.create_client.form.email.label')"
              v-model="email"
              outlined
              :error-messages="emailErrors"
              block
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              :placeholder="$t('pages.create_client.form.company.placeholder')"
              :label="$t('pages.create_client.form.company.label')"
              v-model="company"
              outlined
              :error-messages="companyErrors"
              block
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-combobox
              clearable
              hide-selected
              multiple
              outlined
              small-chips
              :placeholder="$t('pages.create_client.form.phones.placeholder')"
              :label="$t('pages.create_client.form.phones.label')"
              v-model="phones"
              :error-messages="phonesErrors"
            ></v-combobox>
          </v-col>
        </v-row>

        <v-row v-if="generatedPassword.trim() != ''">
          <v-col>
            <v-snackbar
              :timeout="3000"
              v-model="showPasswordCopiedSnakbar"
              color="success"
            >
              <template v-slot:action="{ attrs }">
                {{ $t("pages.create_client.password_copied_successfully") }}
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
                {{ $t("pages.create_client.copy_generated_password") }}
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
  components: {  },
  data() {
    return {
      name: "",
      userName: "",
      email: "",
      company: "",
      phones: [],
      dialog: true,
      groups: [],
      permissions: [],
      nameErrors: [],
      userNameErrors: [],
      emailErrors: [],
      companyErrors: [],
      phonesErrors: [],
      loading: false,
      showEmptyGroupsError: false,
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
      this.emailErrors = [];
      this.companyErrors = [];
      this.phonesErrors = [];
      
      if (this.name.trim() == "") {
        this.nameErrors.push(
          this.$t("pages.create_client.form.name.errors.empty")
        );
        return;
      }
      if (this.userName.trim() == "") {
        this.userNameErrors.push(
          this.$t("pages.create_client.form.user_name.errors.empty")
        );
        return;
      }
      
      this.loading = true;
      try {
        const data = {
          name: this.name,
          user_name: this.userName,
        };

        if (this.email.trim() != "") data["email"] = this.email;

        if (this.phones.length > 0) {
          data["phones"] = JSON.stringify(this.phones);
        }

        if (this.company.trim() != "") data["company"] = this.company;

        const additionResponse = await api.post(`/current-seller/clients`, data);
        const client = additionResponse.data.data;

        this.generatedPassword = client.password;

        mainEventBus.$emit("updateClients", client);
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

          if (error.response.data.errors.email)
            this.emailErrors = error.response.data.errors.email;
          if (error.response.data.errors.phones)
            this.phonesErrors = error.response.data.errors.phones;
          if (error.response.data.errors.company)
            this.companyErrors = error.response.data.errors.company;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
