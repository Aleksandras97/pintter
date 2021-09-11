<template>
  <router-view />
</template>
<script>

export default {
  created() {
    this.$store.dispatch('tryLogin');
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout
    }
  },
  watch: {
    didAutoLogout(curVal, oldVal) {
      if (curVal && oldVal !== oldVal) {
        this.$router.replace('/pints')
      }
    }
  }
}
</script>
