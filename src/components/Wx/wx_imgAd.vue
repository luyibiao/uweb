微信轮播图

<template>
  <div>
    <div v-for="item in list">
      <img class="w-full" v-if="!item.fileType || item.fileType == 'image'"
           :src="item.imgPath">
      <video v-else controls="controls" :poster="item.posterPath" width="100%" :src="item.imgPath"></video>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 轮播图列表
    list: {
      default: _ => [],
      type: Array
    }
  }
};
</script>
