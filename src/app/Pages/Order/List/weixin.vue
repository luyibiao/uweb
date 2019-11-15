<template>
	<div>
		<v-order-list originTab="1,7"></v-order-list>
	</div>
</template>
<!-- 微信
originTab:
	参考dickeyval.js:ORIGIN
-->
<script>
	import vOrderList from './list.vue'
	export default {
    components: {
			vOrderList
    }
  }
</script>
