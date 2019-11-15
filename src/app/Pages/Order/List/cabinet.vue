<template>
	<div>
		<v-order-list originTab="5"></v-order-list>
	</div>
</template>
<!-- 智柜
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
