// 微信首页 智柜

<template>
  <div class="clearfix">
    <div class="cabinet">
      <div class="cabinet-r">
        <div class="title">微信预约智能柜</div>

        <div class="time clearfix">
          <div class="time-text time-num pull-left">24</div>
          <div>
            <p class="time-text pull-left">HOURS</p>
            <p>自助存洗</p>
          </div>
        </div>
        <div class="text-center">
          <span class="reserve-btn">立即预约</span>
        </div>
      </div>
      <div class="cabinet-logo"
           :style="{
                 'background-image':`url(${bgPath})`
                }">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 背景图
    bgPath: {
      default: "",
      type: String
    }
  }
};
</script>
<style lang="less" scoped>
// 智柜
.cabinet {
  background-color: #fff;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    right: 129px;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: #efeff4;
  }
}
// 智柜图片
.cabinet-logo {
  height: 130px;
  margin-right: 132px;
  overflow: hidden;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.cabinet-logo {
  vertical-align: middle;
}
// 智柜文字
.cabinet-r {
  float: right;
  padding: 12px 10px;
  color: #4a4a4a;

  .title {
    font-size: 16px;
  }
  .time {
    margin: 6px 0;
  }
  .time-text {
    color: #000;
    font-weight: 900;
  }
  .time-num {
    line-height: 1;
    text-align: right;
    font-size: 36px;
  }
  .reserve-btn {
    cursor: pointer;
    color: #00c800;
    border: 1px solid #00c800;
    line-height: 30px;
    border-radius: 17px;
    padding: 0 20px;
    display: inline-block;
  }
}
</style>

