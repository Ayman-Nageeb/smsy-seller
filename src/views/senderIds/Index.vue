<template>
  <div>
    <router-view></router-view>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="display-2">{{ $t("pages.sender_ids.title") }}</h2>
            <p class="my-2">{{ $t("pages.sender_ids.subtitle") }}</p>
          </div>
          <add-form-route :has="['sender_id::add']" routeName="SenderIds.create" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <protected-view :has="['sender_id::retrieve']">
          <list-sender-ids />
        </protected-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddFormRoute from "../../components/AddFormRoute.vue";
import ListSenderIds from '../../components/sender_ids/ListSenderIds.vue';
export default {
  components: { AddFormRoute, ListSenderIds },
  async created() {
    this.$permissions().authorizeOneOf([
      "roles::add",
      "roles::remove",
      "roles::retrieve",
      "roles::update",
      "roles::view_permissions",
      "roles::set_permissions",
    ]);
    await this.loadRoles();
  },
  data() {
    return {
      filterQuery: "",
    };
  },
  mounted() {
    // this.authorize();
  },
  methods: {
    authorize() {
      const permissions = [
        "roles::add",
        "roles::remove",
        "roles::retrieve",
        "roles::update",
        "roles::view_permissions",
        "roles::set_permissions",
      ];
      this.$permissions().authorizeOneOf(permissions);
    },
    async loadRoles() {},
  },
};
</script>

<style></style>
