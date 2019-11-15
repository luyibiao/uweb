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
  import auth from '@/utils/auth'
  import subnavCascade from '../Common/subnav_cascade.vue'
  export default {
    components: {
      subnavCascade
    }
  }
</script>

