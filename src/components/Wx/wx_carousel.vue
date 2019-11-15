微信轮播图

<template>
  <el-carousel trigger="click"
               height="142px">
    <el-carousel-item v-for="item in list"
                      :key="item.id">
      <img class="w-full"
           :src="item.imgPath">
    </el-carousel-item>
  </el-carousel>
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
