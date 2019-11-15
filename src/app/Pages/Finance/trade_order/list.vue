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
        <el-select multiple collapse-tags v-model="searchKeys.payMethod" placeholder="支付方式">
					<el-option
						v-for="item in payMethods"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
			</div>
			<div class="dis-inline m-r m-b-sm">
				<el-select class="thumb-xl" remove-tag="clear" clearable v-model="searchKeys.paymentPartner" placeholder="支付合作方">
					<el-option
						v-for="item in paymentPartners"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
			</div>
			<storeSelect class="m-r" v-model="searchKeys.storeId"></storeSelect>
			<citySelect class="m-r" v-model="searchKeys.cityId"></citySelect>
			<div class="dis-inline m-r m-b-sm">
				代销：
        <el-select class="w-sm" clearable v-model="searchKeys.agentPay" placeholder="请选择">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</div>
			<div class="dis-inline m-r m-b-sm">
				下单渠道：
        <el-select class="w-sm" multiple collapse-tags v-model="searchKeys.orderOrigin" placeholder="请选择">
					<el-option
						v-for="item in origins"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
			</div>
			<div class="dis-inline m-r m-b-sm">
				订单类型：
        <el-select class="w-sm" clearable v-model="searchKeys.orderType" placeholder="请选择">
					<el-option
						v-for="item in orderTypes"
						:key="item.val"
						:label="item.text"
						:value="item.val">
					</el-option>
				</el-select>
			</div>
			<div class="dis-inline m-r m-b-sm">
				操作人：
        <el-select class="w-sm" clearable filterable v-model="searchKeys.createBy" placeholder="请选择">
					<el-option
						v-for="item in workList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</div>

			<div class="dis-inline m-r m-b-sm">
				分组：
				<el-select class="w-sm" clearable filterable v-model="searchKeys.groupId" placeholder="请选择">
					<el-option
						v-for="item in groupList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</div>

			<div class="dis-inline m-b-sm">
				<el-button type="primary" @click="updateUrl(1)">查询</el-button>
			</div>
		</div>
		<div class="m-t-lg">
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" :status = "searchKeys.status" :onClick="onclick"></v-tab-nav>
			<el-table class="ukao-el-table m-t ukao-v-loading"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="日期">
		      <template slot-scope="scope">
		        <div>{{ scope.row.tradeTime | getDate }}</div>
		        <div>{{ scope.row.tradeTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="下单渠道">
					<template slot-scope="scope">
						<div>{{scope.row.orderOriginText}} <span class="text-muted" v-if="scope.row.cityName">({{scope.row.cityName}})</span></div>
						<div class="text-muted">
							{{scope.row.storeName}}
							<template v-if="origin.appAide == scope.row.orderOrigin">{{scope.row.workName}}</template>
						</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="订单号|支付流水号">
		      <template slot-scope="scope">
						<div class="text-primary" v-if="scope.row.orderId">
							<router-link target="_blank" :to="(scope.row.orderType == 2?'/shops/order/detail/':'/order/list/detail/') + scope.row.orderId">{{ scope.row.orderNo }}</router-link>
							<span class="text-muted">{{scope.row.orderType | getValText('ORDER_TYPE')}}</span>
						</div>
						<div  v-if="!scope.row.orderId" >
							{{ scope.row.orderNo }}
							<span class="text-muted">{{scope.row.orderType | getValText('ORDER_TYPE')}}</span>
						</div>
						<template v-if="scope.row.outSeq || scope.row.partnerSeq">
							<el-popover
								placement="bottom-start"
								width="330"
								trigger="hover">
								<div>
									<p v-if="scope.row.outSeq">外部流水号：{{scope.row.outSeq}}</p>
									<p v-if="scope.row.partnerSeq">合作方流水号：{{scope.row.partnerSeq}}</p>
								</div>
								<div slot="reference">
									<span>{{ scope.row.seq }}</span>
								</div>
							</el-popover>
						</template>
						<template v-else>
							<div>{{ scope.row.seq }}</div>
						</template>
		      </template>
		    </el-table-column>
				<el-table-column
					label="取送员">
					<template slot-scope="scope">
						<div v-if="scope.row.takeWorkId">
							取：
							<router-link target="_blank" 
													 :to="'/worker/detail/' + scope.row.takeWorkId" 
													 class="text-primary">{{ scope.row.takeWorkName }}</router-link>
						</div>
						<div v-if="scope.row.sendWorkId">
							送：
							<router-link target="_blank" 
													 :to="'/worker/detail/' + scope.row.sendWorkId" 
													 class="text-primary">{{ scope.row.sendWorkName }}</router-link>
						</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="客户">
		      <template slot-scope="scope">
		        <div>{{ scope.row.userName }}</div>
		        <div>{{ scope.row.userPhone }}</div>
		        <div>{{ scope.row.rfidNo }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="金额|明细">
		      <template slot-scope="scope">
		        <div class="text-success">{{ scope.row.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="支付方式">
					<template slot-scope="scope">
						<div>{{ scope.row.payMethodText }}<span v-if="scope.row.agentPay==1">-代销</span></div>
						<div class="text-muted">{{ scope.row.paySign }}</div>
						<div class="text-muted" v-if="scope.row.paymentPartner != 'Native'">{{ scope.row.paymentPartner | getValText('PAYMENT_PARTNER')}}</div>
					</template>
		    </el-table-column>
				<el-table-column
					label="手续费">
					<template slot-scope="scope">
						<div class="text-danger" v-if="scope.row.fee">-{{ scope.row.fee | amtFormat}}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="备注">
					<template slot-scope="scope">
						<div>{{scope.row.remark}}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
		        <div :class="scope.row.status==-1?'text-muted':''">{{ scope.row.statusText}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="操作人">
					<template slot-scope="scope">
						<div>{{ scope.row.workName}}</div>
					</template>
				</el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
			<div class="pull-left">
				<auth perm="finance.trade.list.export">
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
  import base from '@/utils/helpers/base'
  import bizconsts from '@/utils/bizconsts'
  import time from '@/utils/helpers/timeLite'
	import vTabNav from '../../Common/tab_nav.vue'
	import keyval from '@/utils/dickeyval'
	import citySelect from '@/components/DropDownList/citys'
	import storeSelect from '@/components/DropDownList/stores'

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
          storeId:[],
          cityId:[],
          seq:'',
          outSeq:'',
          partnerSeq:'',
          value:'',
          orderOrigin: [],
          orderType: '',
          payMethod:[],
          status:'',
          agentPay:'',
          createBy:'',
          groupId:'',
          tradeTimeObj:[new Date() - 3600 * 1000 * 24 * 30, new Date()],
          paymentPartner:''
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
            label: '支付流水号'
          },
					{
            value: '3',
            label: '客户'
          },
          {
            value: '4',
            label: '取件员'
          },
          {
            value: '5',
            label: '送件员'
          },
          {
            value: '6',
            label: '外部流水号'
          },
          {
            value: '7',
            label: '合作方流水号'
          }
        ],
        workList: [],
        groupList: [],
        payMethods: keyval['TRADE_PAY_METHOD'],
        paymentPartners: keyval['PAYMENT_PARTNER'],
        origins: keyval['TRADE_ORIGIN'],
        orderTypes: keyval['ORDER_TYPE'],
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
          this.searchKeys.storeId = base.formatArr(data.storeId,this.searchKeys.storeId,1) || [];
          this.searchKeys.cityId = base.formatArr(data.cityId,this.searchKeys.cityId,1)|| [];
					this.searchKeys.type = data.searchType; //搜索方式，订单号还是支付流水号
					this.searchKeys.value = data.searchValue; //搜索内容
					this.searchKeys.tradeTimeObj = [data.startTradeTime,data.endTradeTime]; //时间
					this.searchKeys.status = data.status; //订单状态
          this.searchKeys.payMethod = base.formatArr(data.payMethod,this.searchKeys.payMethod) || []; //支付方式
          this.searchKeys.orderOrigin = base.formatArr(data.orderOrigin,this.searchKeys.orderOrigin) || []; //下单渠道
					this.searchKeys.orderType = data.orderType; //下单渠道
					this.searchKeys.agentPay = data.agentPay; //是否代付
          this.searchKeys.orderNo = data.orderNo;
          this.searchKeys.createBy = data.createBy?parseInt(data.createBy):data.createBy;
          this.searchKeys.groupId = data.groupId?parseInt(data.groupId):data.groupId;
					this.searchKeys.seq = data.seq;
					this.searchKeys.outSeq = data.outSeq;
					this.searchKeys.partnerSeq = data.partnerSeq;
					this.searchKeys.userKeywords = data.userKeywords;
					this.searchKeys.takeWorkKeywords = data.takeWorkKeywords;
					this.searchKeys.sendWorkKeywords = data.sendWorkKeywords;
					this.searchKeys.paymentPartner = data.paymentPartner;
					this.tableData.pagination.page = parseInt(data.page || 1);
				}
			},
			// 更新url
			updateUrl(page = 1){
				if(!this.searchKeys.tradeTimeObj) this.searchKeys.tradeTimeObj = [];
        this.searchInput(this.searchKeys.type);
				this.$router.push({
					path: this.$route.path,
					query:{
						page: page,
            storeId: this.searchKeys.storeId,
            cityId: this.searchKeys.cityId,
            payMethod: this.searchKeys.payMethod,
            agentPay: this.searchKeys.agentPay,
            orderOrigin: this.searchKeys.orderOrigin,
            orderType: this.searchKeys.orderType,
            status : this.searchKeys.status,
            searchType: this.searchKeys.type,
            searchValue: this.searchKeys.value,
            orderNo: this.searchKeys.orderNo,
            seq: this.searchKeys.seq,
            outSeq: this.searchKeys.outSeq,
            partnerSeq: this.searchKeys.partnerSeq,
            createBy: this.searchKeys.createBy,
            groupId: this.searchKeys.groupId,
            userKeywords: this.searchKeys.userKeywords,
            takeWorkKeywords: this.searchKeys.takeWorkKeywords,
            sendWorkKeywords: this.searchKeys.sendWorkKeywords,
            paymentPartner: this.searchKeys.paymentPartner,
            startTradeTime: time.getDate(this.searchKeys.tradeTimeObj[0]),
            endTradeTime: time.getDate(this.searchKeys.tradeTimeObj[1])
					}
				})
			},
      searchInput(val){
        let txt = this.searchKeys.value;
        this.searchKeys.orderNo = '';
        this.searchKeys.seq = '';
        this.searchKeys.outSeq = '';
        this.searchKeys.partnerSeq = '';
        this.searchKeys.userKeywords = '';
        this.searchKeys.takeWorkKeywords = '';
        this.searchKeys.sendWorkKeywords = '';
        switch (val){
          case '1' :
            this.searchKeys.orderNo = txt;
            break;
          case '2':
            this.searchKeys.seq = txt;
            break;
          case '3':
            this.searchKeys.userKeywords = txt;
            break;
          case '4':
            this.searchKeys.takeWorkKeywords = txt;
            break;
          case '5':
            this.searchKeys.sendWorkKeywords = txt;
            break;
          case '6':
            this.searchKeys.outSeq = txt;
            break;
          case '7':
            this.searchKeys.partnerSeq = txt;
            break;
          default:
            break
        }
      },
      onclick(item){
        this.searchKeys.status = item.id;
        this.updateUrl();
			},
      queryWorkList() {
        this.$store.dispatch('post',{
          uri:'workerInfo/work/list',
        }).then(res=>{
          this.workList=res.data.data.list;
        })
			},
      queryGroupList(){
        this.$store.dispatch('post',{
          uri:'userGroup/list',
        }).then(res=>{
          this.groupList = res.data.data.list;
        })
			},

      list(page) {
				this.loading = true;
      	if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri: 'tradeOrder/list',
					data: {
						startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
						pageSize: this.tableData.pagination.size,
            storeId: this.searchKeys.storeId.length <= 1 ?  this.searchKeys.storeId : undefined ,
            storeIds: this.searchKeys.storeId.length > 1 ? this.searchKeys.storeId : undefined,
            /*cityId: this.searchKeys.cityId.length <= 1 ?  this.searchKeys.cityId : undefined ,
            cityIds: this.searchKeys.cityId.length > 1 ? this.searchKeys.cityId : undefined,*/
            payMethod: this.searchKeys.payMethod.length <= 1 ?  this.searchKeys.payMethod : undefined ,
            payMethods: this.searchKeys.payMethod.length > 1 ? this.searchKeys.payMethod : undefined,
            orderOrigin: this.searchKeys.orderOrigin.length <= 1 ?  this.searchKeys.orderOrigin : undefined ,
            orderOrigins: this.searchKeys.orderOrigin.length > 1 ? this.searchKeys.orderOrigin : undefined,
            orderType: this.searchKeys.orderType,
            status : this.searchKeys.status,
            agentPay : this.searchKeys.agentPay,
            orderNo: this.searchKeys.orderNo,
            seq: this.searchKeys.seq,
            outSeq: this.searchKeys.outSeq,
            partnerSeq: this.searchKeys.partnerSeq,
            createBy: this.searchKeys.createBy,
            groupId: this.searchKeys.groupId,
            userKeywords: this.searchKeys.userKeywords,
            takeWorkKeywords: this.searchKeys.takeWorkKeywords,
            sendWorkKeywords: this.searchKeys.sendWorkKeywords,
            paymentPartner: this.searchKeys.paymentPartner,
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
				 var params = this.searchKeys.storeId.length <= 1 ?  "storeId="+(this.searchKeys.storeId || '') : '' ;
				 this.searchKeys.storeId.length > 1 ?  params += "&storeIds="+(this.searchKeys.storeId || '') : '';
				 this.searchKeys.payMethod.length <= 1 ? params += "&payMethod="+(this.searchKeys.payMethod || '') : '';
				 this.searchKeys.payMethod.length > 1 ?  params += "&payMethods="+(this.searchKeys.payMethod || ''): '';
				 params += "&orderType="+(this.searchKeys.orderType ||'');
				 this.searchKeys.orderOrigin.length == 1 ?  params += "&orderOrigin="+(this.searchKeys.orderOrigin || '') : '';
				 this.searchKeys.orderOrigin.length > 1 ?  params += "&orderOrigins="+(this.searchKeys.orderOrigin || '') : '';
				 params += "&status="+(this.searchKeys.status ||'');
				 params += "&agentPay="+(this.searchKeys.agentPay ||'');
				 params += "&searchType="+(this.searchKeys.searchType ||'');
				 params += "&searchValue="+(this.searchKeys.searchValue ||'');
         params += "&orderNo="+(this.searchKeys.orderNo ||'');
         params += "&seq="+(this.searchKeys.seq ||'');
         params += "&outSeq="+(this.searchKeys.outSeq ||'');
         params += "&partnerSeq="+(this.searchKeys.partnerSeq ||'');
         params += "&userKeywords="+(this.searchKeys.userKeywords ||'');
         params += "&takeWorkKeywords="+(this.searchKeys.takeWorkKeywords ||'');
         params += "&sendWorkKeywords="+(this.searchKeys.sendWorkKeywords ||'');
				 params += "&createBy="+(this.searchKeys.createBy ||'');
				 params += "&groupId="+(this.searchKeys.groupId ||'');
				 params += "&startTradeTime="+time.getDate(this.searchKeys.tradeTimeObj[0]);
				 params += "&endTradeTime="+time.getDate(this.searchKeys.tradeTimeObj[1]);
				 window.open(consts.BASE_URL +"/export/tradeOrder/list?" + params)
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
      this.queryWorkList();
      this.queryGroupList();
		}
	}
</script>