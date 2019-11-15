<template>
	<div>
		<div class="clearfix">
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="searchStatus"></v-tab-nav>
		</div>
		<div class="m-t-lg ukao-v-loading">
			<el-table class="ukao-el-table m-t"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column 
		    	width="76px"
		      label="头像">
		      <template slot-scope="scope">
						<img class="thumb" :src="scope.row.headimgPath || '/static/img/user/def.png'">
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="客户">
		      <template slot-scope="scope">
						<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.name}}</a></div>
		      	<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.phone}}</a></div>
		      </template>
		    </el-table-column>
		    <el-table-column 
		      label="性别">
					<template slot-scope="scope">
						<span v-if="scope.row.sex == 0">未知</span>
						<span v-if="scope.row.sex == 1">男</span>
						<span v-if="scope.row.sex == 2">女</span>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="获赠时间|到期时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.createTime | getDateTime }}</div>
		        <div>{{ scope.row.timeEnd | getDate}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="券面值">
		      <template slot-scope="scope">
		        <div>{{ scope.row.amount|amtFormat }}</div>
		        <div class="text-muted">满{{ scope.row.fullAmount|amtFormat}}元可使用</div>
		        <div class="text-muted">每人{{ scope.row.perUserNum }}张</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="说明 | 标签">
		      <template slot-scope="scope">
		        <div class="text-primary" @click="detail(scope.row)">详情</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="使用规则">
					<template slot-scope="scope">
						<div>{{ scope.row.couponRuleName }}</div>
						<div v-if="scope.row.useBalance != 1">不能与余额同时使用</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="使用时间">
					<template slot-scope="scope">
						<div>{{ scope.row.useTime | getDateTime }}</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="订单">
		      <template slot-scope="scope">
		        <div class="text-primary" v-if="scope.row.orderId">
							<router-link :to="'/order/list/detail/'+scope.row.orderId+''">详情</router-link>
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
		        <div v-if="scope.row.useStatus==0" class="text-danger">{{scope.row.useStatusText}}</div>
		        <div v-else class="text-success">{{scope.row.useStatusText}}</div>
		      </template>
		    </el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
			<!--<div class="pull-left"><el-button size="small">导出</el-button></div>-->
			<el-pagination
			 :page-size="tableData.pagination.size"
			 :current-page.sync="tableData.pageStart"
			 layout="total, prev, pager, next"
			 :total="tableData.pagination.total"
			 @current-change="handleCurrentChange">
		 </el-pagination>
	  </div>


		<!-- 说明｜标签-->
	<el-dialog class="ukao-dialog"
		title="详情"
		:visible.sync="dialog.visible"
		size="small">
			<div class="membership-content">

				<div class="m-t-sm">
					<span class="w-sm m-l-sm">使用说明：</span>
					{{dialog.detail}}
				</div>

				<div class="m-t-sm m-lg">
					<span class="w-sm m-l-sm ">
						同步打标签：
					</span>
					<el-tag class="m-r m-b-xs"
						:key="tag.id"
						type="primary"
						v-for="tag in dialog.tagList"
						:closable="false"
						:close-transition="false"
					>{{tag.name}}</el-tag>
				</div>
			</div>
		</el-dialog>
		<!-- 说明｜标签-->

	</div>
</template>

<script>
	import vTabNav from '../../Common/tab_nav.vue'
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import consts from '@/utils/consts'
	import time from '@/utils/helpers/timeLite'

	export default {
		components: {
			vTabNav
		},
		data: function() {
			return {
				tabsNavList: [],
				loading: true,
				tableData: {
					keywords: '',
					pageStart: 0,
					status: '',
					type:'3',
					useStatus: '',
					sysDate: '',
					timeEnd: '',
					list: [],
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				dialog:{
					visible: false,
					detail: '',
					tagList: ''
				}
			}
		},
		created(){
			this.list(0)
			this.sysDate = time.getDate(new Date())
			this.tabsNavList = [
				{status:'', useStatus:'', timeEnd:'', text: '全部' },
				{status:'', useStatus:'1', timeEnd:'', text: '已使用' },
				{status:'', useStatus:'0', timeEnd:'', text: '未使用（有效）' },
				{status:'', useStatus:'0', timeEnd:this.sysDate,  text: '未使用（过期）' }
			]
		},
		methods: {
			search (){
				this.list(0)
			},
			searchStatus(item){
				this.tableData.status = item.status;
				this.tableData.useStatus = item.useStatus;
				this.tableData.timeEnd = item.timeEnd;
				this.tableData.pageStart = 1;
        this.search();
			},
			list(){
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponUserRel/list',
					params: {
						startRow: (this.tableData.pageStart-1) * this.tableData.pagination.size  || 0,
						status: this.tableData.status,
						type: this.tableData.type,
						useStatus: this.tableData.useStatus,
						timeEnd: this.tableData.timeEnd,
						pageSize: _this.tableData.pagination.size,
						keywords: this.tableData.keywords || ''
					}
				}).then((res) => {
					let list = res.data.data.list || []
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			detail(row){
				this.dialog.visible = true
				this.dialog.detail = row.detail
				this.dialog.tagList = row.tagNames ? eval(row.tagNames ) : row.tagNames
			},
			handleCurrentChange (){
				 this.list()
	  	},
		}
	}
</script>
