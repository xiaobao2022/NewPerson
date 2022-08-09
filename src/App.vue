<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
  // mounted() {
  //   this.$store.dispatch('user/getUserInfo') // dispatch是用来触发异步请求的
  // }
}
</script>
