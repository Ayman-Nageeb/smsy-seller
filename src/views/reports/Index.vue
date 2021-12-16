<template>
  <div>
    <p class="headline">
      {{ $t("pages.reports.title") }}
    </p>
    <p>{{ $t("pages.reports.subtitle") }}</p>
    <div class="my-6">
      <v-row>
        <v-col cols="4">
          <v-datetime-picker
            v-model="start_date"
            :text-field-props="{
              appendIcon: 'mdi-calendar',
              outlined: true,
              errorMessages: startDateErrors,
              label: $t('pages.reports.form.start_date.label'),
            }"
            :time-picker-props="{ ampmInTitle: true }"
            time-format="HH:mm:ss"
            :label="$t('pages.reports.form.start_date.label')"
          >
            <template slot="dateIcon">
              <v-icon>mdi-calendar-outline</v-icon>
            </template>
            <template slot="timeIcon">
              <v-icon>mdi-clock-time-eight-outline</v-icon>
            </template>
          </v-datetime-picker>
        </v-col>
        <v-col cols="4">
          <v-datetime-picker
            v-model="end_date"
            :text-field-props="{
              appendIcon: 'mdi-calendar',
              outlined: true,
              errorMessages: endDateErrors,
              label: $t('pages.reports.form.end_date.label'),
            }"
            :time-picker-props="{ ampmInTitle: true }"
            time-format="HH:mm:ss"
            :label="$t('pages.reports.form.end_date.label')"
          >
            <template slot="dateIcon">
              <v-icon>mdi-calendar-outline</v-icon>
            </template>
            <template slot="timeIcon">
              <v-icon>mdi-clock-time-eight-outline</v-icon>
            </template>
          </v-datetime-picker>
        </v-col>
        <v-col>
          <v-btn x-large color="primary" @click="loadReport">
            <v-icon>mdi-clipboard-text-search-outline</v-icon>
            <span class="mx-1"></span>
            <span>{{ $t("pages.reports.form.calculate") }}</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="">
          <div class="d-flex justify-space-between align-center pa-2">
            <p>
              <span class="font-weight-bold">Total sellers :</span>
              {{ sellers.length }}
            </p>
            <p>
              <span class="font-weight-bold">Total subscriptions :</span>
              {{ totalCount }}
            </p>
          </div>
          <div class="d-flex justify-space-between align-center pa-2">
            <p>
              <span class="font-weight-bold">Total capacity :</span>
              {{ totalCapacity }}
            </p>
            <p>
              <span class="font-weight-bold">Total used :</span>
              {{ totalUsed }}
            </p>
            <p>
              <span class="font-weight-bold">Total remaining :</span>
              {{ totalCapacity - totalUsed }}
            </p>
          </div>
          <div class="d-flex justify-space-between align-center pa-2">
            <p>
              <span class="font-weight-bold">Total price :</span>
              {{ totalPrice }}
            </p>
            <p>
              <span class="font-weight-bold">Total payed :</span>
              {{ totalPayed }}
            </p>
            <p>
              <span class="font-weight-bold">Total remaining :</span>
              {{ totalPrice - totalPayed }}
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" large @click="print" :disabled="sellers.length == 0">
            <v-icon>mdi-printer</v-icon>
            <span class="mx-1"></span>
            <span>Print</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="sellers"
            item-key="id"
            :loading="loading"
            :search="search"
          >
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <div v-show="false" ref="printArea">
      <h3>Sellers Subscriptions Report at {{ nowDate() }}</h3>
      <table cellpadding="10" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total sellers :</span>
            {{ sellers.length }}
          </td>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total subscriptions :</span>
            {{ totalCount }}
          </td>
          <td></td>
        </tr>

        <tr>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total capacity :</span>
            {{ totalCapacity }}
          </td>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total used :</span>
            {{ totalUsed }}
          </td>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total remaining :</span>
            {{ totalCapacity - totalUsed }}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total price :</span>
            {{ totalPrice }}
          </td>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total payed :</span>
            {{ totalPayed }}
          </td>
          <td style="padding: 10px">
            <span class="font-weight-bold">Total remaining :</span>
            {{ totalPrice - totalPayed }}
          </td>
        </tr>
      </table>

      <br /><br />
      <table border="1" cellpadding="10" cellspacing="0" width="100%">
        <thead>
          <th>name</th>
          <th>user name</th>
          <th>status</th>
          <th>count</th>
          <th>capacity</th>
          <th>used</th>
          <th>remaining</th>
          <th>price</th>
          <th>payed</th>
          <th>debt</th>
        </thead>
        <tbody>
          <tr v-for="(seller, index) of sellers" :key="index">
            <td style="padding: 10px">{{ seller.name }}</td>
            <td style="padding: 10px">{{ seller.user_name }}</td>
            <td style="padding: 10px">{{ seller.status }}</td>
            <td style="padding: 10px">{{ seller.subscriptions.count }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.capacity) }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.used) }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.remaining) }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.price) }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.used) }}</td>
            <td style="padding: 10px">{{ Number(seller.subscriptions.debt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import responseCodes from "../../api/responseCodes";
export default {
  created() {
   
  },
  data() {
    return {
      start_date: null,
      end_date: null,
      loading: false,
      search: "",
      sellers: [],
      startDateErrors: [],
      endDateErrors: [],
    };
  },
  computed: {
    headers() {
      return [
        { text: "name", value: "name" },
        { text: "user_name", value: "user_name" },
        { text: "status", value: "status" },
        { text: "count", value: "subscriptions.count" },
        { text: "capacity", value: "subscriptions.capacity" },
        { text: "used", value: "subscriptions.used" },
        { text: "remaining", value: "subscriptions.remaining" },
        { text: "price", value: "subscriptions.price" },
        { text: "payed", value: "subscriptions.payed" },
        { text: "debt", value: "subscriptions.debt" },
      ];
    },
    totalCount() {
      let sum = 0;
      for (let seller of this.sellers) {
        sum += Number(seller.subscriptions.count);
      }
      return sum;
    },
    totalCapacity() {
      let sum = 0;
      for (let seller of this.sellers) {
        sum += Number(seller.subscriptions.capacity);
      }
      return sum;
    },
    totalUsed() {
      let sum = 0;
      for (let seller of this.sellers) {
        sum += Number(seller.subscriptions.used);
      }
      return sum;
    },
    totalPrice() {
      let sum = 0;
      for (let seller of this.sellers) {
        sum += Number(seller.subscriptions.price);
      }
      return sum;
    },
    totalPayed() {
      let sum = 0;
      for (let seller of this.sellers) {
        sum += Number(seller.subscriptions.payed);
      }
      return sum;
    },
  },
  methods: {
    nowDate() {
      return new Date().toLocaleString();
    },
    async loadReport() {
      this.startDateErrors = [];
      this.endDateErrors = [];
      this.loading = true;
      try {
        const response = await api.get("/current-seller/reports/clients/subscriptions", {
          start_date: this.start_date,
          end_date: this.end_date,
        });
        this.sellers = response.data.data;
      } catch (error) {
        if (
          error.response &&
          error.response.status == responseCodes.HTTP_UNPROCESSABLE_ENTITY
        ) {
          if (error.response.data.errors.start_date)
            this.startDateErrors = error.response.data.errors.start_date;
          if (error.response.data.errors.end_date)
            this.endDateErrors = error.response.data.errors.end_date;
          else alert(error);
        } else alert(error);
      }
      this.loading = false;
    },
    print() {
      const prtHtml = this.$refs.printArea.innerHTML;
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`
        <!DOCTYPE html>
        <html>
          <head>    
          </head>
          <body>
            ${prtHtml}
          </body>
        </html>`
      );

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
  },
};
</script>

<style></style>
