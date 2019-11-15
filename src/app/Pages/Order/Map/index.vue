<template>
  <div class="ukao-pt-lg">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'map'
  }
</script>

<style lang="less" scoped>
  .ukao-pt-lg {
    padding-top: 100px;
  }

  .ukao-padder {
    padding-left: 0px;
    padding-right: 0px;
  }
</style>