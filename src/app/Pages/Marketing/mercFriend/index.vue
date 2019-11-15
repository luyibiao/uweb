<template>
	<div>
		<div class="second-nav-list">
			<div class="back-to-nav bg-subnav text-center">
				<v-back-to v-bind:linkto="'/marketing'" v-bind:title="'友商'" v-bind:totext="'营销中心'"></v-back-to>
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
					{ requestUrl: "/marketing/friend/list", permission: "marketing.friend.list", name: "友商列表" },
					{ requestUrl: "/marketing/friend/recruit", permission: "marketing.friend.recruit", name: "招募计划" },
					{ requestUrl: "/marketing/friend/set", permission: "marketing.friend.set", name: "设置" },
					{ requestUrl: "/marketing/friend/poster", permission: "marketing.friend.poster", name: "海报管理" }
				]
			}
		}
	}
</script>