<template>
	<div>
		<div class="second-nav-list">
			<div class="back-to-nav bg-subnav text-center">
				<v-back-to v-bind:linkto="'/marketing'" v-bind:title="'扫码收款'" v-bind:totext="'营销中心'"></v-back-to>
			</div>
			<div class="b-b">
				<v-subnav class="second-subnav" v-bind:subNavList="wCityDetails"></v-subnav>
			</div>
		</div>
		<router-view class="ukao-pt-lg ukao-padder"></router-view>
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
      wCityDetails: [
        {
          requestUrl: "/marketing/code/list",
          permission: "marketing.code.list",
          name: "收款码"
        },
        {
          requestUrl: "/marketing/code/record",
          permission: "marketing.code.record",
          name: "收款记录"
        },
        {
          requestUrl: "/marketing/code/preferential",
          permission: "marketing.code.preferential",
          name: "收款码优惠"
        },
        {
          requestUrl: "/marketing/code/label",
          permission: "marketing.code.label",
          name: "标签管理"
        },
        {
          requestUrl: "/marketing/code/statistics",
          permission: "marketing.code.statistics",
          name: "收款统计"
        },
      ]
    };
  }
};
</script>