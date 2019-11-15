<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'" v-bind:title="'优惠券礼包'" v-bind:totext="'营销中心'"></v-back-to>
      </div>
      <div class="b-b">
        <v-subnav class="second-subnav" v-bind:subNavList="wCityDetails"></v-subnav>
      </div>
    </div>
    <div class="ukao-pt-lg ukao-padder">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import vBackTo from '../../Common/backto.vue';
import vSubnav from '../../Common/subnav.vue';
//import auth from '@/utils/auth';
export default {
  components: {
    vBackTo,vSubnav
  },
  data: function() {
    return {
      wCityDetails: [
        {requestUrl: "/marketing/couponGift/new", permission: "marketing.couponGift.new", name: "制作优惠券礼包"},
        {requestUrl: "/marketing/couponGift/list", permission: "marketing.couponGift.list", name: "礼包列表"},
      ]
    }
  },
  mounted() {
//    let permList = auth.getPermList();
//    let hasNewUrl = false;
//    for (let i = 0; i < permList.length; i ++) {
//      if (permList[i] === 'marketing.couponGift.update1') {
//        hasNewUrl = true;
//        break;
//      }
//    }
//    if (hasNewUrl) {
//      this.wCityDetails = [
//        {requestUrl: "/marketing/couponGift/new", permission: "marketing.couponGift.new", name: "制作优惠券礼包"},
//        {requestUrl: "/marketing/couponGift/list", permission: "marketing.couponGift.list", name: "礼包列表"}
//      ];
//    } else {
//      this.wCityDetails = [
//        {requestUrl: "/marketing/couponGift/list", permission: "marketing.couponGift.list", name: "礼包列表"}
//      ];
//    }
  }
}
</script>