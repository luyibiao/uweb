<template>
	<div>
		<div class="clearfix">
			<auth perm="marketing.coupon.distribute">
				<router-link to="/client/list/all"><el-button class="pull-right" type="primary">主动派发</el-button></router-link>
			</auth>
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="searchStatus"></v-tab-nav>
		</div>
		<div class="m-t-lg  ukao-v-loading">
			<el-table class="ukao-el-table m-t"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="优惠券名称"
		      prop="name">
		    </el-table-column>
		    <el-table-column
		      label="创建时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.date }}</div>
		        <div>{{ scope.row.time }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="券面值（元）">
		      <template slot-scope="scope">
		        <div v-if="scope.row.random == 0">{{ scope.row.amount | amtFormat }}</div>
		        <div v-if="scope.row.random == 1 ">{{ scope.row.minAmount | amtFormat }} - {{ scope.row.maxAmount | amtFormat }}</div>
		        <div class="text-muted">满{{ scope.row.fullAmount | amtFormat }}元可用</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="发送张数">
		      <template slot-scope="scope">
		        <div v-if="scope.row.perUserNum > 0">每人{{ scope.row.perUserNum }}张</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="有效期">
		      <template slot-scope="scope">
						<div v-if="scope.row.dateType == 1">
							<div>{{ scope.row.timeStart }}至</div>
							<div>{{ scope.row.timeEnd }}</div>
						</div>
						<div v-if="scope.row.dateType == 2">
							<div class="text-muted">领取后{{ scope.row.term }}天效</div>
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="领取人 | 券">
		      <template slot-scope="scope">
            <div>
              <router-link :to="'/marketing/coupon/getDetail?couponId='+scope.row.id" class="text-primary" >{{ scope.row.userNum || 0 }}</router-link>/{{ scope.row.totalNum || 0}}
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="使用规则">
          <template slot-scope="scope">
            <div>
              <a class="text-primary">{{ scope.row.ruleName }}</a>
            </div>
          </template>
		    </el-table-column>
		    <el-table-column
		      label="已使用数">
		      <template slot-scope="scope">
		       <div>
             <a class="text-primary">{{ scope.row.usedNum || 0 }}</a>
           </div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="说明｜备注">
		      <template slot-scope="scope">
						<div class="text-primary" @click="info(scope.row)">详情</div>
		      </template>
		    </el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination
			 :page-size="tableData.pagination.size"
			 :current-page.sync="tableData.pageStart"
			 layout="total, prev, pager, next"
			 :total="tableData.pagination.total"
			 @current-change="handleCurrentChange">
		 </el-pagination>
	  </div>

		<!-- 说明｜备注-->
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
						备注：
					</span>
					{{dialog.remark}}
				</div>
			</div>
		</el-dialog>
		<!-- 说明｜备注-->

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
    data: function () {
      return {
        loading: true,
        tableData: {
          keywords: '',
          pageStart: 1,
					status: '',
					type: '2',
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0
          }
        },
        tabsNavList: [
          {val:'', text: '全部'},
          {val: '0', text: '未生效'},
          {val: '1', text: '正有效'},
          {val: '-1', text: '已过期'}
        ],
				dialog:{
					visible: false,
					detail: '',
					remark: ''
				}
      }
    },
    created(){
			this.list(0)
    },
    methods: {
      search (){
        this.list(0)
      },
      searchStatus(item){
        this.tableData.pageStart = 1;
        this.tableData.status = item.val
        this.search()
      },
			list(){
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponInfo/list',
					params: {
						startRow: (this.tableData.pageStart-1) * this.tableData.pagination.size || 0,
						status: this.tableData.status,
						type: this.tableData.type,
						pageSize: _this.tableData.pagination.size,
						keywords: this.tableData.keywords || ''
					}
				}).then((res) => {
					let list = res.data.data.list || []
					list.forEach(function (item) {
						if(item.createTime){
						  item.date = time.getDate(item.createTime)
						  item.time = time.getTime(item.createTime)
					  }
						item.timeStart = time.getDate(item.timeStart)
				  	item.timeEnd = time.getDate(item.timeEnd)
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			handleCurrentChange (){

				 this.list()
	  	},
			info(row){
				this.dialog.visible = true
				this.dialog.detail = row.detail
				this.dialog.remark = row.remark
			}
    }
  }
</script>

<style scoped>
	
</style>