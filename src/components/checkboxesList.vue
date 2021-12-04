<template>
  <v-card flat permanent min-width="700">
    <v-card-text>
      <!-- <search-field v-model="search" />
      {{ selected }} -->
      <v-row>
        <v-col cols="6">
          <v-checkbox
            v-model="selected"
            v-for="(field, index) in filteredFields"
            :key="index"
            v-show="index % 2 == 0"
            :label="field.label"
            :value="field.value"
            class=""
            color="success"
            :readonly="readonly"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="selected"
            v-for="(field, index) in filteredFields"
            :key="index"
            v-show="index % 2 == 1"
            :label="field.label"
            :value="field.value"
            color="success"
            :readonly="readonly"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  components: {},
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    autoSelected: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: [],
      search: "",
    };
  },
  created() {
    for (let field of this.autoSelected) {
      this.selected.push(field);
    }
  },
  computed: {
    filteredFields() {
      let fields = [];

      let isLabelMatched = false;
      let isValueMatched = false;
      for (let field of this.fields) {
        isLabelMatched =
          field.label.toLowerCase().search(this.search.trim().toLowerCase()) >
          -1;
        isValueMatched =
          field.value.toString().toLowerCase().search(this.search.trim().toLowerCase()) >
          -1;

        if (isLabelMatched || isValueMatched) {
          fields.push(field);
        }
      }
      return fields;
    },
  },
  watch: {
    selected(value) {
      this.$emit("input", value);
    },
    readonly(value) {
      if (value == true) {
        this.selected = [];
        for (let field of this.autoSelected) {
          this.selected.push(field);
        }
      }
    },
  },
};
</script>

<style></style>
