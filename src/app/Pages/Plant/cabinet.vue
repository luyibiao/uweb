<template>
	<div>
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="/merchant/list"><i class="el-icon-arrow-left icon-smaller"></i>商家管理</el-breadcrumb-item>
			  <el-breadcrumb-item>智柜列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="m-t text-right">
			<el-input class="ukao-el-input m-r" placeholder="请输入内容"  v-model="input">
		    <el-button slot="append" icon="el-icon-search"></el-button>
		  </el-input>
		  <router-link to="/merchant/newCabinet"><el-button type="primary">新增智柜</el-button></router-link>
		</div>
		<div>
			<el-table class="ukao-el-table m-t ukao-v-loading" v-loading="loading"
		    :data="tableData"
		    style="width: 100%">
		    <el-table-column
		      label="智柜名称/编号">
		      <template scope="scope">
		      	<div>{{ scope.row.sc.name }}</div>
		        <div class="text-primary"><router-link to="">{{ scope.row.sc.id }}</router-link></div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="所属商家">
		      <template scope="scope">
		      	<div>{{ scope.row.owner }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="运行状态">
		      <template scope="scope">
		      	<div v-if="scope.row.state==='1'" class="text-success">运行中</div>
		      	<div v-if="scope.row.state==='2'" class="text-danger">未知</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="分归数">
		      <template scope="scope">
		      	<div>{{ scope.row.cabinetNum }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="箱格数">
		      <template scope="scope">
		      	<div>{{ scope.row.boxNum }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="型号">
		      <template scope="scope">
		      	<div>{{ scope.row.model }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="软件版本">
		      <template scope="scope">
		      	<div>{{ scope.row.version.num }}</div>
		      	<div>{{ scope.row.version.time }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="通信状态">
		      <template scope="scope">
		      	<div v-if="scope.row.status==='1'" class="text-success">正常</div>
		      	<div v-if="scope.row.status==='2'" class="text-danger">异常</div>
		      </template>
		    </el-table-column>
		  </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
	  	<el-pagination
	      :page-size="100"
	      layout="total, prev, pager, next"
	      :total="1000">
	    </el-pagination>
	  </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				input: '',
				loading: false,
				tableData: [
					{ sc: { name: '湘腾商业广场自助柜', id: '256232'}, owner: '友靠生活', state: '1', cabinetNum: '4', boxNum: '20/12', model: 'UKAO-S1', version: { num:'2.0.8', time: '2017-03-18 14:12:10' }, status: '1' },
					{ sc: { name: '湘腾商业广场自助柜', id: '256232'}, owner: '友靠生活', state: '2', cabinetNum: '4', boxNum: '20/12', model: 'UKAO-S1', version: { num:'2.0.8', time: '2017-03-18 14:12:10' }, status: '2' }
				]
			}
		}
	}
</script>