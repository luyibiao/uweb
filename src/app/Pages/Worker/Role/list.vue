<template>
	<div v-loading="loading">
		<div class="text-right">
			<div class="w dis-inline m-l m-r-lg">
				<el-input placeholder="请输入内容" v-model="tableData.keywords" @keyup.enter.native="search">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
		  </div>
			<!--<span class="m-r"><el-button>重置角色</el-button></span>-->
		  <auth perm="worker.role.read"><router-link to="/worker/role/edit"><el-button type="primary"><i class="el-icon-plus m-r-xs"></i>新建角色</el-button></router-link></auth>
		</div>

		<div class="m-t-lg">
			<el-table class="ukao-el-table"
		    ref="multipleTable"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="角色名称">
		      <template slot-scope="scope">{{ scope.row.name }}</template>
		    </el-table-column>
				<el-table-column
					label="角色类型">
					<template slot-scope="scope">{{ scope.row.type | getValText('WK_ROLE_TYPE') }}</template>
				</el-table-column>
		    <el-table-column
		      label="序号">
		      <template slot-scope="scope">{{ scope.row.sortNo }}</template>
		    </el-table-column>
		    <el-table-column
		      label="默认角色">
		      <template slot-scope="scope">
		      	<div v-if="scope.row.mercId === -1">是</div>
		      	<div v-else>否</div>
		      </template>
		    </el-table-column>
				<el-table-column label="备注">
					<template slot-scope="scope">{{ scope.row.remark }}</template>
				</el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.enable == 1" effect="dark" content="已启用" placement="right">
							<i class="t-state t-state-success"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.enable == 0" effect="dark" content="未启用" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.enable == -1" effect="dark" content="已删除" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					label="操作">
					<template slot-scope="scope">
						<router-link :to="'/worker/role/edit?id='+scope.row.id" class="text-primary">查看</router-link>
					</template>
				</el-table-column>
		  </el-table>

			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
					@current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'

	export default {
		data() {
			return {
				loading: true,
				tableData: {
					keywords : '',
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
			}
		},
		created () {
			this.list(0)
    },
		methods: {
			list (start){
				var _this = this;
				this.$store.dispatch('get', {
					uri : 'wkRole/list',
					params: {
						startRow: start || 0,
						pageSize: _this.tableData.pagination.size,
						keywords: _this.tableData.keywords || ''
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					this.tableData.list = list || []
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			search (){
				this.list(0)
			},
			handleCurrentChange (val){
			  this.tableData.pageStart = (val-1) * this.tableData.pagination.size;
				this.list(this.tableData.pageStart)
			}
    }
	}
</script>