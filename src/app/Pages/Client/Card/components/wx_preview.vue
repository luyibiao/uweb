<template>
  <div class="wx-view">
    <div class="wx-content">
      <div class="wrapper-md b-b bg-white">
        <div class="card"
             :style="cardBg">
          <div class="clearfix">
            <img class="img-circle thumb pull-left"
                 :src="mercLogo">
            <div class="card-info">
              <p>{{mercName}}</p>
              <p>{{cardName}}</p>
            </div>
            <div class="card-number">000 000 000</div>
          </div>
        </div>
        <el-row class="m-t">
          <el-col :span="8">
            <div class="text-center b-r">
              <p>等级</p>
              <p class="text-success text-md m-t-xs">会员等级</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="text-center b-r">
              <p>余额</p>
              <p class="text-success text-lg m-t-xs">0.00</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="text-center">
              <p>积分</p>
              <p class="text-success text-lg m-t-xs">0</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="tips m-t"
           v-show="discountRs || couponRs || pointRs">
        <div class="tips-item">会员权益</div>
        <div class="tips-item">
          <ul class="rights-list clearfix">
            <li class="rights"
                v-if="discountRs">
              <div class="rights-logo">
                <img src="/static/img/card/discount.png">
              </div>
              <p class="text-center m-t-xs">{{discount}}</p>
            </li>
            <li class="rights"
                v-if="couponRs">
              <div class="rights-logo">
                <img src="/static/img/card/coupon.png">
              </div>
              <p class="text-center m-t-xs">送券</p>
            </li>
            <li class="rights"
                v-if="pointRs">
              <div class="rights-logo">
                <img src="/static/img/card/integral.png">
              </div>
              <p class="text-center m-t-xs">送积分</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="tips m-t">
        <div class="tips-item">
          使用须知
        </div>
        <div class="tips-item">
          出示会员凭证
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 商户名
    mercName: "",
    // 商户头像
    mercLogo: "",
    // 卡名
    cardName: "",
    // 会员卡背景类型   1背景色  2 背景图
    bgType: {
      default: 1,
      type: [String, Number]
    },
    // 背景色
    bgColor: "",
    // 背景图
    bgPath: "",
    // 折扣
    discount: 0,
    // 折扣权限
    discountRs: true,
    // 送券权限
    couponRs: true,
    // 积分权限
    pointRs: true
  },
  computed: {
    // 会员卡背景
    cardBg() {
      if (this.bgType == 1 && this.bgColor) {
        return { backgroundColor: this.bgColor };
      }
      if (this.bgType == 2 && this.bgPath) {
        return {
          backgroundImage: `url(${this.bgPath}`,
          backgroundColor: "transparent"
        };
      }
      return "";
    },
    carddiscount() {}
  }
};
</script>
<style lang="less" scoped>
.wx-view {
  position: relative;
  width: 350px;
  height: 625px;
  background: url(/static/img/bg_card.png) no-repeat;
  background-size: 350px 625px;
}
.wx-content {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.card {
  padding: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #60be4e;
  background-size: cover;
  background-position: center;
  color: #fff;
  &-info {
    margin: 0 70px;
    height: 50px;
    line-height: 25px;
  }
  &-number {
    margin-top: 70px;
  }
}
.tips {
  padding: 0 15px;
  background-color: #fff;
  border-top: 1px solid #dee5e7;
  border-bottom: 1px solid #dee5e7;
  &-item {
    padding: 10px 0;
    line-height: 20px;
    & + & {
      border-top: 1px solid #dee5e7;
    }
  }
}
.rights {
  float: left;
  & + & {
    margin-left: 22px;
  }
  &-logo {
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    background-color: #efeff4;
    line-height: 60px;
    width: 60px;
    img {
      width: 32px;
      vertical-align: middle;
    }
  }
}
</style>
会员卡微信预览