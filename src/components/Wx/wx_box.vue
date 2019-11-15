微信预览骨架

<style lang="less" scoped>
.wx-bg {
  width: 350px;
  height: 625px;
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 350px 625px;
  padding: 58px 0 46px;
  box-sizing: border-box;
}
.wx-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>

<template>
  <div class="wx-bg b-a"
       :style="{
                'background-image':`url(${bgPath})`
      }">
    <div class="wx-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 背景图
    bgPath: {
      default: "/static/img/weixin/wap_bg.png",
      type: String
    }
  }
};
</script>
