<template>
  <div>
    <v-row>
      <v-col>
        <p class="headline">
          {{ $t("pages.show_client.tabs.sender_ids.title") }}
          <span class="mx-2">
            <v-progress-circular
              color="primary"
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </span>
          <v-btn
            large
            color="primary"
            v-if="!loading && !editMode"
            @click="editMode = true"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>mdi-pencil</v-icon>
            <span class="mx-1"></span>

            {{ $t("misc.edit") }}
          </v-btn>
        </p>
        <div v-if="!editMode">
          <v-chip
            color="info"
            class="ma-2"
            outlined
            v-for="(senderId, index) of sellerSenderIds"
            :key="index"
            large
            label
            :input-value="
              senderId.status.toUpperCase() ==
                $t('models.sender_ids.status.ACTIVE').toUpperCase()
            "
            filter
          >
            {{ senderId.name }}
            <span class="mx-2"></span>
            <sender-id-status-view :status="senderId.status" />
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="editMode">
      <v-col>
        <set-seller-sender-ids
          :autoSelected="sellerSenderIdsIds"
          @input="selectedIDs = $event"
        />
        <v-btn
          large
          color="error"
          @click="editMode = false"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>

          {{ $t("misc.cancel") }}
        </v-btn>

        <span class="mx-2"></span>
        <v-btn
          large
          color="primary"
          @click="setSenderIds"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon>mdi-content-save</v-icon>
          <span class="mx-1"></span>

          {{ $t("misc.save") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import api from "../../api";
import SenderIdStatusView from "./SenderIdStatusView.vue";
import SetSellerSenderIds from "./SetClientSenderIds.vue";
export default {
  components: {
    SenderIdStatusView,
    SetSellerSenderIds,
  },
  props: ["user-name"],
  data() {
    return {
      loading: false,
      senderIds: [],
      sellerSenderIds: [],
      selectedIDs: [],
      editMode: false,
    };
  },
  created() {
    this.loadSellerSenderIds();
  },
  computed: {
    sellerSenderIdsIds() {
      const list = [];
      for (let field of this.sellerSenderIds) {
        list.push(field.id);
      }
      return list;
    },
  },
  methods: {
    async loadSellerSenderIds() {
      this.loading = true;
      try {
        const response = await api.get(`/current-seller/clients/${this.userName}/sender-ids`);
        this.sellerSenderIds = response.data.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async setSenderIds() {
      this.loading = true;
      try {
        const data = {
          sender_ids: this.selectedIDs,
        };

        await api.post(`/current-seller/clients/${this.userName}/sender-ids`, data);
        this.editMode = false;
        this.loadSellerSenderIds();
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
