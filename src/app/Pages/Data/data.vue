<template>
	<div class="ukao-padder ukao-pt-md">
		<div class="second-nav-list b-b">
			<subnav-cascade></subnav-cascade>
		</div>
		<div>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import subnavCascade from '../Common/subnav_cascade.vue'
	export default {
		components: {
      subnavCascade
		}
	}
</script>