<template>
  <div class="">
    <protected-view :has="['sellers::update']">
      <div class="my-6"></div>
      <v-row v-if="generatedPassword.trim() != ''">
        <v-col>
          <v-snackbar
            :timeout="3000"
            v-model="showPasswordCopiedSnakbar"
            color="success"
          >
            <template v-slot:action="{ attrs }">
              _COPIED SUCCESS
              <v-btn
                color="error"
                icon
                v-bind="attrs"
                @click="showPasswordCopiedSnakbar = false"
              >
                <v-icon color="error">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
          <v-alert
            type="success"
            border="bottom"
            outlined
            prominent
            dense
            icon="mdi-lock"
            dismissible
          >
            <p>
              _COPY Gen
            </p>
            <v-text-field
              outlined
              class="d-inline-block mx-2"
              :readonly="true"
              v-model="generatedPassword"
              color="success"
              dense
              append-icon="mdi-content-copy"
              @click:append="copyGeneratedPassword"
              ref="generatedPasswordTextField"
            ></v-text-field>
          </v-alert>
        </v-col>
      </v-row>
      <locked-view>
        <v-btn color="error" large @click="$emit('resetPassword', 'UI EVENT')">
          <v-icon>mdi-key-variant</v-icon>
          <span class="mx-1"></span>
          <span>RESET</span>
        </v-btn>
      </locked-view>
    </protected-view>
    <protected-view
      :has="['sellers::update']"
      v-if="status.toUpperCase() == 'ACTIVE'"
    >
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="error" large @click="$emit('suspend', 'UI EVENT')">
          <v-icon>mdi-cancel</v-icon>
          <span class="mx-1"></span>
          <span>SUSPEND</span>
        </v-btn>
      </locked-view>
    </protected-view>
    <protected-view
      :has="['sellers::update']"
      v-if="status.toUpperCase() == 'SUSPENDED'"
    >
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="success" large @click="$emit('activate', 'UI EVENT')">
          <v-icon>mdi-account-check</v-icon>
          <span class="mx-1"></span>
          <span>Activate</span>
        </v-btn>
      </locked-view>
    </protected-view>
    <protected-view :has="['sellers::remove']" class="">
      <div class="my-6"></div>
      <locked-view>
        <v-btn color="error" large @click="$emit('remove', 'UI EVENT')">
          <v-icon>mdi-delete</v-icon>
          <span class="mx-1"></span>
          <span>REMOVE</span>
        </v-btn>
      </locked-view>
    </protected-view>
  </div>
</template>

<script>
import LockedView from "../LockedView.vue";
import ProtectedView from "../ProtectedView.vue";
export default {
  components: { LockedView, ProtectedView },
  props: {
    status: {
      type: String,
      required: true,
    },
    generatedPassword: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showPasswordCopiedSnakbar: false,
    };
  },
  methods: {
    copyGeneratedPassword() {
      let textToCopy = this.$refs.generatedPasswordTextField.$el.querySelector(
        "input"
      );
      textToCopy.select();
      window.document.execCommand("copy");
      this.showPasswordCopiedSnakbar = true;
    },
  },
};
</script>

<style></style>
