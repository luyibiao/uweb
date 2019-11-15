<template>
	<div>
		<div class="second-nav-list">
			<div class="back-to-nav bg-subnav text-center">
				<v-back-to v-bind:linkto="'/marketing'" v-bind:title="'优惠券'" v-bind:totext="'营销中心'"></v-back-to>
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
					{ requestUrl: "/marketing/coupon/get", permission: "marketing.coupon.get", name: "优惠券列表" },
					{ requestUrl: "/marketing/coupon/send", permission: "marketing.coupon.send", name: "主动派发" },
					{ requestUrl: "/marketing/coupon/nc_rules", permission: "marketing.coupon.nc_rules", name: "新客户赠券规则" },
					{ requestUrl: "/marketing/coupon/nc_record", permission: "marketing.coupon.nc_record", name: "新客户赠券记录" },
					{ requestUrl: "/marketing/coupon/share_rule", permission: "marketing.coupon.share_rule", name: "分享赠券规则" },
					{ requestUrl: "/marketing/coupon/share_record", permission: "marketing.coupon.share_record", name: "分享赠券记录" }
				]
			}
		}
	}
</script>