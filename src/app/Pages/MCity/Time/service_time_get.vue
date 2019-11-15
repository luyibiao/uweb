<template>
	<div v-loading="loading">
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item :to="'/mcity/time/'+cityInfo.id+'/period'"><i class="el-icon-arrow-left icon-smaller"></i>服务时间段</el-breadcrumb-item>
		  <el-breadcrumb-item>取件时间</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="m-t-lg text-muted">开启的时间段将在客户下单界面被选择</div>
		<p class="p-l18 m-t-lg">时间段</p>
		<div class="ukao-tb-default m-t">
			<el-row v-for="item in timeList" class="b-b" :key="item.id">
			  <el-col :span="16">
				  <div>
						{{item.timeStart}} - {{item.timeEnd}}
					</div>
			  </el-col>
			  <el-col :span="8">
				  <div>
				  	<el-switch
						  v-model="item.statusVal"
						  active-color="#13ce66"
						  inactive-color="#dcdcdc"
						  on-text="已启用"
						  off-text="未启用"
						  :width="74" @change="updateStatus(item)">
						</el-switch>
				  </div>
			  </el-col>
			</el-row>
		</div>
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
		  this.loading = true
			this.$store.dispatch('post', {
				uri : 'serviceTime/list',
				data: {
					cityId: this.cityInfo.id,
					type: 1
				}
			}).then((res) =>{
				let list = res.data.data.list || []
				list.forEach(function (item) {
					item.statusVal = item.status ? true : false
        })
				this.timeList = list
				this.loading = false
			})
		},
		updateStatus (item){
			this.$store.dispatch('post', {
				uri : item.statusVal ? 'serviceTime/enable' : 'serviceTime/disable',
				data: {
					id: item.id
				}
			}).then((res) =>{
				msg.success()
				this.list()
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
	.p-l18 {
		padding-left: 18px;
	}
</style>
