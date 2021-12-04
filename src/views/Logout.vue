<template>
  <v-container class="d-flex justify-center align-center" fill-height>
    <v-row>
      <v-col>
        <v-card
          :loading="status == 'loading'"
          class="ma-6 mx-auto"
          max-width="500"
          :loader-height="100"
          :color="cardColor"
          outlined
        >
          <v-card-title>
            <v-spacer></v-spacer>
            <span v-if="status == 'loading'">
              {{ $t("pages.logout.loading") }}
            </span>

            <span v-if="status == 'error'">
              {{ $t("pages.logout.unknown_error") }}
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { logout as logoutSupervisor } from "../api/supervisors";
export default {
  data() {
    return {
      loading: true,
      status: "loading",
    };
  },
  computed: {
    cardColor() {
      switch (this.status) {
        case "loading":
          return "";
        case "error":
          return "error";
        default:
          return "";
      }
    },
  },
  async created() {
    await this.logout();
  },
  methods: {
    async logout() {
      this.status = "loading";
      let tokens = "current";
      try {
        await logoutSupervisor(tokens);

        this.$store.dispatch("Supervisors/logout");

        this.$router.push({ name: "Login" });
      } catch (error) {
        this.status = "error";
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
