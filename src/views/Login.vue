<template>
  <div style="height: 100vh; background:white">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col class="pt-6">
          <v-card
            class="pa-6 pt-0 mt-6 mx-auto login-container-box"
            elevation=""
            max-width="520"
            outlined
            :loading="loading"
            @keydown.enter="login"
          >
            <v-card-title class="pb-0">
              <v-spacer></v-spacer>
              <v-img :src="require('../assets/ocean_logo.png')"></v-img>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-title class="pt-2 mb-4">
              <v-spacer></v-spacer>
              <span class="primary--text font-weight-black">{{
                $t("pages.login.title")
              }}</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-title class="pt-0 mb-4">
              <v-spacer></v-spacer>
              <span class="blue--text headline">{{
                $t("pages.login.subtitle")
              }}</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="pb-0">
              <v-text-field
                type="text"
                :placeholder="$t('pages.login.fields.user_name.placeholder')"
                :label="$t('pages.login.fields.user_name.label')"
                prepend-inner-icon="mdi-account"
                outlined
                v-model="userName"
                :error-messages="userNameErrors"
              >
              </v-text-field>
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('pages.login.fields.password.placeholder')"
                :label="$t('pages.login.fields.password.label')"
                prepend-inner-icon="mdi-lock"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                v-model="password"
                :error-messages="passwordErrors"
              ></v-text-field>

              <v-alert
                :border="responseAlert.border"
                outlined
                prominent
                :type="responseAlert.type"
                v-if="responseAlert.show"
              >
                <ul>
                  <li
                    v-for="(message, index) of responseAlert.messages"
                    :key="index"
                  >
                    {{ message }}
                  </li>
                </ul>
              </v-alert>
            </v-card-text>

            <v-card-actions class="mt-0 px-4">
              <v-btn
                block
                color="indigo"
                x-large
                dark
                @click="login"
                :loading="loading"
              >
                {{ $t("pages.login.actions.login") }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card max-width="540" class="mx-auto" flat>
            <v-card-actions>
              <v-btn small text class="mx-1" @click="changeLocale('ar')"
                >العربية</v-btn
              >

              <v-btn small text class="mx-1" @click="changeLocale('en')"
                >english</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-container-box {
  border: 1px solid rgba(76, 0, 130, 0.603) !important;
  border-radius: 12px !important;
}
</style>

<script>
import { mainEventBus } from "../main";
import { login as supervisorsLogin } from "../api/supervisors";
import responseCodes from "../api/responseCodes";
export default {
  name: "Home",
  data: () => ({
    showPassword: false,
    userName: "",
    password: "",
    userNameErrors: [],
    passwordErrors: [],
    loading: false,
    responseAlert: {
      show: false,
      messages: [],
      type: "warning",
      border: "left",
    },
  }),
  components: {},
  created() {
    this.responseAlert.border =
      this.$t("direction").toLowerCase() == "rtl" ? "right" : "left";
  },
  methods: {
    changeLocale(locale) {
      mainEventBus.$emit("changeLocale", locale);
    },
    async login() {

      //if already trying to login dont try again
      if (this.loading) return false;

      //remove all errors
      this.userNameErrors = [];
      this.passwordErrors = [];

      //set request data
      const userName = this.userName;
      const password = this.password;
      const userData = {
        user_name: userName,
        password: password,
      };

      //hide response alert
      this.responseAlert.show = false;

      // try to login
      this.loading = true;

      try {
        const response = await supervisorsLogin(userData);
        const data = response.data;

        this.responseAlert.type = "success";

        if (data.hasError) {
          this.responseAlert.type = "error";
        }
        this.responseAlert.messages = data.messages;
        this.responseAlert.show = true;

        //set the current authenticated supervisor data

        await this.$store.dispatch("Supervisors/login", data.data);
        
        //redirect the user to next

        let next = "Home";
        if (this.$route.query.next) {
          next = this.$route.query.next;
        }
        this.$router.push({ name: next });
      } catch (error) {
        //get the response from the server
        const errorResponse = error.response;
        const errorData = errorResponse.data;

        //if the sent data is not valid
        if (errorResponse.status == responseCodes.HTTP_UNPROCESSABLE_ENTITTY) {
          if (errorData.errors.user_name) {
            this.userNameErrors = errorData.errors.user_name;
          }
          if (errorData.errors.password) {
            this.passwordErrors = errorData.errors.password;
          }
        } else {
          //show the response message
          this.responseAlert.show = true;
          this.responseAlert.type = "error";
          this.responseAlert.messages = errorData.messages;

          //show error indicator in fields
          this.userNameErrors.push("");
          this.passwordErrors.push("");
        }
      }
      this.loading = false;
    },
  },
};
</script>
