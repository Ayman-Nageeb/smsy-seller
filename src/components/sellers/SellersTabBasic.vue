<template>
  <div>
    <v-row>
      <v-col>
        <p class="headline">
          {{ $t("pages.show_seller.title") }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">Name :</span>
            <editable
              :field="{ name: 'name', value: seller.name }"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.name = $event;
                $emit('update');
              "
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">User Name </span>
            <editable
              :field="{ name: 'user_name', value: seller.user_name }"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.user_name = $event;
                $emit('update');
              "
              >@{{ seller.user_name }}</editable
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">Email</span>
            <editable
              :field="{ name: 'email', value: seller.email }"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.email = $event;
                $emit('update');
              "
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">Company Name :</span>
            <editable
              :field="{ name: 'company', value: seller.company }"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.company = $event;
                $emit('update');
              "
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">Phones' Numbers :</span>
            <editable
              type="combobox"
              :field="{ name: 'phones', value: seller.phones, multiple: true }"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.phones = $event;
                $emit('update');
              "
            >
              <v-chip
                v-for="(phone, index) of seller.phones"
                :key="index"
                class="mx-1"
              >
                {{ phone }}
              </v-chip>
            </editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <p class="font-weight-bold">Notes</p>
            <editable
              :field="{ name: 'notes', value: seller.notes }"
              type="text"
              :apiEndPoint="updateSellerEndPoint"
              @updated="
                seller.notes = $event;
                $emit('update');
              "
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
  props: ["seller"],
  computed: {
    updateSellerEndPoint() {
      return `sellers/${this.seller.user_name}`;
    },
  },
};
</script>

<style></style>
