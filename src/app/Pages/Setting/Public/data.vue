<template>
	<div class="ukao-padder ukao-pt-lg">
		<div class="module-public-sidebar b-r">
			<ul class="nav">
				<li :class="{'is-active': item.active}" @click="handleClick(item)" v-for="item in navList">{{item.text}}</li>
			</ul>
		</div>
		<div class="module-public-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				navList: [
					{ text: '经营项目', index: 'project', key : '/setting/public/data', active: true },
					{ text: '产品类别', index: 'category', key : '/setting/public/data', active: false },
					{ text: '颜色', index: 'color', key : '/setting/public/data', active: false },
					{ text: '瑕疵', index: 'flaw', key : '/setting/public/data', active: false },
					{ text: '预计效果', index: 'effect', key : '/setting/public/data', active: false },
					{ text: '服务项', index: 'service', key : '/setting/public/data', active: false },
					{ text: '品牌', index: 'brand', key : '/setting/public/data', active: false },
					{ text: '衣物附件', index: 'attachment', key : '/setting/public/data', active: false },
					{ text: '附加服务', index: 'additional_service', key : '/setting/public/data', active: false }
				]
			}
		},
		methods: {
			handleClick: function(i) {
				this.$router.push(i.index);
				console.log("handleClick:  " +i.index);
				this.navList.forEach( function(item) {
					item.active = false;
					if (item.index == i.index) {
						item.active = true;
					}
				});
			},
			update: function(route) {
				var _this = this;
				const path = route ? route.path : this.$route.path;
				var routePath =  path.split('/')[4];
				this.navList.forEach(function(item) {
					if (item.index === routePath) {
						item.active = true;
					} else {
						item.active = false;
					}
				})
			}
		},
		created: function() {
			this.update();
		},
		watch: {
			'$route' (to, from) {
				this.update()
      }
    }
	}
</script>

<style scoped>
	.module-public-sidebar {
		position: fixed;
		top: 133px;
		left: 0;
		bottom: 0;
		width: 200px;
	}
	.module-public-content {
		margin-left: 200px;
	}
	.nav {
		margin-top: 50px;
	}
	.nav li {
		padding: 10px 40px;
		border: 1px solid transparent;
	}
	.nav li.is-active {
		border-top-color: #b6dbf9;
		border-bottom-color: #b6dbf9;
		border-right-color: #e6f5ff;
		background: #e6f5ff;
		color: #20a0ff;
		margin-right: -1px;
	}

</style>