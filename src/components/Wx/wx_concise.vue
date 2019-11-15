简洁预约模块

<template>
  <div class="wash text-center"
       :style="'background-image:url(' + (bgPath || '/static/img/wx-bg.png') +')'"
       v-else>
    <div class="content">
      <div class="btn">我要洗衣</div>
      <p>
        <span class="check-box"></span>
        <span>我已阅读并同意</span>
        <span class="text-primary">《用户洗涤协议》</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    bgPath: {
      default: "",
      type: [String]
    }
  }
};
</script>
<style lang="less" scoped>
.wash {
  position: relative;
  height: 210px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.wash .content {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
}
.btn {
  width: 140px;
  background-color: #36c924;
  color: #fff;
  height: 44px;
  line-height: 44px;
  text-align: center;
  margin: 0 auto 30px;
  border-radius: 6px;
  cursor: pointer;
}
.check-box {
  display: inline-block;
  position: relative;
  border-radius: 4px;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  background-color: #36c924;
  vertical-align: middle;
}
.check-box::after {
  box-sizing: content-box;
  content: "";
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 8px;
  left: 6px;
  position: absolute;
  top: 2px;
  width: 4px;
  transform: rotate(45deg);
}
</style>
