<template>
	<div>
		<div>
			<div class="dis-inline m-r m-b-sm">
				起止日期：
		    <el-date-picker
		      v-model="searchKeys.timeObj"
		      type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:picker-options="timeOptions">
		    </el-date-picker>
			</div>
			<div class="dis-inline m-r m-b-sm">
		  	类型：
		  	<el-select clearable v-model="searchKeys.tradeType" placeholder="请选择">
			    <el-option
			      v-for="item in tradeTypes"
			      :key="item.val"
			      :label="item.text"
			      :value="item.val">
			    </el-option>
			  </el-select>
		  </div>
			<div class="dis-inline m-r m-b-sm">
				<el-input v-model="searchKeys.value" prefix-icon="el-icon-search" placeholder="关键字"></el-input>
			</div>
			<div class="dis-inline m-b-sm"><el-button type="primary" @click="updateUrl(1)">查询</el-button></div>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table ukao-v-loading"
		    :data="tableData.list"
				v-loading="loading"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="时间">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.createTime | getDate}}</div>
		      	<div>{{ scope.row.createTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="类型|名称|收支流水号">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.tradeTypeText }} {{scope.row.remark}}</div>
		      	<div>{{ scope.row.seq }}</div>
		      </template>
		    </el-table-column>
				<el-table-column label="交易金额">
					<template slot-scope="scope">
						{{scope.row.tradeAmt | amtFormat}}
					</template>
				</el-table-column>
				<el-table-column label="手续费">
					<template slot-scope="scope">
						{{scope.row.fee | amtFormat}}
					</template>
				</el-table-column>
		    <el-table-column
		      label="金额|明细">
		      <template slot-scope="scope">
		      	<div v-if="parseInt(scope.row.amount)>0" class="text-success">+{{scope.row.amount | amtFormat}}</div>
		      	<div v-else class="text-danger">{{scope.row.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="balance"
		      label="余额(元)">
					<template slot-scope="scope">
						{{scope.row.balance | amtFormat}}
					</template>
		    </el-table-column>
		    <el-table-column
		      label="支付渠道|流水号">
		      <template slot-scope="scope">
		      	<div>{{scope.row.paySceneText}}</div>
		      	<div>{{scope.row.tradeSeq}}</div>
		      </template>
		    </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <router-link target="_blank" :to="(scope.row.orderType == 2?'/shops/order/detail/':'/order/list/detail/') + scope.row.orderId" class="text-primary">{{scope.row.orderNo}}</router-link>
          </template>
        </el-table-column>
		    <!--<el-table-column-->
		      <!--label="操作">-->
		      <!--<template slot-scope="scope">-->
            <!--<template v-if="scope.row.orderId">-->
              <!--<router-link target="_blank" :to="(scope.row.orderType == 2?'/shops/order/detail/':'/order/list/detail/') + scope.row.orderId" class="text-primary">详情</router-link>-->
            <!--</template>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
		  </el-table>
		</div>
		<div class="text-right m-t-sm clearfix">
			<div class="pull-left">
				<auth perm="finance.check.list.export">
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
  import time from '@/utils/helpers/timeLite'
  import keyval from '@/utils/dickeyval'

	export default {
		data: function() {
			return {
        loading : false,
        searchKeys: {
          type:'',
          value:'',
          tradeType: '',
          timeObj:[new Date() - 3600 * 1000 * 24 * 30, new Date()]
        },
        tradeTypes: keyval['CHECK_TRADE_TYPE'],
        tableData: {
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0,
            page:1,
          }
        },
        timeOptions: {
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
        }
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
          this.searchKeys.value = data.searchValue; //搜索内容
          this.searchKeys.timeObj = [data.startTime,data.endTime]; //时间
          this.searchKeys.tradeType = data.tradeType;
          this.tableData.pagination.page = parseInt(data.page || 1);
        }
      },
      // 更新url
      updateUrl(page = 1){
        if(!this.searchKeys.timeObj) this.searchKeys.timeObj = [];
        this.$router.push({
          path: this.$route.path,
          query:{
            page: page,
            tradeType: this.searchKeys.tradeType,
            searchValue: this.searchKeys.value,
            startTime: time.getDate(this.searchKeys.timeObj[0]),
            endTime: time.getDate(this.searchKeys.timeObj[1])
          }
        })
      },
      list(page) {
        this.loading = true;
        if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri: 'tradeBill/list',
          data: {
            startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            tradeType: this.searchKeys.tradeType,
            searchValue: this.searchKeys.value,
            startCreateTime: time.getDate(this.searchKeys.timeObj[0]),
            endCreateTime: time.getDate(this.searchKeys.timeObj[1])
          }
        }).then((res) => {
          this.tableData.list = res.data.data.list || [];
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
      },
      exportXls(){
        var params = "tradeType="+(this.searchKeys.tradeType ||'');
        params += "&searchValue="+(this.searchKeys.searchValue ||'');
        params += "&startCreateTime="+time.getDate(this.searchKeys.timeObj[0]);
        params += "&endCreateTime="+time.getDate(this.searchKeys.timeObj[1]);
        window.open(consts.BASE_URL +"/export/tradeBill/list?" + params)
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