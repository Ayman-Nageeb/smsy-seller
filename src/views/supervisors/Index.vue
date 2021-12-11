<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">
              {{ $t("pages.supervisors.title") }}
            </h2>
            <p class="my-2">{{ $t("pages.supervisors.subtitle") }}</p>
          </div>
          <add-form-route
            :has="['supervisors::add']"
            routeName="Supervisors.create"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['supervisors::retrieve']">
          <supervisors-list />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Sugar from "sugar";
import AddFormRoute from "../../components/AddFormRoute.vue";
import SupervisorsList from "../../components/supervisors/supervisorsList.vue";
export default {
  components: { AddFormRoute, SupervisorsList },
  methods: {
    showDate() {
      alert(Sugar.Date().relative());
    },
  },
  created() {
    this.$permissions().authorizeOneOf(["supervisors::retrieve"]);
  },
};
</script>

<style></style>
