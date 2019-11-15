<template>
	<div class="ukao-pt-lg">
		<div>
			<div class="thumb-xl m-b-sm">
				<el-select v-model="searchKeys.type" placeholder="请选择">
			    <el-option
			      v-for="item in searchOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			</div>
			<div class="dis-inline w-sm m-r m-b-sm">
				<el-input v-model="searchKeys.value" prefix-icon="el-icon-search" placeholder="请输入内容"></el-input>
			</div>
			<div class="dis-inline m-r m-b-sm">
			  <el-date-picker class="ukao-el-date"
		      v-model="searchKeys.tradeTimeObj"
		      type="daterange" align="right"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
		      :picker-options="createTimeOptions">
		    </el-date-picker>
			</div>
			<div class="dis-inline m-r m-b-sm">
        <el-select class="thumb-xl" clearable v-model="searchKeys.refundMethod" placeholder="支付方式">
					<el-option
						v-for="item in refundMethods"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
			</div>
			<storeSelect class="m-r" v-model="searchKeys.storeId"></storeSelect>
			<citySelect class="m-r" v-model="searchKeys.cityId"></citySelect>
			<!--<div class="dis-inline m-r m-b-sm">-->
				<!--代销：-->
        <!--<el-select class="w-sm" clearable v-model="searchKeys.agentPay" placeholder="请选择">-->
					<!--<el-option label="是" value="1"></el-option>-->
					<!--<el-option label="否" value="0"></el-option>-->
				<!--</el-select>-->
			<!--</div>-->
			<div class="dis-inline m-b-sm">
				<el-button type="primary" @click="updateUrl(1)">查询</el-button>
			</div>
		</div>
		<div class="m-t-lg">
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" :status = "searchKeys.status" :onClick="onclick"></v-tab-nav>
			<el-table class="ukao-el-table m-t"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
				<el-table-column
					label="创建日期">
					<template slot-scope="scope">
						<div>{{ scope.row.createTime | getDate }}</div>
						<div>{{ scope.row.createTime | getTime}}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="交易日期">
		      <template slot-scope="scope">
		        <div>{{ scope.row.tradeTime | getDate }}</div>
		        <div>{{ scope.row.tradeTime | getTime}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="所属门店">
					<template slot-scope="scope">
						<div>{{ scope.row.storeName}}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="退款流水号">
					<template slot-scope="scope">
						<div>{{ scope.row.seq }}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="订单号|原交易流水号">
		      <template slot-scope="scope">
						<div>
							<router-link class="text-primary" target="_blank" :to="(scope.row.orderType == 1?'/order/list/detail/':'/shops/order/detail/') + scope.row.orderId">{{ scope.row.orderNo }}</router-link>
							<span class="text-muted">{{scope.row.orderType | getValText('ORDER_TYPE')}}</span>
            </div>		        
						<div>{{ scope.row.tradeSeq }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="客户">
		      <template slot-scope="scope">
		        <div>{{ scope.row.userName }}</div>
		        <div>{{ scope.row.userPhone }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="金额|明细">
		      <template slot-scope="scope">
		        <div class="text-danger">{{ scope.row.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="退款方式">
					<template slot-scope="scope">
						<div>{{ scope.row.refundMethodText }}<span v-if="scope.row.agentPay==1">-代销</span><span class="dis-inline text-xs text-danger" v-if="scope.row.isSign==1">（标记退款）</span></div>
					</template>
		    </el-table-column>
				<el-table-column
					label="手续费">
					<template slot-scope="scope">
						<div class="text-success" v-if="scope.row.fee !== null">{{ scope.row.fee | amtFormat}}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="退款原因">
					<template slot-scope="scope">
						<div>{{ scope.row.remark}}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
		        <div :class="scope.row.status==1?'text-success':'text-danger'">{{ scope.row.statusText}}</div>
		      </template>
		    </el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
			<div class="pull-left">
				<auth perm="finance.trade.refund.export">
					<el-button size="small" @click="exportXls">导出</el-button>
				</auth>
			</div>
	  	<el-pagination
	      :page-size="tableData.pagination.size"
	      layout="total, prev, pager, next"
	      :total="tableData.pagination.total"
	      :current-page.sync="tableData.pagination.page"
				@current-change="handleCurrentChange">
	    </el-pagination>
	  </div>
	</div>
</template>

<script>
  import consts from '@/utils/consts'
  import bizconsts from '@/utils/bizconsts'
  import time from '@/utils/helpers/timeLite'
	import vTabNav from '../../Common/tab_nav.vue'
	import keyval from '@/utils/dickeyval'
	import citySelect from '@/components/DropDownList/city'
	import storeSelect from '@/components/DropDownList/store'

	export default {
		components: {
			vTabNav,
			citySelect,
			storeSelect
		},
		data: function() {
			return {
        origin: {
          wx: bizconsts.COMMON.ORIGIN_WX,
          cashier: bizconsts.COMMON.ORIGIN_CASHIER,
          appAide: bizconsts.COMMON.ORIGIN_APP_AIDE
				},
        loading : false,
        searchKeys: {
          type:'1',
          storeId:'',
          cityId:'',
          value:'',
          refundMethod:'',
          status:'',
          agentPay:'',
          tradeTimeObj:[new Date() - 3600 * 1000 * 24 * 30, new Date()]
        },
        tableData: {
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
						total: 0,
						page:1,
          }
        },
        searchOptions: [
					{
	          value: '1',
	          label: '订单号'
					},
					{
            value: '2',
            label: '退款流水号'
          },
					{
            value: '3',
            label: '客户'
          }
        ],
        refundMethods: keyval['TRADE_PAY_METHOD'],
        origins: keyval['TRADE_ORIGIN'],
        createTimeOptions: {
          shortcuts: [{
            text: '近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        tabsNavList: [
					{ id: '', text: '全部' },
          { id: '0', text: '退款中' },
					{ id: '1', text: '成功' },
					{ id: '-1', text: '失败' }
				],
			}
		},
    methods: {
      handleCurrentChange (val){
        this.updateUrl(val)
			},
			// 初始化参数
			initParams(){
				let data = this.$route.query;
				if(JSON.stringify(data) !== '{}'){
					this.searchKeys.storeId = parseInt(data.storeId) || '';
					this.searchKeys.cityId = parseInt(data.cityId) || '';
					this.searchKeys.type = data.searchType; //搜索方式，订单号还是支付流水号
					this.searchKeys.value = data.searchValue; //搜索内容
					this.searchKeys.tradeTimeObj = [data.startTradeTime,data.endTradeTime]; //时间
					this.searchKeys.status = data.status; //订单状态
					this.searchKeys.refundMethod = data.refundMethod; //支付方式
					this.searchKeys.agentPay = data.agentPay; //是否代付
					this.tableData.pagination.page = parseInt(data.page || 1);
				}
			},
			// 更新url
			updateUrl(page = 1){
				if(!this.searchKeys.tradeTimeObj) this.searchKeys.tradeTimeObj = [];
				this.$router.push({
					path: this.$route.path,
					query:{
						page: page,
            storeId: this.searchKeys.storeId,
            cityId: this.searchKeys.cityId,
            refundMethod: this.searchKeys.refundMethod,
            agentPay: this.searchKeys.agentPay,
            status : this.searchKeys.status,
            searchType: this.searchKeys.type,
            searchValue: this.searchKeys.value,
            startTradeTime: time.getDate(this.searchKeys.tradeTimeObj[0]),
            endTradeTime: time.getDate(this.searchKeys.tradeTimeObj[1])
					}
				})
			},
      onclick(item){
        this.searchKeys.status = item.id;
        this.updateUrl();
			},
      list(page) {
				this.loading = true;
      	if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri: 'tradeOrderRefund/list',
					data: {
						startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
						pageSize: this.tableData.pagination.size,
            storeId: this.searchKeys.storeId,
            cityId: this.searchKeys.cityId,
            refundMethod: this.searchKeys.refundMethod,
            status : this.searchKeys.status,
            agentPay : this.searchKeys.agentPay,
            searchType: this.searchKeys.type,
            searchValue: this.searchKeys.value,
            startTradeTime: time.getDate(this.searchKeys.tradeTimeObj[0]),
            endTradeTime: time.getDate(this.searchKeys.tradeTimeObj[1])
					}
				}).then((res) => {
          this.tableData.list = res.data.data.list || [];
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
				});
			},
			exportXls(){
				 var params = "storeId="+this.searchKeys.storeId ||'';
				 params += "&refundMethod="+(this.searchKeys.refundMethod ||'');
				 params += "&status="+(this.searchKeys.status ||'');
				 params += "&searchType="+(this.searchKeys.searchType ||'');
				 params += "&searchValue="+(this.searchKeys.searchValue ||'');
				 params += "&startTradeTime="+time.getDate(this.searchKeys.tradeTimeObj[0]);
				 params += "&endTradeTime="+time.getDate(this.searchKeys.tradeTimeObj[1]);
				 window.open(consts.BASE_URL +"/export/tradeOrder/refundList?" + params)
			}
		},
		watch:{
			'$route'(){
				this.initParams();
				this.list();
			}
		},
		created() {
      this.initParams();
      this.list();
		}
	}
</script>