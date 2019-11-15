<template>
	<div >
		<ul class="uk-search">
			<li class="uk-search-item">
				<storeSelecte v-model="tableData.storeId"></storeSelecte>
			</li>
			<li class="uk-search-item">
				<factorySelecte v-model="tableData.factoryId"></factorySelecte>
			</li>
			<li class="uk-search-item">
				<citySelecte v-model="tableData.cityId"></citySelecte>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">
					品牌：
				</div>
				<el-select class="thumb-xl" remote :remote-method="queryBrandList" @clear="queryBrandList('')" :loading="brandData.loading" v-model="tableData.brandId" filterable clearable placeholder="全部">
					<el-option
						v-for="item in brandData.list"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
					<p class="text-center" v-if="brandData.list.length < brandData.total">
						<el-button type="text" size="small" @click="queryBrandList(undefined)">查找更多</el-button>
					</p>
				</el-select>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">
					入厂：
				</div>
				<el-select class="thumb-xl" v-model="tableData.inBatch" filterable clearable placeholder="全部">
					<el-option
						v-for="item in inBachtList"
						:key="item.index"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">
					出厂：
				</div>
				<el-select class="thumb-xl" v-model="tableData.outBatch" filterable clearable placeholder="全部">
					<el-option
						v-for="item in outBachtList"
						:key="item.index"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">状态：</div>
				<el-select class="w" v-model="tableData.proStatusVal" clearable placeholder="请选择">
					<el-option
						label="全部"
						value="">
					</el-option>
					<el-option
						v-for="item in orderProOptions"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
				<el-date-picker
					v-model="date.create"
					type="daterange"
					align="right"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:picker-options="pickerOptions0">
				</el-date-picker>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">修改金额：</span>
				<el-select class="w-sm"
									 filterable placeholder="全部"
									 clearable v-model="tableData.isModifyPrice">
					<el-option label="未修改" value="-1"></el-option>
					<el-option label="有修改" value="1"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">关键字：</span>
				<el-input class="w" placeholder="单号、衣物条码、衣物名字"
						prefix-icon="el-icon-search"
						v-model="tableData.keywords" @keyup.enter.native="search" style="width:220px;">
				</el-input>
			</li>
			<li class="uk-search-item">
				<el-button type="primary" @click="updateUrl(1)">筛选</el-button>
			</li>
		</ul>
		<div class="m-t-lg">
		  <el-table class="ukao-el-table ukao-v-loading" v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="名称">
		      <template slot-scope="scope">
						<div>{{scope.row.productName}} - {{scope.row.serviceName}}</div>
						<div>
							<a target="_blank" :href="'/product/detail/'+scope.row.pid" class="text-primary">
								{{scope.row.pScanCode}}
							</a>
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="订单号 | 衣物条码">
					<template slot-scope="scope">
						<div>
							<a target="_blank" :href="'/order/list/detail/'+scope.row.orderId" class="text-primary">
							{{scope.row.orderNo}}
							</a>
						</div>
						<div>
							<a target="_blank" :href="'/product/detail/'+scope.row.id" class="text-primary">
							{{scope.row.scanCode}}
							</a>
						</div>
					</template>
		    </el-table-column>
				<el-table-column
					label="绑定条码">
					<template slot-scope="scope">
						<div>{{scope.row.bindCode}}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="入库时间">
					<template slot-scope="scope">
						<div>{{scope.row.createTime | getDate}}</div>
						<div>{{scope.row.createTime | getTime}}</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="客户">
					<template slot-scope="scope">
						<div>
							<img
								style="vertical-align: middle;width: 14px; margin-right: 1px"
								:src="scope.row.grade == 1 ? '/static/img/user/crown_blue.png' :
											scope.row.grade == 2 ? '/static/img/user/crown_yellow.png' :
											scope.row.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
								alt=""/>
							<a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">
							{{scope.row.userName}}
							</a>
						</div>
						<div>
							<a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">
							{{scope.row.userPhone}}
							</a>
						</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="门店|工厂">
					<template slot-scope="scope">
						<div>{{scope.row.storeName || '-'}}</div>
						<div>{{scope.row.factoryName || '-'}}</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="小计">
		      <template slot-scope="scope">
						<div class="text-success">{{scope.row.subtotal | amtFormat}}<span class="bg-danger ts-icon" style="margin-left: 5px" v-if="scope.row.chgSubtotal">改</span></div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
						<div>{{scope.row.statusText}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="取衣时间">
		      <template slot-scope="scope">
						<div>{{scope.row.takenTime | getDate}}</div>
						<div>{{scope.row.takenTime | getTime}}</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="入厂袋号|出厂批次">
		      <template slot-scope="scope">
						<div>{{scope.row.batchInCode || '-'}}</div>
						<div>{{scope.row.batchOutCode || '-'}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
		      label="工厂上架|门店上架">
		      <template slot-scope="scope">
						<div>{{scope.row.factoryBracket || '-'}}</div>
						<div>{{scope.row.storeShelfNo || '-'}}</div>
		      </template>
		    </el-table-column>
		  </el-table>
			<div class="text-right m-t-sm">
				<el-button size="small" class="pull-left" @click="exportData">导出</el-button>
				<el-pagination
					:page-size="tableData.pagination.size"
					layout="total, prev, pager, next"
					:total="tableData.pagination.total"
					:current-page.sync = "tableData.pagination.page"
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
	// https://github.com/lindell/JsBarcode#options 参数表
	// import Qrcode from '@xkeshi/vue-qrcode'
	// import Barcode from '@xkeshi/vue-barcode'
	import orderConfig from '@/models/order/config'
	import citySelecte from '@/components/DropDownList/city'
	import storeSelecte from '@/components/DropDownList/store'
	import factorySelecte from '@/components/DropDownList/factory'

	export default {
		components: {
			//  qrcode: Qrcode, barcode: Barcode,
			 citySelecte,
			 storeSelecte,
			 factorySelecte
	  },
		data: function() {
			return {
				loading: true,
        tableData: {
          keywords: '',
					startDate:'',
					endDate:'',
					inBatch:'',
          isModifyPrice:'',
					outBatch:'',
					storeId:'',
					factoryId :'',
					brandId: '',
					cityId:'',
					proStatusVal:'',
					timeType:"",
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0,
						page:1,
          },
        },
        brandData: {
				  list: [],
          keywords: '',
          loading: false,
          size: consts.PAGE_SIZE,
          total: 0,
					page: 1
				},
				orderProOptions:[],
				inBachtList:[
				  {id:'0',name:'未分配'},
				  {id:'1',name:'已分配'},
				],
				outBachtList:[
				  {id:'0',name:'未分配'},
				  {id:'1',name:'已分配'},
				],
				pickerOptions0: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				date:{
				  create:[new Date() - 3600 * 1000 * 24 * 30, new Date()]
				}
			}
		},
		created () {
			this.initParams();
			this.list();
			this.queryBrandList();
			this.orderProOptions = orderConfig.orderProList() || []
    },
		watch : {
			'$route'(){
				this.initParams();
				this.list();
			}
    },
		methods: {
			updateUrl(page = 1){
				if(!this.date.create) this.date.create = [];
				this.$router.push({
					path:'/product/all',
					query:{
						page: page,
						startDate: time.getDate(this.date.create[0]),
						endDate: time.getDate(this.date.create[1]),
						inBatch: this.tableData.inBatch || '',
						outBatch: this.tableData.outBatch || '',
            isModifyPrice: this.tableData.isModifyPrice || '',
						storeId: this.tableData.storeId || '',
						factoryId: this.tableData.factoryId || '',
						cityId: this.tableData.cityId || '',
            brandId: this.tableData.brandId || '',
						proStatusVal: this.tableData.proStatusVal || '',
						keywords: this.tableData.keywords || '',
						timeType: this.tableData.timeType || '',
					}
				})
			},
			queryBrandList(keywords) {

				if(typeof keywords !== 'undefined' && this.brandData.keywords != keywords) {
				  this.brandData.page = 1;
          this.brandData.keywords = keywords;
				}
				let startRow = (this.brandData.page - 1) * this.brandData.size;
				if (this.brandData.page > 1 && startRow > this.brandData.total) {
				  return;
				}

        this.brandData.loading = true;
        this.$store
          .dispatch("post", {
            uri: "productBrand/list",
            data: {
              keywords: this.brandData.keywords,
              startRow: startRow,
              pageSize: this.brandData.size
						}
          }).then(res => {
          if (this.brandData.page == 1) {
            this.brandData.list = res.data.data.list || [];
					} else {
            this.brandData.list = this.brandData.list.concat(res.data.data.list || []);
					}
          this.brandData.total = res.data.data.total;

          this.brandData.page++;
          this.brandData.loading = false;
        });
			},
			initParams(){
				let data = this.$route.query;
				if(JSON.stringify(data) !== '{}'){
					this.tableData.pagination.page = parseInt(data.page || 1);
					this.date.create = [data.startDate,data.endDate];
					this.tableData.inBatch = data.inBatch || '';
					this.tableData.outBatch = data.outBatch || '';
					this.tableData.isModifyPrice = data.isModifyPrice || '';
					this.tableData.storeId = parseInt(data.storeId) || '';
					this.tableData.cityId = parseInt(data.cityId) || '';
					this.tableData.factoryId = parseInt(data.factoryId) || '';
					this.tableData.proStatusVal = data.proStatusVal || '';
					this.tableData.keywords = data.keywords || '';
					this.tableData.timeType = data.timeType || '';
				}
			},
			list(page){
				this.loading = true
      	if (page) this.tableData.pagination.page = parseInt(page || 1);
				let data = this.getSearchParams();
				data.startRow = (this.tableData.pagination.page - 1) * this.tableData.pagination.size;
				data.pageSize = this.tableData.pagination.size;
				this.$store.dispatch('post', {
					uri : 'orderProductRel/proList',
					data
				}).then((res) =>{
					let list = res.data.data.list || []
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
        })
			},
			handleCurrentChange (val){
			 this.updateUrl(val)
		 },
		//  获取搜索参数
		 getSearchParams(){
			let data = {
				startDate: "",
				endDate: "",
				startTakenDate:'',
				endTakenDate:'',
				inBatch: this.tableData.inBatch || '',
				outBatch: this.tableData.outBatch || '',
        isModifyPrice: this.tableData.isModifyPrice || '',
				storeId: this.tableData.storeId || '',
				factoryId: this.tableData.factoryId || '',
				cityId: this.tableData.cityId || '',
        brandId: this.tableData.brandId || '',
				proStatusVal: this.tableData.proStatusVal || '',
				keywords: this.tableData.keywords || ''
			};
			if(this.tableData.timeType){
				data.startTakenDate = time.getDate(this.date.create[0])
				data.endTakenDate = time.getDate(this.date.create[1])
			}else{
				data.startDate = time.getDate(this.date.create[0])
				data.endDate = time.getDate(this.date.create[1])
			}
			return data;
		 },
		 exportData(){
			 let data = this.getSearchParams();
			let params =
				Object.keys(data).map(key=>{
					return `${key}=${data[key]}`
				}).join('&');
        window.open(consts.BASE_URL +"/export/order/product/list?" + params)
		 }
		}
	}
</script>