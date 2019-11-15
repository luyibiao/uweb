<template>
	<div>
		<el-row :gutter="20">
		  <el-col :span="6">
		  	<div>可选取件时间段</div>
		  </el-col>
		  <el-col :span="15">
		  	<div>开启的时间段将在客户下单界面被选择</div>
		  	<ul class="time-list clearfix">
		  		<li v-for="item in timeList">
		  			<div class="time-item" :class="{ 'is-active': item.state }">8:00-10:00</div>
		  		</li>
		  	</ul>
		  </el-col>
		  <el-col :span="3">
		  	<div class="text-right"><router-link to="get"><el-button>修改</el-button></router-link></div>
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
		  		<li v-for="item in timeList">
		  			<div class="time-item" :class="{ 'is-active': item.state }">8:00-10:00</div>
		  		</li>
		  	</ul>
		  </el-col>
		  <el-col :span="3">
		  	<div class="text-right"><router-link to="send"><el-button>修改</el-button></router-link></div>
		  </el-col>
		</el-row>
		<div class="m-t-lg b-b m-b-lg"></div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				timeList: [
					{ time: '8:00-10:00', state: true },
					{ time: '8:00-10:00', state: false },
					{ time: '8:00-10:00', state: true },
					{ time: '8:00-10:00', state: true },
					{ time: '8:00-10:00', state: true },
					{ time: '8:00-10:00', state: true },
					{ time: '8:00-10:00', state: false },
					{ time: '8:00-10:00', state: true }
				]
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

