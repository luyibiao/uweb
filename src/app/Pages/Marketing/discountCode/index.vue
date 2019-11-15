<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'" v-bind:title="'优惠码'" v-bind:totext="'营销中心'"></v-back-to>
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
export default {
  components: {
    vBackTo,vSubnav
  },
   data: function() {
    return {
      wCityDetails: [
        {requestUrl: "/marketing/discountCode/list", permission: "marketing.discountCode.list", name: "优惠码列表"},
        {requestUrl: "/marketing/discountCode/imdata", permission: "marketing.discountCode.imdata", name: "优惠码导入列表"},
      ]
    }
  }
}
</script>