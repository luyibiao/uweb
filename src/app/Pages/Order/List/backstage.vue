<template>
	<div>
		<v-order-list originTab="4"></v-order-list>
	</div>
</template>
<!-- 门店收银机
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
