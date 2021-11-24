<template>
  <div class="text-center">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" rounded text>
          <v-icon>mdi-translate</v-icon>
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </template>

      <v-list rounded dense class="pa-2">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="changeLocale(item.code)"
          dense
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {mainEventBus} from '../../main';
export default {
  data: () => ({
    items: [
      { title: "العربية", code: "ar" },
      { title: "ُEnglish", code: "en" },
    ],
  }),
  methods: {
    
		changeLocale(locale) {
      mainEventBus.$emit("changeLocale", locale);
    },
  },
};
</script>
