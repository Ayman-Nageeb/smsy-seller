<template>
  <div>
    {{ $store.getters['Supervisors/permissions'].all }}
    <v-btn color="red">click me</v-btn>
    <h1 v-if="$store.getters['Supervisors/permissions'].has(['roles::add'])">Role::add</h1>
  </div>
</template>

<script>
export default {
  
};
</script>
