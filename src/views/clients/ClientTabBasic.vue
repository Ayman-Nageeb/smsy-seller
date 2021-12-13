<template>
  <div>
    <v-row>
      <v-col>
        <p class="headline">
          {{ $t("pages.show_client.title") }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <span class="font-weight-bold">Name :</span>
            <editable
              :field="{ name: 'name', value: client.name }"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                client.name = $event;
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
              :field="{ name: 'user_name', value: client.user_name }"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                client.user_name = $event;
                $emit('update');
              "
              >@{{ client.user_name }}</editable
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
              :field="{ name: 'email', value: client.email }"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                client.email = $event;
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
              :field="{ name: 'company', value: client.company }"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                client.company = $event;
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
              :field="{ name: 'phones', value: client.phones, multiple: true }"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                client.phones = $event;
                $emit('update');
              "
            >
              <v-chip
                v-for="(phone, index) of client.phones"
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
    <!-- <v-row>
      <v-col>
        <v-card outlined class="ma-2">
          <v-card-text>
            <p class="font-weight-bold">Notes</p>
            <editable
              :field="{ name: 'notes', value: seller.notes }"
              type="text"
              :apiEndPoint="updateClientEndPoint"
              @updated="
                seller.notes = $event;
                $emit('update');
              "
            ></editable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import Editable from "../../components/Editable.vue";
export default {
  components: { Editable },
  props: ["client"],
  computed: {
    updateClientEndPoint() {
      return `current-seller/clients/${this.client.user_name}`;
    },
  },
};
</script>

<style></style>
