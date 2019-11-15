<template>
	<ul class="wx-project-lists clearfix">
		<li class="item" v-for="item in projectContent">
			<div class="product text-center">
				<img class="img" v-bind:src="item.imgPath" alt="">
				<div class="text">
					<p class="item-name" v-text="item.name" v-show="item.showName"></p>
					<p class="text-muted"><span v-show="item.showSubtitle" v-text="item.subtitle"></span></p>
				</div>
			</div>
			<div class="info text-center">
				<p class="state" v-bind:class="{'text-success': item.status}" v-text="item.status == 1 ? '已启用':'已停用' "></p>
				<p class="num">序号：<span v-text="item.sortNo"></span></p>
				<router-link class="more text-primary" :to="'/mcity/project/detail/' + item.cityId +'/'+item.id">查看 &gt;</router-link>
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		props: ['projectContent']
	}
</script>

<style lang="scss" scoped src="./theme/styles/project_content.scss">
</style>