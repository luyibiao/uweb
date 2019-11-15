<template>
	<div class="clearfix">
		<div class="pull-right">
			<!--<el-button>拉黑</el-button>-->
			<!--<el-button>销户</el-button>-->
		</div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item to="/client/list/all"><i class="el-icon-arrow-left icon-smaller"></i>所有客户</el-breadcrumb-item>
		  <el-breadcrumb-item>客户详情</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script>
	export default {
		name: 'ListTop'
	}
</script>