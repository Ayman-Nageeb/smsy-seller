<template>
  <div>
    <v-row>
      <v-col>
        <p class="headline">
          {{ $t("pages.show_package.title") }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.name.label") }} :</span
            >
            <editable
              :field="{ name: 'name', value: smsPackage.name }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.name = $event;
                $emit('update');
              "
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.capacity.label") }} :</span
            >
            <editable
              :field="{ name: 'capacity', value: smsPackage.capacity }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.capacity = $event;
                $emit('update');
              "
              type="numeric"
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.price.label") }} :</span
            >
            <editable
              :field="{
                name: 'price',
                value: smsPackage.price,
                min: 0,
                step: 0.01,
              }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.price = $event;
                $emit('update');
              "
              type="numeric"
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.duration.label") }} :</span
            >
            <editable
              :field="{
                name: 'duration',
                value: smsPackage.duration,
                min: 0,
                step: 1,
              }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.duration = $event;
                $emit('update');
              "
              type="numeric"
            >
              {{ smsPackage.duration }}
              {{
                $t(`models.packages.duration_units.${smsPackage.duration_unit}`)
              }}
            </editable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.duration_unit.label") }} :</span
            >
            <editable
              :field="{
                name: 'duration_unit',
                value: smsPackage.duration_unit,
                items: validDurations,
                itemText: 'text',
                itemValue: 'code'
              }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.duration_unit = $event;
                $emit('update');
              "
              type="menu"
            >
              {{
                $t(`models.packages.duration_units.${smsPackage.duration_unit}`)
              }}
            </editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold"
              >{{ $t("pages.create_package.form.notes.label") }} :</span
            >
            <editable
              :field="{ name: 'notes', value: smsPackage.notes }"
              :apiEndPoint="updatePackageEndPoint"
              @updated="
                smsPackage.notes = $event;
                $emit('update');
              "
              type="text"
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Editable from "../Editable.vue";
export default {
  components: { Editable },
  props: ["sms-package"],
  computed: {
    updatePackageEndPoint() {
      return `packages/${this.smsPackage.id}`;
    },
    validDurations() {
      return [
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
  },
};
</script>

<style></style>
