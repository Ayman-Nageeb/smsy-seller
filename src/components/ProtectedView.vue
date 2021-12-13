<template>
  <span v-if="allowed" >
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
		has: {
      type: Array,
      default: () => null,
    },
		hasOneOf: {
      type: Array,
      default: () => null,
    },
  },
	computed: {
		allowed(){
      if(!this.has && !this.hasOneOf) return false;

      let has = true;
      let hasOneOf = true;

      if(this.has && this.has.length > 0) {
        has = this.$store.getters['Seller/permissions'].has(this.has);
      }

      if(this.hasOneOf && this.hasOneOf.length > 0) {
        hasOneOf = this.$store.getters['Seller/permissions'].hasOneOf(this.hasOneOf);
      }


      const allowed = has && hasOneOf;
			return allowed;
		}
	}
};
</script>

<style></style>
