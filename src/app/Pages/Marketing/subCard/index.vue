<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'"
                   v-bind:title="'次卡'"
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
          requestUrl: "/marketing/subCard/buy_record",
          permission: "marketing.subCard.buy_record",
          name: "购买记录"
        },
        {
          requestUrl: "/marketing/subCard/list",
          permission: "marketing.subCard.list",
          name: "次卡列表"
        },
      ]
    };
  }
};
</script>