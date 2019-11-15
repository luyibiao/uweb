<template>
	<div>
		<subnav-cascade class="second-nav-list b-b"></subnav-cascade>
		<router-view></router-view>
	</div>
</template>

<script>
  import subnavCascade from '../../Common/subnav_cascade.vue'
  export default {
    components: {
      subnavCascade
    }
  }
</script>