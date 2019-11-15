<template>
	<div>
		<div class="second-nav-list b-b">
			<subnav-cascade></subnav-cascade>
		</div>
		<div class="ukao-padder ukao-pt-md">
			<transition name="move" mode="out-in">
				<router-view></router-view>
			</transition>
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
