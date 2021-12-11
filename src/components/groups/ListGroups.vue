<template>
  <v-card class="pa-1" flat>
    <confirm-delete
      :show="showConfirmDeleteDialog"
      @cancel="
        showConfirmDeleteDialog = false;
        groupToDelete = -1;
      "
      @confirm="removeGroupFromBackEnd"
    />
    <v-card-text>
      <search-field v-model="search" />

      <v-data-table
        :headers="headers"
        :items="groups"
        :loading="loading"
        :search="search"
      >
        <template v-slot:[`item.name`]="{ value, item }">
          <editable
            :field="{ name: 'name', value: value }"
            :apiEndPoint="getEditGroupNameURL(item.id)"
            @updated="item.name = $event"
          >
          </editable>
        </template>
        <template v-slot:[`item.features`]="{ item }">
          <list-features
            :permissions="item.features"
            :role="item"
            @updated="loadGroups"
          />
        </template>
        <template v-slot:[`item.sellers`]="{ item }">
          <list-group-sellers :supervisors="item.sellers" />
        </template>
        <template v-slot:[`item.remove`]="{ item }">
          <v-btn
            icon
            color="error"
            :disabled="item.sellers.length > 0"
            @click="confirmDeletion(item.id)"
            :loading="removingGroup && groupToDelete == item.id"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { editURL, getAllGroups, removeGroup } from '../../api/groups';
import { mainEventBus } from "../../main";
import ConfirmDelete from "../confirmDelete.vue";
import Editable from "../Editable.vue";
import { datatableColumn } from "../ListDataTable.vue";
import SearchField from "../searchField.vue";
import ListFeatures from './listFeatures.vue';
import ListGroupSellers from './listGroupSellers.vue';
export default {
  components: {
    SearchField,
    Editable,
    ConfirmDelete,
    ListFeatures,
    ListGroupSellers,
  },
  data() {
    return {
      groups: [],
      roles: [],
      loading: true,
      search: "",
      groupToDelete: -1,
      showConfirmDeleteDialog: false,
      removingGroup: false,
    };
  },
  computed: {
    requestParams() {
      const withFeatures = this.$permissions().hasOneOf([
        "groups::view_features",
        "groups::set_features",
      ]);
      const withSellers = this.$permissions().has(["sellers::view_features"]);

      return {
        with_features: Number(withFeatures),
        with_sellers: Number(withSellers),
      };
    },
    headers() {
      const headers = [
        datatableColumn(this.$t("pages.groups.datatable.headers.title"), "name"),
        datatableColumn(
          this.$t("pages.groups.datatable.headers.features"),
          "features",
          () => this.requestParams.with_features,
          {
            filerable: false,
          }
        ),
        datatableColumn(
          this.$t("pages.groups.datatable.headers.sellers"),
          "sellers",
          () => this.requestParams.with_sellers
        ),
        datatableColumn(
          this.$t("pages.groups.datatable.headers.remove"),
          "remove",
          () => this.$permissions().has(["groups::remove"]),
          {
            align:
              this.$t("direction").toLowerCase() == "rtl" ? "left" : "right",
          }
        ),
      ];
      return headers.filter((item) => {
        if (item) return true;
        return false;
      });
    },
  },
  async created() {
    mainEventBus.$on("updateGroups", this.loadGroups);
    await this.loadGroups();
  },
  methods: {
    async loadGroups() {
      this.loading = true;

      const response = await getAllGroups(
        this.requestParams.with_features,
        this.requestParams.with_sellers
      );
      this.groups = response.data.data;

      this.groups = this.groups.reverse();

      this.loading = false;
    },
    filterPermissions(value, search) {
      for (let permission of value) {
        console.log(
          this.$t(`permissions.${permission.name}`).toLowerCase(),
          this.$t(`permissions.${permission.name}`)
            .toLowerCase()
            .search(search)
        );
        if (
          this.$t(`permissions.${permission.name}`)
            .toLowerCase()
            .search(search) > -1
        ) {
          return true;
        }
      }
      return false;
    },
    getEditGroupNameURL(id) {
      return editURL(id);
    },
    confirmDeletion(id) {
      this.groupToDelete = id;
      this.showConfirmDeleteDialog = true;
    },
    async removeGroupFromBackEnd() {
      this.showConfirmDeleteDialog = false;
      this.removingGroup = true;
      try {
        await removeGroup(this.groupToDelete);
        await this.loadGroups();
      } catch (error) {
        alert(error);
      }
      this.groupToDelete = -1;
      this.removingGroup = false;
    },
  },
};
</script>

<style></style>
