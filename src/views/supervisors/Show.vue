<template>
  <v-dialog
    :value="true"
    persistent
    scrollable
    max-width="750px"
    transition="dialog-transition"
  >
    <confirm-delete
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="remove"
    />
    <v-card :loading="loading" :disabled="loading" height="500">
      <v-card-title class="pa-0">
        <v-btn icon class="mx-2" large @click="goBack">
          <v-icon
            v-html="
              $t('direction').toLowerCase() == 'rtl'
                ? 'mdi-arrow-right '
                : 'mdi-arrow-left'
            "
          ></v-icon>
        </v-btn>
        <div class="d-inline-block">
          <v-tabs center-active v-model="openedTab">
            <v-tab href="#basic">{{
              $t("pages.show_supervisor.tabs.basic")
            }}</v-tab>
            <v-tab href="#roles">{{
              $t("pages.show_supervisor.tabs.roles")
            }}</v-tab>
            <v-tab href="#operations">{{
              $t("pages.show_supervisor.tabs.operations")
            }}</v-tab>
          </v-tabs>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon class="mx-2" color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class=""></v-divider>
      <v-card-text class="pa-4">
        <v-tabs-items v-model="openedTab">
          <v-tab-item value="basic">
            <v-row>
              <v-col>
                <v-card outlined class="ma-2">
                  <v-card-text>
                    <span class="font-weight-black"
                      >{{ $t("pages.create_supervisor.form.name.label") }} :
                    </span>
                    <editable
                      :field="{ name: 'name', value: supervisor.name }"
                      :apiEndPoint="updateSupervisorEndPoint"
                      type="string"
                      @updated="updateSupervisorName"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card outlined class="ma-2">
                  <v-card-text>
                    <span class="font-weight-black"
                      >{{ $t("pages.create_supervisor.form.user_name.label") }}
                      :
                    </span>

                    <editable
                      :field="{
                        name: 'user_name',
                        value: supervisor.user_name,
                      }"
                      :apiEndPoint="updateSupervisorEndPoint"
                      type="string"
                      @updated="updateSupervisorUserName"
                    >
                      @{{ supervisor.user_name }}
                    </editable>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row
              v-if="
                supervisor.id == $store.getters['Seller/seller'].id
              "
            >
              <v-col>
                <v-card outlined class="ma-2">
                  <v-card-text>
                    <span class="font-weight-black"
                      >{{ $t("pages.show_supervisor.password") }}
                      :
                    </span>
                    <editable
                      :field="{
                        name: 'password',
                        value: '',
                        confirmation: {
                          name: 'password_confirmation',
                          label: $t('misc.confirm_password'),
                          value: '',
                        }
                      }"
                      :apiEndPoint="updateSupervisorEndPoint"
                      type="password"
                    >
                      <v-icon size="14" color="error" v-for="index in 8" :key="index">mdi-lock</v-icon>
                    </editable>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card outlined class="ma-2">
                  <v-card-text>
                    <p class="font-weight-black">
                      {{ $t("pages.create_supervisor.form.notes.label") }}
                    </p>
                    <editable
                      :field="{ name: 'notes', value: supervisor.notes }"
                      :apiEndPoint="updateSupervisorEndPoint"
                      type="text"
                      @updated="updateSupervisorNotes"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row> </v-row>
          </v-tab-item>
          <v-tab-item value="roles">
            <supervisor-roles-tab :supervisor-id="supervisor.id" />
          </v-tab-item>
          <v-tab-item value="operations">
            <supervisor-operations-tab
              :status="supervisor.status"
              :generatedPassword="generatedPassword"
              @remove="showConfirmDelete = true"
              @suspend="suspend"
              @activate="activate"
              @resetPassword="resetPassword"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-actions class="pa-4">
        <supervisor-status :status="supervisor.status" />
        <v-spacer></v-spacer>

        <!-- <v-btn text large color="error" @click="goBack">
          <v-icon>mdi-close</v-icon>
          <span class="mx-1"></span>
          <span>{{ $t("misc.close") }}</span>
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  activateSupervisor,
  getSupervisor,
  removeSupervisor,
  resetSupervisorPassword,
  supervisorUrl,
  suspendSupervisor,
} from "../../api/supervisors";
import ConfirmDelete from "../../components/confirmDelete.vue";
import Editable from "../../components/Editable.vue";
import SupervisorOperationsTab from "../../components/supervisors/supervisorOperationsTab.vue";
import SupervisorRolesTab from "../../components/supervisors/supervisorRolesTab.vue";
import SupervisorStatus from "../../components/supervisors/SupervisorStatus.vue";
import { mainEventBus } from "../../main";
export default {
  components: {
    Editable,
    SupervisorRolesTab,
    SupervisorStatus,
    SupervisorOperationsTab,
    ConfirmDelete,
  },
  async created() {
    this.$permissions().authorize(["supervisors::retrieve"]);
    await this.loadSupervisor();
  },
  data() {
    return {
      showConfirmDelete: false,
      openedTab: "basic",
      loading: false,
      supervisor: {},
      generatedPassword: "",
    };
  },
  computed: {
    updateSupervisorEndPoint() {
      return supervisorUrl(this.supervisor.id);
    },
  },
  methods: {
    updateSupervisorName(newName) {
      this.supervisor.name = newName;
      mainEventBus.$emit("updateSupervisors", "name updated");
    },
    updateSupervisorUserName(newUserName) {
      this.supervisor.user_name = newUserName;
      mainEventBus.$emit("updateSupervisors", "user name updated");
    },
    updateSupervisorNotes(newNotes) {
      this.supervisor.notes = newNotes;
      mainEventBus.$emit("updateSupervisors", "notes updated");
    },
    goBack() {
      window.history.back();
    },
    async loadSupervisor() {
      const userName = this.$route.params.user_name;
      this.loading = true;
      const withRoles = this.$permissions().has(["supervisors::view_role"]);
      try {
        const response = await getSupervisor(userName, withRoles);
        this.supervisor = response.data.data;
      } catch (error) {
        console.log(error);
        alert(error);
      }
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      this.showConfirmDelete = false;
      try {
        await removeSupervisor(this.supervisor.id);
        mainEventBus.$emit("updateSupervisors", "API EVENT");
        window.history.back();
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async suspend() {
      this.loading = true;
      try {
        await suspendSupervisor(this.supervisor.id);
        this.supervisor.status = "SUSPENDED";
        mainEventBus.$emit("updateSupervisors", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async activate() {
      this.loading = true;
      try {
        await activateSupervisor(this.supervisor.id);
        this.supervisor.status = "ACTIVE";
        mainEventBus.$emit("updateSupervisors", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    async resetPassword() {
      this.loading = true;
      try {
        const response = await resetSupervisorPassword(this.supervisor.id);
        this.generatedPassword = response.data.data;
        mainEventBus.$emit("updateSupervisors", "API EVENT");
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
