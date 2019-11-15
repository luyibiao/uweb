<template>
	<ul class="clearfix">
		<li class="ukao-tabs-item" v-for="item in tabNavList" v-bind:class="{ 'is-active': item.key === akey }" v-on:click="toggle(item)" v-text="item.text"></li>
	</ul>
</template>

<script>
	export default {
		props: ['tabNavList', 'akey'],
		methods: {
			toggle: function(item) {
				this.$router.push(item.index);
			}
		}
	}
</script>

<style scoped>
	.ukao-tabs-item:first-child {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	.ukao-tabs-item:last-child {
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.ukao-tabs-item {
		float: left;
		padding: 5px 10px;
		border: 1px solid #dcdcdc;
		margin-right: -1px;
		-webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
	}
	.ukao-tabs-item:hover {
		color: #20a0ff;
		cursor: pointer;
	}
	.ukao-tabs-item.is-active {
		border-color: #20a0ff;
		color: #20a0ff;
	}
	.ukao-tabs-item.is-active + .ukao-tabs-item {
		border-left-color: #20a0ff;
	}
</style>