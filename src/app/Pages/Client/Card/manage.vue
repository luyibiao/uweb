<template>
  <div>
    <div class="b-b top">
      <p>会员卡类型</p>
      <p class="text-muted text-xs m-t-xs">基于用户的消费行为，系统根据设定的发卡规则自动给用户发卡，不同卡对应不同等级，符合规则则可自动升级，适用于帮助会员成长，刺激会员消费。</p>
    </div>
    <div class="wrapper m-t">
      <ul class="clearfix">
        <li class="card-item"
            v-for="item in list"
            :style="item.info.background">
          <div class="card-name  text-white">{{item.info.name}} </div>
          <div class="card-discount text-white">
            <span class="pull-right text-lg"
                  v-if="item.info.discountType == 2">多折扣</span>
            <span v-else-if="item.info.discount > 0 && item.info.discount < 100"
                  class="pull-right">
              <span class="text-vl">{{item.info.discount/10}}</span>
              折
            </span>
            <span v-else
                  class="pull-right text-lg">不打折</span>
          </div>
          <div class="card-btm">
            <el-popover placement="bottom-end"
                        width="170"
                        trigger="hover">
              <div>
                <p>会员权益</p>
                <p v-if="item.info.discountType === 2"
                   class="m-t-xs">
                  <template v-for="(disc,index) in item.info.discountDesc">
                    {{disc.bizName}}{{disc.discount | getDiscount}}{{(index+1) == item.info.discountDesc.length ? '':'，'}}
                  </template>
                </p>
                <p v-if="item.info.rights[2] == '1'"
                   class="m-t-xs">随卡赠送优惠券：</p>
                <p v-for="coupon in item.couponList">{{coupon.couponName}}（{{coupon.info.cnt}}张）</p>
                <p v-if="item.info.rights[3] == '1'"
                   class="m-t-xs">随卡赠送积分：{{item.info.giftPoint}}分</p>
                <p class="m-t-xs">积分系数：{{item.info.pointRatio}}</p>
              </div>
              <div class="rights clearfix text-white"
                   slot="reference">
                <div class="pull-left">
                  <i class="icon-coupon"
                     v-if="item.info.rights[2] == '1'"></i>
                  <i class="icon-point"
                     v-if="item.info.rights[3] == '1'"></i>
                  <i class="icon-discount"
                     v-if="item.info.rights[1] == '1'"></i>
                </div>
                <span class="pull-right">等级：{{item.info.level}}</span>
              </div>
            </el-popover>

            <div class="bg-state clearfix wrapper-sm">
              <!--<a class="text-primary">查看会员</a>-->
              <auth perm="client.card.update">
                <!-- - -->
                <router-link :to="item.info.id+'/edit'">
                  <a class="text-primary">编辑</a>
                </router-link>
              </auth>
              <span v-if="item.info.status == 1"
                    class="pull-right">使用中</span>
              <span v-if="item.info.status == 0"
                    class="pull-right text-danger">已停用</span>
              <span v-if="item.info.def == 1"
                    class="pull-right">默认卡-</span>
            </div>
          </div>

        </li>
        <auth perm="client.card.update">
          <router-link class="card-item"
                       to="new"
                       tag="li">
            <div class="new_card">
              <p class="text text-muted">新建会员卡</p>
            </div>
          </router-link>
        </auth>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$store
        .dispatch("post", {
          uri: "userCard/list"
        })
        .then(res => {
          this.list = res.data.data.list.map(item => {
            item.info.rights = item.info.rights.split("");
            item.info.discountDesc = item.info.discountDesc
              ? JSON.parse(item.info.discountDesc)
              : [];
            item.info.background =
              item.info.coverType == 1
                ? "background-color:" + item.info.imgPath
                : "background-image:url(" + item.info.imgPath + ")";
            return item;
          });
        });
    }
  },
  filters: {
    getDiscount(value) {
      if (value > 0 && value < 100) {
        return value / 10 + "折";
      }
      return "无折扣";
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  padding: 0 15px 10px 15px;
}
.card-item {
  position: relative;
  float: left;
  margin-bottom: 30px;
  margin-right: 40px;
  width: 300px;
  height: 180px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-size: cover;
  background-position: center;
}
.card-name {
  padding: 10px;
}
.card-discount {
  position: absolute;
  right: 10px;
  top: 10px;
}
.card-btm {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
}
.rights {
  padding: 0 10px;
  line-height: 32px;
  background: rgba(0, 0, 0, 0.5);
}
.bg-state {
  background: #f8f8f8;
}
.new_card {
  width: 300px;
  height: 178px;
  box-sizing: border-box;
  border: 2px dashed #cfcfcf;
  border-radius: 10px;
  position: relative;
  background: #f9fafc;
}
.new_card:hover {
  border-color: #20a0ff;
}
.new_card .text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
.new_card:before,
.new_card:after {
  content: "";
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #cfcfcf;
  border-radius: 10px;
}
.new_card:before {
  width: 60px;
  height: 5px;
}
.new_card:after {
  width: 5px;
  height: 60px;
}
.icon-discount,
.icon-coupon,
.icon-point {
  width: 18px;
  height: 16px;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}
.icon-discount {
  background-image: url("~@/assets/img/card/discount.png");
}
.icon-coupon {
  background-image: url("~@/assets/img/card/coupon.png");
}
.icon-point {
  background-image: url("~@/assets/img/card/point.png");
}
</style>
