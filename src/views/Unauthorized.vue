<template>
  <div>
    <v-card class="ma-6 pa-6 mx-auto" elevation="" flat>
      <v-card-text>
        <div class="text-center">
          <span class="display-4 font-weight-black">403</span>
          <br />
          <span class="headline">{{ $t("pages.unauthorized.title") }}</span>
          <div class="text-h2 my-4">{{ $t("pages.unauthorized.message") }}</div>
          <v-btn x-large elevation="" color="primary" route :to="{name: 'Home'}">
            <span>{{ $t("pages.unauthorized.go_to_home") }}</span>
            <span class="mx-1"></span>
            <v-icon v-if="$t('direction').toLowerCase() == 'rtl'"
              >mdi-arrow-left</v-icon
            >
            <v-icon v-else>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
