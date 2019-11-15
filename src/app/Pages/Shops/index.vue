<template>
	<div class="ukao-padder">
		<div class="second-nav-list b-b">
			<subnav-cascade></subnav-cascade>
		</div>
		<router-view class="ukao-pt-md"></router-view>
	</div>
</template>

<script>
import subnavCascade from "../Common/subnav_cascade.vue";
export default {
  components: {
    subnavCascade
  }
};
</script>