<template>
	<div v-loading="loading" class="ukao-v-loading">
		<div class="text-right" v-show="cityMoreEnable">
			<router-link to="add"><el-button type="primary">添加城市</el-button></router-link>
		</div>
		<div class="m-t">
			<el-table class="ukao-el-table m-t"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="城市">
		      <template slot-scope="scope">
		      	<a class="text-primary" @click="onCityDetail(scope.row)">{{scope.row.name}}</a>
						<p>{{scope.row.workAccount}}</p>
		      </template>
		    </el-table-column>
				<el-table-column
					label="创建时间">
					<template slot-scope="scope">
						<div>{{scope.row.createTime | getDate}}</div>
						<div>{{scope.row.createTime | getTime}}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="微信店铺">
					<template slot-scope="scope">
						<div v-if="scope.row.isShopOpen" class="text-success">已启用</div>
						<div v-else class="text-danger">未启用</div>
					</template>
				</el-table-column>
				<el-table-column
					label="支付账号">
					<template slot-scope="scope">
						<div>{{scope.row.payTypeText}}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="联系人">
					<template slot-scope="scope">
						<div>{{scope.row.wkName}}</div>
						<div>{{scope.row.wkPhone}}</div>
					</template>
				</el-table-column>

				<el-table-column
					label="状态">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1" class="t-state-success text-success">正常使用</div>
						<div v-if="scope.row.status == 0">已停用</div>
						<div v-if="scope.row.status == -1">已删除</div>
					</template>
				</el-table-column>
		  </el-table>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import time from '@/utils/helpers/timeLite'

  export default {
		data: function() {
      return {
				loading: true,
				cityMoreEnable: false,
				tableData: {
					list: []
				}
			}
    },
		created () {
		 this.queryCityMore()
		 this.list(0)
	 	},
		methods: {
		  queryCityMore(){
				this.$store.dispatch('post', {
					uri : 'mercInfo/cityMore',
					data: {}
				}).then((res) =>{
						this.cityMoreEnable = res.data.data
				})
			},
			list (){
				this.$store.dispatch('post', {
					uri : 'mercCity/list',
					data: {}
				}).then((res) =>{
					var list = res.data.data || []
					this.tableData.list = list
					this.loading = false
				})
			},
			onCityDetail(city){
				this.$emit("backToTitle", city.name || '')
				this.$router.push('/mcity/detail/'+city.id)
			},
			showMessage(city) {
				this.$emit("backToTitle", city.name || '')
				this.$router.push('/mcity/project/'+city.id)
			}
		}
  }
</script>