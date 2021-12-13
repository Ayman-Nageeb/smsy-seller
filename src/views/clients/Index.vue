<template>
  <div>
    <router-view></router-view>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">
              {{ $t("pages.clients.title") }}
            </h2>
            <p class="my-2">{{ $t("pages.clients.subtitle") }}</p>
          </div>
          <add-form-route routeName="Clients.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <list-clients />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Sugar from "sugar";
import AddFormRoute from "../../components/AddFormRoute.vue";
import ListClients from './ListClients.vue';
export default {
  components: { AddFormRoute, ListClients },
  methods: {
    showDate() {
      alert(Sugar.Date().relative());
    },
  },
  created() {
  
  },
};
</script>

<style></style>
