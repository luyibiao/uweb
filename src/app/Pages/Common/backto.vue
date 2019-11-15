<template>
	<div class="back-to">
		<span class="text-md" v-text="title"></span>
		<router-link class="back-nav text-primary" :to="linkto"><i class="el-icon-arrow-left icon-smaller"></i><span v-text="totext"></span></router-link>
	</div>
</template>

<script>
	export default {
		props: ['linkto', 'title', 'totext'],
		methods: {
			backTo: function(link) {
				this.$router.push(link);
			}
		}
	}
</script>

<style scoped>
	.back-to {
		position: relative;
		border-top: 1px solid #e7e7e7;
		box-sizing: border-box;
		height: 40px;
		line-height: 40px;
	}
	.back-nav {
		position: absolute;
		left: 40px;
		top: 0;
		height: 40px;
		line-height: 40px;
	}
</style>
