<template>
	<div class="ukao-pt-lg ukao-padder">
		<div class="clearfix text-right">
			<div class="pull-left" style="margin-top: 2px;">
				<v-tab-nav :tabNavList="tabNavList" :onClick="tabSearch" ></v-tab-nav>
			</div>
			<div class="w dis-inline ">
		  	<el-input placeholder="请输入关键字搜索" v-model="tableData.keywords" @keyup.enter.native="search">
					<!--<el-button slot="append" icon="el-icon-search" @click="search"></el-button>-->
			  </el-input>
		  </div>
			<div class="dis-inline">
			<el-select class="ukao-el-select m-r" v-model="tableData.bizType" clearable filterable placeholder="所有产品类型">
				<el-option
					v-for="item in productList" :key="item.id"
					:label="item.showText"
					:value="item.val">
				</el-option>
			</el-select>
			</div>
		  <!--<span class="m-r-sm">创建时间</span>-->
		  <div class="dis-inline m-r">
		  	<el-date-picker style="width: 140px"
		      v-model="tableData.createDate"
		      type="date"
		      placeholder="创建时间日期">
		    </el-date-picker>
		  </div>
		  <el-button type="primary" @click="search">筛选</el-button>
		</div>

		<div class="m-t-lg" v-loading="loading">
			<el-table class="ukao-el-table"
		    ref="multipleTable"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="创建时间">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.createDate }}</div>
		      	<div>{{ scope.row.createTime }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="颜色/图片">
		      <template slot-scope="scope">
		      	<div v-if="scope.row.bizType === 'brand'">
		      		<img class="thumb-sm" :src="scope.row.imgPath" alt="">
		      	</div>
		      	<div v-if="scope.row.bizType === 'color'" class="color-block" :style="{ background: scope.row.color }"></div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="名称">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.name }}</div>
		      </template>
		    </el-table-column>
		    <!-- <el-table-column
		      label="编号">
		      <template slot-scope="scope">{{ scope.row.code }}</template>
		    </el-table-column> -->
		    <el-table-column
		      label="首字母">
		      <template slot-scope="scope">{{ scope.row.firstWord }}</template>
		    </el-table-column>
		    <el-table-column
		      label="类型">
		      <template slot-scope="scope">{{ scope.row.bizTypeName }}</template>
		    </el-table-column>
		    <el-table-column
		      label="序号">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.sortNo }}</div>
		      </template>
		    </el-table-column>
<!-- 状态这一列仅供后台端使用 -->
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
			      <el-tooltip v-if="scope.row.status === 1" effect="dark" content="审核通过" placement="right">
				      <i class="t-state t-state-success"></i>
				    </el-tooltip>
				    <el-tooltip v-if="scope.row.status === 0" effect="dark" content="审核中" placement="right">
				      <i class="t-state t-state-danger"></i>
				    </el-tooltip>
						<el-tooltip v-if="scope.row.status === -1 " effect="dark" content="审核未通过" placement="right">
				      <i class="t-state"></i>
				    </el-tooltip>
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
	import time from '@/utils/helpers/timeLite'
	import vTabNav from "../../Common/tab_nav.vue"

	export default {
		components: {
			vTabNav
		},
		data() {
			return {
				loading: true,
				tableData: {
					createDate: '',
					keywords : '',
					status: '',
					bizType: '',
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				input: '',
				value: '',
				tabNavList: [
					{ val: '', text: '全部' },
					{ val: '0', text: '审核中' },
					{ val: '1', text: '已通过' },
					{ val: '-1', text: '未通过' },
				],
				productList: []	//查票类型
			}
		},
		watch : {		//监听选择改变
			'tableData.createDate'(val){
			    this.tableData.createDate = val ? time.getDate(val) : ''
			},
		},
		created () {
			this.getProductList()
			setTimeout(() => {
				this.list(0)
			}, 300);
    },
		methods: {
			search (){
				this.list(0)
			},
		  list(start){
				var _this = this
				this.$store.dispatch('getList', {
					uri : 'productAuditing/list',
					data: {
						startRow: start || 0,
						pageSize: _this.tableData.pagination.size,
						createDate: this.tableData.createDate,
						status: this.tableData.status,
						bizType: this.tableData.bizType || '',
						keywords: this.tableData.keywords || ''
					}
				}).then((res) =>{
				  let list = res.data.data.list || []
					let expList = res.data.expList || []
					list.forEach(function (item, index) {
					  //获取不同类型记录详情
					  let expItem = expList[index]
						if(item.createTime){
							item.createDate = time.getDate(item.createTime)
							item.createTime = time.getTime(item.createTime)
						}
						if(expItem) {
              item.color = expItem.color || ''
              item.imgPath = expItem.brandImg || ''
              item.code = expItem.code || ''
              item.firstWord = expItem.firstWord || ''
              item.sortNo = expItem.sortNo || ''
            }

            //获取类别名称
            if(_this.productList){
							_this.productList.forEach(function (pitem) {
								if(pitem.val === item.bizType){
								  item.bizTypeName = pitem.showText
									return false
								}
              })
						}

          })
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			tabSearch (item){
		    this.tableData.status = item.val
				this.search()
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
			getProductList(){
				var _this = this
					_this.getDictList('PRODUCT_CLASS', function (list) {
					_this.productList = list
			 })
			},
			getDictList (code, fn){		//获取字典
				if(!code) return
				this.$store.dispatch('getList', {
					uri: 'sysDicVal/valList',
					data: {
						code: code
					}
				}).then((res) => {
					let list = res.data.data || []
					if(typeof (fn) === 'function'){
							fn(list)
					}
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
	.color-block {
		width: 40px;
		height: 40px;
	}
</style>