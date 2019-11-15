<template>
	<div class="sub-nav">
		<el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal">
			<el-menu-item v-for="item in subNavList" :index="item.permission" :key="item.permission" v-text="item.name" @click="handleClick(item)">
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
	export default {
		props: ['subNavList', 'queryKey'],
		data: function() {
			return {
				defaultActive: ''
			}
		},
		watch:{
			'$route'(){
				this.update();
			},
		},
		methods: {
      handleClick (item) {
        this.$router.push((item.requestUrl == '#' ? item.children[0].requestUrl : item.requestUrl) + (this.queryKey?'/' + this.queryKey:''));
        this.$emit('changeMenu', item.children || []);
      },
			update() {
				let routePath = this.$route.path.replace(/\//g,'.').replace('.','');
				let path = '';
				this.subNavList.forEach((item)=>{
				  if (routePath === item.permission || routePath.indexOf(item.permission) >= 0) {
            path = item.permission;
            this.$emit('changeMenu', item.children || [])
						return false;
					}
				});
				this.defaultActive = path || this.defaultActive;
			}
		},
		created: function() {
			if (this.subNavList && this.subNavList[0]) {
				this.defaultActive = this.subNavList[0].permission
			}
			this.update();
		},
		
	}
</script>

<style scoped>
	.sub-nav .el-menu {
		box-sizing: border-box;
		border-top: 1px solid #e7e7e7;
		padding-left: 20px;
		background-color: #fff;
	}
	.bg-subnav.sub-nav .el-menu {
		background-color: #f8f8f8;
	}
	.bg-subnav.sub-nav .el-menu li{
		background-color: #f8f8f8 !important;
	}
	.sub-nav .el-menu--horizontal{
		border-bottom: 0px;
	}
	.sub-nav .el-menu--horizontal .el-menu-item {
		height: 40px;
		line-height: 40px;
	}
</style>