<template>
<div class="ukao-padder ukao-pt-md">
  	<div class="second-nav-list">
			<p class="text-center bg-subnav b-b b-t wrapper-sm">中转站列表</p>
		</div>
  <router-view></router-view>
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