<template>
	<div>
		<div class="second-nav-list">
			<div class="back-to-nav bg-subnav">
				<v-back-to :linkto="'/cabinet/list'"  :totext="'智柜列表'"></v-back-to>
			</div>
			<div class="b-b">
				<v-subnav class="second-subnav" :queryKey="id" :subNavList="navList"></v-subnav>
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
  import auth from '@/utils/auth'
	import vBackTo from '../../Common/backto.vue'
	import vSubnav from '../../Common/subnav.vue'
	export default {
		components: {
			vBackTo,vSubnav
		},
		data: function() {
			return {
				id: this.$route.params.id,
        navList: [
					{ permission: "cabinet.overall", requestUrl:"/cabinet/overall", name: "智柜概况" },
					{ permission: "cabinet.detail", requestUrl:"/cabinet/detail", name: "智柜详情" },
//					{ permission: "cabinet.ads", requestUrl:"/cabinet/ads", name: "广告显示" },
//					{ permission: "cabinet.surface", requestUrl:"/cabinet/surface", name: "智柜界面" },
//					{ permission: "cabinet.function", requestUrl:"/cabinet/function", name: "功能模块" },
				]
			}
		}
	}
</script>

<style scoped>
	.back-to-nav {
		text-align: center;
		background-color: #f8f8f8;
	}
</style>