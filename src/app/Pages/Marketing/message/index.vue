<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'" v-bind:title="'消息推送'" v-bind:totext="'营销中心'"></v-back-to>
      </div>
      <div class="b-b">
				<v-subnav class="second-subnav" v-bind:subNavList="navList"></v-subnav>
			</div>
    </div>
    <div class="ukao-pt-md ukao-padder m-t-xl">
      <transition name="move" mode="out-in">
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
  data() {
    return {
      navList: [
        {
          requestUrl: "/marketing/message/push",
          permission: "marketing.message.push",
          name: "消息推送"
        },
        {
          requestUrl: "/marketing/message/statistics",
          permission: "marketing.message.statistics",
          name: "短信推送统计"
        },
        {
          requestUrl: "/marketing/message/weixin",
          permission: "marketing.message.weixin",
          name: "微信推送统计"
        },
        {
          requestUrl: "/marketing/message/work",
          permission: "marketing.message.work",
          name: "员工推送统计"
        }
        // {
        //   requestUrl: "/marketing/message/recharge",
        //   permission: "marketing.message.recharge",
        //   name: "短信充值"
        // },
        // {
        //   requestUrl: "/marketing/message/content",
        //   permission: "marketing.message.content",
        //   name: "短信内容"
        // }
      ]
    };
  }
};
</script>
