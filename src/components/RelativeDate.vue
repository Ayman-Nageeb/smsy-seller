<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">{{ dateToView }}</span>
    </template>
    <span>{{ sugarDate }}</span>
  </v-tooltip>
</template>

<script>
import Sugar from "sugar";
export default {
  data() {
    return {
      dateToView: "",
      intervalId: 0,
      showedTimestamp: new Date().getTime(),
    };
  },

  props: { date: { required: true } },
  computed: {
    sugarDate() {
      return Sugar.Date(this.date).full();
    },
  },
  created() {
    this.intervalId = setInterval(this.getNow, 1000);
  },
  methods: {
    getNow: function() {
      if (this.intervalId) {
        if (Sugar.Date.isBefore(Sugar.Date(this.date), "before 1 minute")) {
          window.clearInterval(this.intervalId);
          this.intervalId = setInterval(this.getNow, 1000 * 60);
        }
        if (Sugar.Date.isBefore(Sugar.Date(this.date), "before 1 hour")) {
          window.clearInterval(this.intervalId);
          this.intervalId = setInterval(this.getNow, 1000 * 60 * 60);
        }
        if (Sugar.Date.isBefore(Sugar.Date(this.date), "before 24 hours")) {
          window.clearInterval(this.intervalId);
          this.intervalId = setInterval(this.getNow, 1000 * 60 * 60 * 24);
        }

        if (Sugar.Date.isBefore(Sugar.Date(this.date), "before 25 hours")) {
          window.clearInterval(this.intervalId);
        }
      }
      this.dateToView = this.relativeDate();
    },
    relativeDate() {
      return Sugar.Date(this.date).relative();
    },
  },
};
</script>

<style></style>
