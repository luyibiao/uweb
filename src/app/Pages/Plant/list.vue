<template>
	<div>
		<div class="clearfix">
			<div class="ukao-form">
				<div class="ukao-form_content text-right">
					<el-input class="ukao-el-input m-r" placeholder="请输入名称、编号" v-model="tableData.keywords" @keyup.enter.native="search">
       			<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
					<auth perm="plant.update">
						<router-link to="/plant/new"><el-button type="primary">新建工厂</el-button></router-link>
					</auth>
				</div>
			</div>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table m-t ukao-v-loading" v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="工厂名称">
		      <template slot-scope="scope">
		        <div class="text-primary"><router-link :to="'/plant/info/'+scope.row.id">{{ scope.row.name }}</router-link></div>
		      </template>
		    </el-table-column>

				<el-table-column label="设备 | 版本" width="250px">
					<template slot-scope="scope" >
						<ul  class="icon-li">
							<li v-for="(item, index) in scope.row.cashierList" v-if="item">
								<img v-if="item.monitor == 'T2lite' || item.monitor =='D1'" src="/static/img/machine/T2little.png" />
								<img v-else="" src="/static/img/machine/L1.png"/>
								{{ item.monitor}}<span>{{'(V'+item.bizVersion+')'}}</span>
							</li>
						</ul>
					</template>
				</el-table-column>
		    <el-table-column
		      label="编号" prop="code">
		    </el-table-column>
		    <el-table-column
		      label="城市">
					<template slot-scope="scope">
					 <p>{{scope.row.cityName}}</p>
				 </template>
		    </el-table-column>
		    <el-table-column
		      label="工位机">
					<template slot-scope="scope">
						<div v-if="scope.row.expCnt && scope.row.expCnt > 0">
							<p>已绑定</p>
							<p class="text-muted">{{scope.row.expCnt}}台</p>
						</div>
						<p v-else class="text-muted">未绑定</p>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="登录账号">
		      <template slot-scope="scope">
		        <div>{{ scope.row.workAccount }}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="创建时间">
					<template slot-scope="scope">
						<div>{{ scope.row.date }}</div>
						<div>{{ scope.row.time }}</div>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<auth perm="plant.update">
							<el-switch
								v-model="scope.row.statusVal"
								active-color="#13ce66"
								inactive-color="#dcdcdc"
								:width="74"
								on-text="已启用"
								off-text="未启用" @change="updateStatus(scope.row)">
							</el-switch>
							<template slot="noPerm">{{scope.row.statusVal | getValText('DATE_STATUS')}}</template>
						</auth>
					</template>
				</el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
			<el-pagination
			 :page-size="tableData.pagination.size"
			 layout="total, prev, pager, next"
			 :total="tableData.pagination.total"
			 @current-change="handleCurrentChange">
		 </el-pagination>
	  </div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'

	export default {
		data() {
			return {
				loading: true,
				tableData: {
					keywords : '',
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE20,
						total: 0
					}
				}
			}
		},
		created () {
      this.list(0)
    },
		methods: {
			search (){
				this.list(0)
			},
			list (start) {
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri : 'factoryInfo/list',
					params: {
						startRow: start || 0,
            machineIconFlag: true,
						pageSize: _this.tableData.pagination.size,
						keywords: this.tableData.keywords || ''
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					let expList = res.data.expList || []
					list.forEach(function (item) {
						 if(item.createTime){
							 item.date = time.getDate(item.createTime)
							 item.time = time.getTime(item.createTime)
						 }
						 item.statusVal = item.status === 1 ? true : false
						 let cnt = 0
						 expList.forEach(function (eitem) {
								if(eitem.factoryId === item.id){
									cnt += 1
								}
						 })
						 item.expCnt = cnt
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			filterData (list, id){	//数据过滤
				if(!list && !id) return
				let tmpItem = null
				list.forEach(function (item) {
						if(id && item.id === id){
							tmpItem = item
							return false
						}
				})
				return tmpItem;
			},
			updateStatus (item){
				this.$store.dispatch('post', {
					uri: item.status ? 'factoryInfo/disable' : 'factoryInfo/enable',
					params: {
						id: item.id
					}
				}).then((res) => {
						msg.success();
				})
			},
			handleCurrentChange (val){
				this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				this.list(this.tableData.pageStart)
			}
		}
	}
</script>

<style scoped>
	.filter-list li {
		float: left;
		width: 320px; 
		margin-right: 30px;
		margin-bottom: 10px;
	}
	 .icon-li{
		 /*width: 50%;*/
	 }
	.icon-li > li{
		width: 50%;
		float: left;
	}

	.icon-li > li> img{
		width:20px;
	}

	.icon-li>li>span{
		color: #98a6ad;
	}
</style>