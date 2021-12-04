<template>
  <div>
    <v-alert type="error" :border="`bottom`" v-if="errorMsg">
      <p class="headline">
        {{ errorMsg }}
      </p>
      <v-divider class=""></v-divider>
      <div class="my-2 font-wieght-black">
        {{ errorResponse.message }}
      </div>
      <details>
        <summary>{{ $t("errors.details.title") }}</summary>
        <ul>
          <li v-for="(messages, key) in errorResponse.errors" :key="key">
            <details>
              <summary>{{ key }}</summary>
              <ul>
                <li v-for="(message, index) in messages" :key="index">
                  {{ message }}
                </li>
              </ul>
            </details>
          </li>
        </ul>
        <ul>
          <li v-for="(message, index) in errorResponse.messages" :key="index">
            {{ message }}
          </li>
        </ul>
      </details>
    </v-alert>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :search="search"
    >
    </v-data-table>
  </div>
</template>

<script>
import api from "../api";
export default {
  props: {
    htmlContents: {},
    url: {
      type: String,
      required: true,
    },
    urlParams: {
      type: Object,
      default: () => {},
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      search: "",
      items: [],
      errorMsg: null,
      errorResponse: {},
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.errorMsg = null;
      this.errorResponse = {};
      this.loading = true;

      try {
        const response = await api.get(this.url, this.urlParams);
        this.items = response.data.data;
      } catch (error) {
        this.errorMsg = error;
        if (error.response.data) {
          console.error(error.response.data);
          this.errorResponse = error.response.data;
        }
      }

      this.loading = false;
    },
  },
};

export const datatableColumn = function(
  text,
  value,
  isViewable = () => true,
  options = {}
) {
  const datatable = {};
  if (isViewable && isViewable()) {
    datatable.text = text;
    datatable.value = value;
    return Object.assign(datatable, options);
  }
};
</script>

<style></style>
