<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'"
                   v-bind:title="'取送服务商'"
                   v-bind:totext="'营销中心'"></v-back-to>
      </div>
      <div class="b-b">
        <v-subnav class="second-subnav"
                  v-bind:subNavList="navList"></v-subnav>
      </div>
    </div>
    <div class="ukao-pt-md ukao-padder m-t-xl">
      <transition name="move"
                  mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import vBackTo from "../../Common/backto.vue";
import vSubnav from "../../Common/subnav.vue";
export default {
  components: {
    vBackTo,
    vSubnav
  },
  data: function() {
    return {
      navList: [
        {
          requestUrl: "/marketing/serviceShop/service_shop",
          permission: "marketing.serviceShop.service_shop",
          name: "取送服务商"
        },
        {
          requestUrl: "/marketing/serviceShop/trade_find",
          permission: "marketing.serviceShop.trade_find",
          name: "交易查询"
        },
         {
          requestUrl: "/marketing/serviceShop/single",
          permission: "marketing.serviceShop.single",
          name: "对账单"
        }
      ]
    };
  }
};
</script>