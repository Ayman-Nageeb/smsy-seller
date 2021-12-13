<template>
  <v-app>
    <app-bar v-if="showAppBar"></app-bar>
    <v-main id="main-area">
      <v-snackbar v-model="showSystemCustomAlert" color="error" top center multi-line>
        {{ alertText }}

        <template v-slot:action="{ attrs }">
          <v-btn dark icon v-bind="attrs" @click="showSystemCustomAlert = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <router-view class="pa-4" />
    </v-main>
  </v-app>
</template>

<script>
import { mainEventBus } from "./main";
import userConfig from "./config/index";
import Sugar from "sugar";

import AppBar from "./components/AppBar.vue";

export default {
  name: "App",
  components: { AppBar },
  data: () => ({
    showSystemCustomAlert: false,
    alertText: "",
  }),
  computed: {
    showAppBar() {
      return this.$store.getters["Seller/isAuthenticated"];
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.$vuetify.rtl = this.$t("direction") == "rtl";
      this.$vuetify.lang.current = locale;
      window.localStorage.setItem("locale", locale);

      Sugar.Date.setLocale(locale);
      this.$forceUpdate();
      // window.location.reload();
    },

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      window.localStorage.setItem(
        "isDarkTheme",
        Number(this.$vuetify.theme.dark)
      );
    },

    setMainEventBusListener() {
      mainEventBus.$on("toggleTheme", this.toggleTheme);
      mainEventBus.$on("changeLocale", this.changeLocale);
    },

    configCustomAlert() {
      window.alert = this.customAlert;
    },

    customAlert(message) {
      this.alertText = message;
      this.showSystemCustomAlert = true;
    },

    setArabicTranslationForSugarDates() {
      /*
       * Arabic locale definition.
       * See the readme for customization and more information.
       * To set this locale globally:
       *
       * Sugar.Date.setLocale('ar')
       *
       */
      Sugar.Date.addLocale("ar", {
        plural: true,
        units:
          "ثانية|ثواني,ثانية|ثواني,دقيقة|دقائق,ساعة|ساعات,يوم|أيام,أسبوع|أسابيع,شهر|أشهر,سنة|سنوات",
        months:
          "جانفي,فيفري,مارس,أفريل,ماي,جوان,جويلية,أوت,سبتمبر,أكتوبر,نوفمبر,ديسمبر",
        weekdays: "أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت",
        numerals: "صفر,واحد|ة,اثنان,ثلاثة,أربعة,خمسة,ستة,سبعة,ثمانية,تسعة,عشرة",
        tokens: " ",
        short: "{yyyy}/{MM}/{dd}",
        medium: "{yyyy} {month} {d}",
        long: "{yyyy} {month} {d} {time}",
        full: "{weekday} {d} {month} {yyyy} {time}",
        stamp: "{dow} {d} {mon} {yyyy} {time}",
        time: "{mm}:{H}",
        past: "{sign} {num} {unit}",
        future: "{sign} {num} {unit}",
        duration: "{num} {unit}",
        timeMarkers: " ",
        ampm: "صباحا,مساء",
        modifiers: [
          { name: "day", src: "أمس", value: -1 },
          { name: "day", src: "اليوم", value: 0 },
          { name: "day", src: "غدا", value: 1 },
          { name: "sign", src: "منذ", value: -1 },
          { name: "sign", src: "في غضون", value: 1 },
          { name: "shift", src: "الماضي|ة", value: -1 },
          { name: "shift", src: "الآتي|ة", value: 1 },
        ],
        parse: [
          "{months} {year?}",
          "{sign} {num} {unit}",
          "{0?} {unit:5-7} {shift}",
        ],
        timeParse: [
          "{day|weekday} {shift?}",
          "{weekday?},? {0?} {date}{1?} {months}\\.? {year?}",
        ],
        timeFrontParse: [
          "{0?} {weekday} {shift}",
          "{weekday?},? {0?} {date}{1?} {months}\\.? {year?}",
        ],
      });
    },
  },
  created() {
    this.setMainEventBusListener();
    userConfig.loadLocale();
    userConfig.loadTheme(this.$vuetify);

    this.configCustomAlert();

    this.setArabicTranslationForSugarDates();
  },
};
</script>
