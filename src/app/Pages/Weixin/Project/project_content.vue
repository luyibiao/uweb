<template>
	<ul class="m-r-n-md">
		<li v-for="(item,index) in projectContent"
		    class="project-item">
			<div class="project-left">
				<img class="project-logo"
				     v-bind:src="item.imgPath">
				<div class="project-text">
					<p class="project-name"
					   v-text="item.name"
					   v-show="item.showName"></p>
					<p class="project-tips text-xs text-muted">
						<span v-show="item.showSubtitle"
						      v-text="item.subtitle"></span>
					</p>
				</div>
			</div>
			<div class="project-info text-center">
				<p class="project-state"
				   v-bind:class="{'text-success': item.status}"
				   v-text="item.status == 1 ? '已启用':'已停用' "></p>
				<p class="num">序号
					<span v-text="item.sortNo"></span>
				</p>
				<auth perm="weixin.project.update">
					<router-link class="project-more text-primary"
				             :to="'/weixin/project/detail/'+item.id">查看 &gt;</router-link>
				</auth>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
  props: ["projectContent"]
};
</script>

<style lang="scss" scoped src="./theme/styles/project_content.scss">
</style>