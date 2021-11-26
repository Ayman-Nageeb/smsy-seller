<template>
  <div>
    {{ $store.getters['Supervisors/permissions'].all }}
    <v-btn color="red">click me</v-btn>
    <h1 v-if="$store.getters['Supervisors/permissions'].has(['roles::add'])">Role::add</h1>

    <protected-route :hasOneOf="['roles::add', 'notallowed']" :has="['roles::add', 'roles::add']">
      <h1> this route is protected </h1>
    </protected-route>
  </div>
</template>

<script>
import ProtectedRoute from '../components/ProtectedView.vue';
export default {
  components: { ProtectedRoute },
};
</script>

ProtectedRout