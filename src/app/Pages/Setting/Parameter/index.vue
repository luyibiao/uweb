<template>
  <div class="ukao-padder ukao-pt-md">
    <div class="module-public-sidebar b-r">
      <ul class="nav">
        <router-link :to="item.url"
                     tag="li"
                     :class="{'is-active': nav == item.url}"
                     :key="index"
                     v-for="(item,index) in navList">
          <img :src="item.icon"
               style="width: 20px;height: 20px;vertical-align: middle;"
               v-if="item.icon" /> {{item.text}}
        </router-link>
      </ul>
    </div>
    <div class="module-public-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: "",
      navList: [
        { text: "订单金额修改设置", url: "/setting/parameter/amount" },
        { text: "会员卡设置", url: "/setting/parameter/add_card_user" },
        { text: "查看衣物照片设置", url: "/setting/parameter/clothing_photo" },
        { text: "查看衣物价格设置", url: "/setting/parameter/clothing_price" },
        { text: "退款设置", url: "/setting/parameter/refund" },
        { text: "通洗管家", url: "/setting/parameter/aide" },
        { text: "商城", url: "/setting/parameter/shops" },
        { text: "优付卡", url: "/setting/parameter/ucard" },
        { text: "流程设置", url: "/setting/parameter/process" },
        { text: "微信店铺", url: "/setting/parameter/wxshop" },
        { text: "提现设置", url: "/setting/parameter/other" },
        { text: "打印设置", url: "/setting/parameter/print" },
        { text: "服务协议设置", url: "/setting/parameter/protocol" },
        { text: "零散充值设置", url: "/setting/parameter/recharge_setting" },
        { text: "店员查看客户权限", url: "/setting/parameter/show_all_user" },
        { text: "通洗智店功能控制", url:"/setting/parameter/cash_control"},
        { text: "会员价设置", url:"/setting/parameter/vip_price"},
        { text: "员工提成设置", url:"/setting/parameter/profits"},
        { text: "订单指派设置", url:"/setting/parameter/order_assign"},
      ]
    };
  },
  created: function() {
    this.nav = this.$route.path;
  },
  watch: {
    $route(to, from) {
      this.nav = to.path;
    }
  }
};
</script>

<style scoped>
.module-public-sidebar {
  position: absolute;
  top: 90px;
  left: 0;
  /* bottom: 0; */
  width: 200px;
  min-height: 100%;
}
.module-public-content {
  margin-left: 200px;
}
.nav {
  margin-top: 40px;
}
.nav li {
  cursor: pointer;
  padding: 10px 40px;
  border: 1px solid transparent;
  border-bottom: 1px solid #dee5e7;
}
.nav li.is-active {
  /*border-top-color: #b6dbf9;*/
  /*border-bottom-color: #b6dbf9;*/
  /*border-right-color: #e6f5ff;*/
  background: #e6f5ff;
  color: #20a0ff;
  margin-right: -1px;
}
.nav li:last-child{
   margin-bottom: 60px;
}
</style>