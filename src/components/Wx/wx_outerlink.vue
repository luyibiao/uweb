微信首页外链

<style lang="less" scoped>
// 外链
.outer-link {
  background: #fff;
  padding: 16px 5px 12px;
  font-size: 0;
  text-align: center;
}
.outer-item {
  width: 25%;
  font-size: 14px;
  display: inline-block;
}
.outer-logo {
  width: 44px;
  height: 44px;
}
.outer-name {
  line-height: 20px;
  height: 20px;
  overflow: hidden;
  margin-top: 4px;
  color: #7f7f7f;
}
</style>

<template>
  <div class="outer-link">
    <div v-for="item in list"
         class="outer-item">
      <img class="outer-logo"
           :src="item.imgPath">
      <p class="outer-name">{{item.name}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 数据列表
    list: {
      default: _ => [],
      type: Array
    }
  }
};
</script>
