<template>
  <div>
    {{ $store.getters['Seller/permissions'].all }}
    <v-btn color="red">click me</v-btn>
    <h1 v-if="$store.getters['Seller/permissions'].has(['roles::add'])">Role::add</h1>

    <protected-view :hasOneOf="['roles::add', 'notallowed']" :has="['roles::add', 'roles::add']">
      <h1> this route is protected </h1>
    </protected-view>
  </div>
</template>

<script>
export default {};
</script>

ProtectedRout