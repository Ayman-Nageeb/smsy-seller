<template>
  <v-dialog width="850" scrollable persistent :value="true">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        <p class="headline">{{ $t("pages.create_package.title") }}</p>
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
              :placeholder="$t('pages.create_package.form.name.placeholder')"
              :label="$t('pages.create_package.form.name.label')"
              v-model="name"
              outlined
              :error-messages="nameErrors"
              block
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              :min="0"
              :step="1"
              :placeholder="
                $t('pages.create_package.form.capacity.placeholder')
              "
              :label="$t('pages.create_package.form.capacity.label')"
              v-model="capacity"
              outlined
              :error-messages="capacityErrors"
              block
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              type="number"
              :step="0.01"
              :min="0"
              :placeholder="$t('pages.create_package.form.price.placeholder')"
              :label="$t('pages.create_package.form.price.label')"
              v-model="price"
              outlined
              :error-messages="priceErrors"
              block
            ></v-text-field>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  type="number"
                  :step="1"
                  :min="0"
                  :placeholder="
                    $t('pages.create_package.form.duration.placeholder')
                  "
                  :label="$t('pages.create_package.form.duration.label')"
                  v-model="duration"
                  outlined
                  :error-messages="durationErrors"
                  block
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  :items="validDurations"
                  item-text="text"
                  item-value="code"
                  :placeholder="
                    $t('pages.create_package.form.duration_unit.placeholder')
                  "
                  :label="$t('pages.create_package.form.duration_unit.label')"
                  v-model="durationUnit"
                  outlined
                  :error-messages="durationUnitErrors"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <span class="font-weight-bold">
          {{ $t("pages.create_package.form.groups.label") }}
        </span>
        ({{ $t("pages.create_package.form.groups.placeholder") }})
        <v-alert
          type="error"
          border="bottom"
          outlined
          class="mt-4"
          v-if="showEmptyGroupsError"
        >
          {{ $t("pages.create_package.form.groups.errors.empty") }}
        </v-alert>
        <select-package-groups @input="groups = $event" class="mx-auto" />
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-2">
        <v-spacer></v-spacer>

        <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("pages.create_group.form.cancel") }}</span>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large color="primary" :loading="loading" @click="save">
          <v-icon>mdi-content-save</v-icon>
          <span class="mx-2"></span>
          <span>{{ $t("pages.create_group.form.save") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import responseCodes from "../../api/responseCodes";
import { mainEventBus } from "../../main";
import api from "../../api";
import SelectPackageGroups from "../../components/packages/SelectPackageGroups.vue";
export default {
  components: { SelectPackageGroups },
  data() {
    return {
      name: "",
      nameErrors: [],
      duration: "",
      durationErrors: [],
      durationUnit: "",
      durationUnitErrors: "",
      price: "",
      priceErrors: [],
      capacity: "",
      capacityErrors: [],
      dialog: true,
      validDurations: [],
      loading: false,
      groups: [],
      showEmptyGroupsError: false,
    };
  },
  created() {
    this.validDurations = [
      {
        code: "DAYS",
        text: this.$t("models.packages.duration_units.DAYS"),
      },
      {
        code: "MONTHS",
        text: this.$t("models.packages.duration_units.MONTHS"),
      },
    ];
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async save() {
      if (this.loading) return;
      this.nameErrors = [];
      this.capacityErrors = [];
      this.durationErrors = [];
      this.durationUnitErrors = [];
      this.priceErrors = [];

      this.showEmptyGroupsError = false;

      if (this.groups.length < 1) {
        this.showEmptyGroupsError = true;
        return;
      }

      this.loading = true;
      try {
        const data = {
          name: this.name,
          duration: this.duration,
          duration_unit: this.durationUnit,
          price: this.price,
          capacity: this.capacity,
        };
        const response = await api.post(`/packages`, data);
        const smsPackage = response.data.data;
        await api.post(`/packages/${smsPackage.id}/groups`, {groups: this.groups});
        mainEventBus.$emit("updatePackages", response.data.data);
        this.goBack();
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.name)
            this.nameErrors = error.response.data.errors.name;
          if (error.response.data.errors.capacity)
            this.capacityErrors = error.response.data.errors.capacity;
          if (error.response.data.errors.duration)
            this.durationErrors = error.response.data.errors.duration;
          if (error.response.data.errors.duration_unit)
            this.durationUnitErrors = error.response.data.errors.duration_unit;
          if (error.response.data.errors.price)
            this.priceErrors = error.response.data.errors.price;
        } else alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
