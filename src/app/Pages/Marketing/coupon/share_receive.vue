<template>
	<div v-loading="loading">
		<div>
			<!-- 面包屑 -->
		 <el-breadcrumb class="l-h36" separator="/">
			 <el-breadcrumb-item to="/marketing/coupon/share_record">
				 <i class="el-icon-arrow-left icon-smaller"></i>分享赠券列表</el-breadcrumb-item>
			 <el-breadcrumb-item>用户领取列表</el-breadcrumb-item>
		 </el-breadcrumb>
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="searchStatus"></v-tab-nav>
		</div>
		<div class="m-t-lg ukao-v-loading">
			<el-table class="ukao-el-table m-t"
					v-loading="loading"
					:data="tableData.list"
					style="width: 100%">
					<el-table-column  width="76px"  label="头像">
						<template slot-scope="scope">
							<img class="thumb" :src="scope.row.headimgPath || 'static/user/def.png'" alt="">
						</template>
					</el-table-column>
					<el-table-column
						label="领取用户">
						<template slot-scope="scope">
							<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userName || scope.row.wxNickName}}</a></div>
							<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userPhone || ''}}</a></div>
						</template>
					</el-table-column>
					<el-table-column
						label="领取时间">
						<template slot-scope="scope">
							<div>{{ scope.row.createTime | getDate }}</div>
							<div>{{ scope.row.createTime | getTime }}</div>
						</template>
					</el-table-column>
					<el-table-column
						label="券面值">
						<template slot-scope="scope">
								<div>{{ scope.row.amount | amtFormat }}</div>
							</template>
					</el-table-column>
				<el-table-column
						label="使用规则">
						<template slot-scope="scope">
								<div>{{ scope.row.couponRuleName }}</div>
							</template>
					</el-table-column>
				<el-table-column
						label="使用状态">
						<template slot-scope="scope">
								<div class="text-muted" v-if="scope.row.useStatus == 0">{{ scope.row.useStatusText  }} </div>
								<div v-else>{{ scope.row.useStatusText  }} </div>
							</template>
					</el-table-column>
				<el-table-column label="有效期">
					<template slot-scope="scope">
						<div>{{ scope.row.timeStart | getDate }}</div>至
						<div>{{ scope.row.timeEnd | getDate }}</div>
					</template>
				</el-table-column>
				<el-table-column
						label="转赠">
						<template slot-scope="scope">
								<div class="text-muted" v-if="scope.row.useStatus == 0">{{ scope.row.shareStatusText  }}</div>
								<div v-else>{{ scope.row.shareStatusText  }}</div>
							</template>
					</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<div class="text-success" v-if="scope.row.status == 1 && scope.row.useStatus == 0 && scope.row.shareStatus == 0 && scope.row.timeEndStatus">
							正有效
						</div>
						<div class="text-danger" v-else>已无效</div>
					</template>
				</el-table-column>
				</el-table>
		</div>
		<div class="text-right m-t-sm">
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
	import vTabNav from '../../Common/tab_nav.vue'
	import msg from '@/utils/msg'
	import consts from '@/utils/consts'
	import time from '@/utils/helpers/timeLite'

	export default {
		components: {
			vTabNav
		},
		data: function() {
		  return {
        loading: true,
				tabsNavList: [],
        tableData: {
					status:'',
					useStatus:'',
					timeType:'',
          pageStart: 0,
          list: [],
					couponId: this.$route.params.couponId,
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0
          }
        }
      }
    },
		created(){
			this.tabsNavList = [
				{status:'', useStatus:'', timeType:0, text: '全部' },
				{status:'', useStatus:'1', timeType:0, text: '已使用' },
				{status:'', useStatus:'0', timeType:1, text: '未使用（有效）' },
				{status:'', useStatus:'0', timeType:-1,  text: '未使用（过期）' }
			]	
			this.list(0)
		},
		methods: {
			list(start){
				var _this = this
				if(!_this.tableData.couponId){
				  return
				}
					_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponUserRel/shareList',
					params: {
						couponId: _this.tableData.couponId || '',
						startRow: start || 0,
						status: _this.tableData.status || '',
						useStatus: _this.tableData.useStatus || '',
						timeType: _this.tableData.timeType,
						pageSize: _this.tableData.pagination.size,
					}
				}).then((res) => {
					let list = res.data.data.list || []
					list.forEach(function (item) {
						item.timeEndStatus = item.timeEnd > res.data.timestamp
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			searchStatus(item){
				this.tableData.status = item.status
				this.tableData.useStatus = item.useStatus
				this.tableData.timeType = item.timeType
				this.list(0)
			},
			handleCurrentChange (val){
				 this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				 this.list(this.tableData.pageStart)
	  	}
    }
  }
</script>