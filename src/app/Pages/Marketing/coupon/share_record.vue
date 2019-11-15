<template>
	<div>
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
		      label="分享者">
		      <template slot-scope="scope">
		      	<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userName}}</a></div>
		      	<div class="text-primary"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userPhone}}</a></div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="分享时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.createTime | getDate }}</div>
		        <div>{{ scope.row.createTime | getTime }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column label="分享信息" min-width="120">
					<template slot-scope="scope">
						<img class="thumb" :src="scope.row.imgPath" alt="">
						<div> {{scope.row.title}} </div>
						<div class="text-muted"> {{scope.row.shareDetail}}</div>
					</template>
		    </el-table-column>
		    <el-table-column label="券信息" min-width="140">
					<template slot-scope="scope">
						<div>
							{{scope.row.couponInfo}}
						</div>
						<div class="text-muted">使用说明：{{scope.row.detail}}</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      prop="cnt"
		      label="发放总数">
		    </el-table-column>
				<el-table-column label="分享状态">
					<template slot-scope="scope">
						<div v-if="scope.row.isShared == 1" class="text-success">已分享</div>
						<div v-else class="text-muted">未分享</div>
					</template>
    		</el-table-column>
		    <el-table-column  label="已领取">
					<template slot-scope="scope">
						<div>
							<a :href="'/marketing/coupon/share_record/receive/'+scope.row.couponId" class="text-primary">{{scope.row.receiveCnt}}</a>
						</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="同步标签">
		      <template slot-scope="scope">
		        <div>
							<el-tag class="m-r m-b-xs"
								:key="tag.id"
								type="primary"
								v-for="tag in scope.row.tagList"
								:closable="false"
								:close-transition="false"
							>{{tag.name}}</el-tag>
		        </div>
		      </template>
		    </el-table-column>
				<el-table-column label="订单编号">
	    		<template slot-scope="scope">
						<div>
							<a target="_blank" :href="'/order/list/detail/'+scope.row.orderId" class="text-primary">
							{{scope.row.orderNo}}
							</a>
						</div>
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
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import consts from '@/utils/consts'
	import time from '@/utils/helpers/timeLite'
	import calculation from '@/utils/helpers/calculation'

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
					list: [],
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0
					}
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
			  this.search()
		  },
			list(start){
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponShare/list',
					params: {
						startRow: start || 0,
						pageSize: _this.tableData.pagination.size,
						keywords: _this.tableData.keywords || ''
					}
				}).then((res) => {
				  var _this = this
					let list = res.data.data.list || []
					list.forEach(function (item) {
						if(item.toTime){
							item.shareDate = time.getDate(item.toTime)
							item.shareTime = time.getTime(item.toTime)
						}
						item.timeEnd = item.timeEnd ? time.getDate(item.timeEnd) : item.timeEnd
						item.tagList = item.tagNames ? eval(item.tagNames) : []
						item.couponInfo = _this.couponMsg(item)
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			couponMsg(item){
			  var cop = []
				cop.push(item.couponName)
				if(item.random){
					let minAmount = item.minAmount
					let maxAmount = item.maxAmount
					minAmount = minAmount ? calculation.accDiv(minAmount, 100) : minAmount
					maxAmount = maxAmount ? calculation.accDiv(maxAmount, 100) : maxAmount
					cop.push(minAmount + '-' + maxAmount +'元（随机）')
				}else{
				  let amount = item.amount
					amount = amount ? calculation.accDiv(amount, 100) : ''
					cop.push(amount +'元')
				}
				let fullAmount = item.fullAmount
				fullAmount = fullAmount ? calculation.accDiv(fullAmount, 100) : fullAmount
				cop.push(item.couponRuleName)
				if(item.perUserNum) {
          cop.push("每人" + (item.perUserNum || '') + "张")
        }
				cop.push("满"+fullAmount+"元可使用")
				if(item.term) {
          cop.push("分享后" + (item.term || '') + "天内有效")
        }
				return cop.join(",")
			},
			handleCurrentChange (val){
				 this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				 this.list(this.tableData.pageStart)
	  	}
    }
	}
</script>

<style scoped>
	
</style>