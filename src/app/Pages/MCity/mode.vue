<template>
	<div class="text-center m-t-xxl">
		<ul class="ukao-item-lists clearfix dis-inline">
			<li class="item b-a" v-for="item in list" v-bind:class="{active: item.active}"  v-on:click="handle(item)" :key="item.index">
				<div class="mode">
			  	<h3 class="title" v-text="item.title"></h3>
			    <P class="text" v-text="item.text"></P>
			  </div>
			</li>
		</ul>
	</div>
</template>

<script>
	import msg from '@/utils/msg'

	export default {
		data: function() {
			return {
				cityInfo : {
					id: this.$route.params.cityId,
				},
				list: [
					{ title:"预约模式", text: "客户预约下单，由取件员上门收件", active: true, mode: 1 },
					{ title:"下单支付模式", text: "客户提前支付", active: false, mode: 2 }
				]
			}
		},
		created () {
		  this.init()
	  },
		methods: {
		  init (){
				this.$store.dispatch('post', {
					uri : 'mercCity/detail',
					data: {
						id: this.cityInfo.id,
					}
				}).then((res) =>{
				  var _this = this
				  this.cityInfo = res.data.data
					this.$emit("backToTitle", this.cityInfo.name || '')
					this.list.forEach(function (item) {
						item.active = item.mode == _this.cityInfo.createMode
          })
				})
			},
			handle: function(selectedItem) {
				this.$store.dispatch('post', {
					uri : 'mercCity/updateMode',
					data: {
						id: this.cityInfo.id,
						mode: selectedItem.mode
					}
				}).then((res) =>{
					this.list.forEach(function(item, index) {
						item.active = false;
					});
					selectedItem.active = true
					msg.success()
				})
			}
		}
	}
</script>

<style scoped>
	.ukao-item-lists .item {
		float: left;
		width: 300px;
		height: 200px;
		margin: 20px 50px;
		padding: 20px;
		border-radius: 10px;
		background-color: #f4f5f9;
		overflow: hidden;
	}
	.ukao-item-lists .item.active {
		position: relative;
		background-color: #f6fdf5;
		border-color: #36c924;
	}
	.ukao-item-lists .item.active:before {
		content: "";
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 9;
		border-top: 15px solid transparent;
		border-left: 15px solid transparent;
		border-bottom: 15px solid #36c924;
		border-right: 15px solid #36c924;
	}
	.ukao-item-lists .item.active:after {
		content: "";
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 10;
		width: 11px;
		height: 5px;
		border-left: 2px solid #fff;
		border-bottom: 2px solid #fff;
		transform: rotate(-45deg) translate(3px, -7px);
	}
	
	.mode .title {
		text-align: center;
		margin: 30px auto 40px;
	}
</style>