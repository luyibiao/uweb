<template>
	<div v-loading="loading">
		<el-row :gutter="20">
		  <el-col :span="6">
		  	<div>可选取件时间段</div>
		  </el-col>
		  <el-col :span="15">
		  	<div>开启的时间段将在客户下单界面被选择</div>
		  	<ul class="time-list clearfix">
		  		<li v-for="item in timeList" v-if="item.type == 1" v-bind:key="item.index">
		  			<div class="time-item" :class="{ 'is-active': item.status == 1 }">
							{{item.timeStart}} - {{item.timeEnd}}
						</div>
		  		</li>
		  	</ul>
		  </el-col>
		  <el-col :span="3">
		  	<div class="text-right">
					<router-link :to="'/mcity/time/'+cityInfo.id+'/get'">
						<el-button>修改</el-button>
					</router-link>
				</div>
		  </el-col>
		</el-row>
		<div class="m-t-lg b-b m-b-lg"></div>
		<el-row :gutter="20" class="m-b">
		  <el-col :span="6">
		  	<div>可选送件时间段</div>
		  </el-col>
		  <el-col :span="15">
		  	<div>开启的时间段将在客户下单界面被选择</div>
		  	<ul class="time-list clearfix">
		  		<li v-for="item in timeList" v-if="item.type == 2" v-bind:key="item.index">
		  			<div class="time-item" :class="{ 'is-active': item.status == 1 }">
							{{item.timeStart}} - {{item.timeEnd}}
						</div>
		  		</li>
		  	</ul>
		  </el-col>
		  <el-col :span="3">
		  	<div class="text-right"><router-link :to="'/mcity/time/'+cityInfo.id+'/send'"><el-button>修改</el-button></router-link></div>
		  </el-col>
		</el-row>
		<div class="m-t-lg b-b m-b-lg"></div>
	</div>
</template>

<script>
	import msg from '@/utils/msg'

export default {
	data: function() {
		return {
			loading: true,
			cityInfo: {
				id: this.$route.params.cityId
			},
			timeList: []
		}
	},
	created () {
	  this.list()
  },
	methods: {
		list (){
			this.$store.dispatch('post', {
				uri : 'serviceTime/list',
				data: {
					cityId: this.cityInfo.id
				}
			}).then((res) =>{
				let list = res.data.data.list || []
				this.timeList = list
				this.loading = false
			})
		}
	}
}
</script>

<style scoped>
	.time-list li {
		float: left;
		margin-top: 10px;
		margin-right: 15px;
	}
	.time-list .time-item {
		background: #dcdcdc;
		padding: 10px 15px;
		color: #fff;
		border-radius: 4px;
	}
	.time-list .time-item.is-active {
		background-color: #36c924;
	}
</style>

