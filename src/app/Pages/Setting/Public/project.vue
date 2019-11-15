<template>
	<div>
		<p class="text-md">经营项目</p>
		<div class="m-t-lg">
			<el-table
				class="ukao-el-table"
				v-loading="dataTable.loading"
		    :data="dataTable.list"
		    style="width: 100%">
		    <el-table-column
		      label="图片">
		      <template slot-scope="scope">
		        <img class="thumb-md b-a" :src="scope.row.imgPath || ''" v-if="scope.row.imgPath" alt="">
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="名称">
		      <template slot-scope="scope">
		        <div>{{ scope.row.name }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="首字母">
		      <template slot-scope="scope">
		        <div>{{ scope.row.firstWord }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="排序">
		      <template slot-scope="scope">
		        <div>{{ scope.row.sortNo }}</div>
		      </template>
		    </el-table-column>
		    <!--<el-table-column-->
		      <!--label="产品数量">-->
		      <!--<template slot-scope="scope">-->
		        <!--<div>{{ scope.row.productCnt }}</div>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
		    <!--<el-table-column-->
		      <!--label="类别数量">-->
		      <!--<template slot-scope="scope">-->
		        <!--<div>{{ scope.row.proTypeCnt }}</div>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
				<el-table-column
					label="状态">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.status == 1" effect="dark" content="已启用" placement="right">
							<i class="t-state t-state-success"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 0" effect="dark" content="未启用" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == -1" effect="dark" content="已删除" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
					</template>
				</el-table-column>

		  </el-table>
			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="dataTable.pagination.size"
		      layout="total, prev, pager, next"
		      :total="dataTable.pagination.total"
					@current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>


<script>
 	import consts from '@/utils/consts'

	export default {
		data: function() {
			return {
				dataTable: {
					loading: true,
				  list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				}
			}
		},
		created () {
			this.list()
		},
		methods : {
		  list (start) {
				let _this = this
				this.$store.dispatch('getList', {
					uri : 'mercBusiness/list',
					params: {
						startRow: start || 0,
						pageSize: _this.dataTable.pagination.size
					}
				}).then((res) =>{
						this.dataTable.list = res.data.data.list || []
						this.dataTable.pagination.total = res.data.data.total || 0
						this.dataTable.loading = false
				})
      },
			handleCurrentChange (val){
				this.list((val -1) * this.dataTable.pagination.size)
			}
		}
	}
</script>