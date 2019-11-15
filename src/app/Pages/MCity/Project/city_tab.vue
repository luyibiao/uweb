<template>
	<div>
		<div class="second-nav-list">
			<div class="back-to-nav bg-subnav">
				<v-back-to v-bind:linkto="'/mcity/list'" :title="title" v-bind:totext="'微信城市'"></v-back-to>
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
				id: this.$route.params.cityId,
				title: '',
        navList: []
			}
		},
    methods: {
      initMenu: function () {
        const path = this.$route.path;
        const permission = path.split('/')[1];
        this.navList = auth.getChildMenu(permission);
      }
    },
		created() {
      this.initMenu();
			let _this = this;
			this.$on('backToTitle', function(val) {
				_this.title = val
			})
		}
	}
</script>

<style scoped>
	.back-to-nav {
		text-align: center;
		background-color: #f8f8f8;
	}
	.content {
		padding-top: 150px;
	}
</style>