<template>
	<div class="ukao-pt-md">
		<div>
			<div class="w pull-right m-l">
		  	<el-input placeholder="请输入内容" v-model="searchKeys.value">
			    <el-button slot="append" icon="el-icon-search" @click="updateUrl(1)"></el-button>
			  </el-input>
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
		  <div class="thumb-xl m-r m-b-sm">
		  	<el-select clearable v-model="searchKeys.payMethod" placeholder="支付方式">
			    <el-option
			      v-for="item in payMethods"
						:key="item.val"
						:label="item.text"
						:value="item.val">
			    </el-option>
			  </el-select>
		  </div>
		  <div class="dis-inline m-r m-b-sm">
		  	<el-select class="w-sm" clearable v-model="searchKeys.payScene" placeholder="充值渠道">
			    <el-option
			      v-for="item in payScenes"
						:key="item.val"
						:label="item.text"
						:value="item.val">
			    </el-option>
			  </el-select>
		  </div>
      <storeSelecte class="m-r" v-model="searchKeys.storeId"></storeSelecte>
      <citySelecte class="m-r" v-model="searchKeys.cityId"></citySelecte>
		  <div class="dis-inline m-r m-b-sm">
				代销：
        <el-select class="w-sm" clearable v-model="searchKeys.agentPay" placeholder="请选择">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
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
			<div class="dis-inline m-b-sm">
				<el-button type="primary" @click="updateUrl(1)">筛 选</el-button>
			</div>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table"
				v-loading="loading"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="充值时间">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.tradeTime | getDate}}</div>
		      	<div>{{ scope.row.tradeTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="充值渠道">
					<template slot-scope="scope">
						<div>{{scope.row.paySceneText}} <span class="text-muted" v-if="scope.row.cityName">({{scope.row.cityName}})</span></div>
						<div class="text-muted">
							{{scope.row.storeName}}
							<template v-if="origin.appAide == scope.row.payScene">{{scope.row.workName}}</template>
						</div>
					</template>
		    </el-table-column>
		    <el-table-column
		      label="支付方式|支付流水号">
		      <template slot-scope="scope">
						<div>{{ scope.row.payMethodText }}<span class="text-muted" v-if="scope.row.paySign">-{{scope.row.paySign}}</span><template v-if="scope.row.agentPay==1"> - 代销</template></div>
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
		      label="对方">
		      <template slot-scope="scope">
		      	<div>{{scope.row.userName}}</div>
		      	<div>{{scope.row.userPhone}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="支付金额（元）">
		      <template slot-scope="scope">
		      	<div class="text-success">{{ scope.row.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="手续费">
					<template slot-scope="scope">
						<div v-if="scope.row.fee" class="text-danger">-{{scope.row.fee | amtFormat}}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="赠送金额（元）">
		      <template slot-scope="scope">
		      	<div class="text-success">{{ scope.row.giftAmount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="充值后余额（元）">
		      <template slot-scope="scope">
		      	<div class="text-warning">{{ scope.row.balance | amtFormat}}</div>
		      </template>
		    </el-table-column>
				<el-table-column label="备注" width="80">
					<template slot-scope="scope">
						<el-button type="text" @click="getRemarkDetail(scope.row.remark)">详情</el-button>
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
		<div class="text-right m-t-sm">
			<div class="pull-left">
				<auth perm="finance.recharge.export">
					<el-button size="small" @click="exportXls">导出</el-button>
				</auth>
			</div>
	  	<el-pagination
	      :page-size="tableData.pagination.size"
	      layout="total, prev, pager, next"
				:current-page.sync="tableData.pagination.page"
	      :total="tableData.pagination.total"
				@current-change="handleCurrentChange">
	    </el-pagination>
	  </div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import bizconsts from "@/utils/bizconsts";
import time from "@/utils/helpers/timeLite";
import keyval from "@/utils/dickeyval";
import citySelecte from "@/components/DropDownList/city";
import storeSelecte from "@/components/DropDownList/store";
export default {
  data: function() {
    return {
      origin: {
        wx: bizconsts.COMMON.ORIGIN_WX,
        cashier: bizconsts.COMMON.ORIGIN_CASHIER,
        appAide: bizconsts.COMMON.ORIGIN_APP_AIDE
      },
      storeList: [],
      loading: false,
      searchKeys: {
        value: "",
        storeId: "",
        cityId: "",
        payMethod: "",
        payScene: "",
        agentPay: "",
        createBy:'',
        tradeTimeObj: [new Date() - 3600 * 1000 * 24 * 30, new Date()]
      },
      payMethods: keyval["RECHARGE_PAY_METHOD"],
      payScenes: keyval["RECHARGE_PAY_SCENE"],
      createTimeOptions: {
        shortcuts: [
          {
            text: "近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      workList: [],
      tableData: {
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          page: 1,
          total: 0
        }
      }
    };
  },
  watch: {
    $route() {
      this.initParams();
      this.list();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    // 初始化参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.searchKeys.storeId = parseInt(data.storeId) || "";
        this.searchKeys.cityId = parseInt(data.cityId) || "";
        this.searchKeys.payMethod = data.payMethod || "";
        this.searchKeys.payScene = data.payScene || "";
        this.searchKeys.value = data.searchValue || "";
        this.searchKeys.agentPay = data.agentPay || "";
        this.searchKeys.createBy = data.createBy?parseInt(data.createBy):data.createBy;
        this.searchKeys.tradeTimeObj = [data.startTradeTime, data.endTradeTime];
        this.tableData.pagination.page = parseInt(data.page || 1);
      }
    },
    queryWorkList() {
      this.$store.dispatch('post',{
        uri:'workerInfo/work/list',
      }).then(res=>{
        this.workList=res.data.data.list;
      })
    },
    // 更新url
    updateUrl(page = 1) {
      if (!this.searchKeys.tradeTimeObj) this.searchKeys.tradeTimeObj = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: page,
          storeId: this.searchKeys.storeId,
          cityId: this.searchKeys.cityId,
          payMethod: this.searchKeys.payMethod,
          payScene: this.searchKeys.payScene,
          searchValue: this.searchKeys.value,
          agentPay: this.searchKeys.agentPay,
          createBy: this.searchKeys.createBy,
          startTradeTime: time.getDate(this.searchKeys.tradeTimeObj[0]),
          endTradeTime: time.getDate(this.searchKeys.tradeTimeObj[1])
        }
      });
    },
    handleCurrentChange(val) {
      this.updateUrl(val);
    },
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "userRecharge/list",
          data: {
            startRow:
              (this.tableData.pagination.page - 1) *
              this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            storeId: this.searchKeys.storeId,
            cityId: this.searchKeys.cityId,
            payMethod: this.searchKeys.payMethod,
            payScene: this.searchKeys.payScene,
            searchValue: this.searchKeys.value,
            createBy: this.searchKeys.createBy,
            status: 1,
            agentPay: this.searchKeys.agentPay,
            startTradeTime: time.getDate(this.searchKeys.tradeTimeObj[0]) || "",
            endTradeTime: time.getDate(this.searchKeys.tradeTimeObj[1]) || ""
          }
        })
        .then(res => {
          this.tableData.list = res.data.data.list || [];
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    exportXls() {
      var params = "storeId=" + this.searchKeys.storeId || "";
      params += "&payMethod=" + (this.searchKeys.payMethod || "");
      params += "&payScene=" + (this.searchKeys.payScene || "");
      params += "&status=1";
      params += "&createBy="+(this.searchKeys.createBy ||'');
      params += "&agentPay=" + (this.searchKeys.agentPay || "");
      params += "&searchValue=" + (this.searchKeys.value || "");
      params +=
        "&startTradeTime=" + time.getDate(this.searchKeys.tradeTimeObj[0]);
      params +=
        "&endTradeTime=" + time.getDate(this.searchKeys.tradeTimeObj[1]);
      window.open(consts.BASE_URL + "/export/userRecharge/list?" + params);
    },
    getRemarkDetail(data) {
      data = data || "无";
      const h = this.$createElement;
      this.$msgbox({
        title: "查看详情",
        message: h("div", null, [
          h("p", { class: "text-muted pull-left" }, "备注："),
          h("p", { style: "margin-left: 60px;" }, data)
        ]),
        confirmButtonText: "关闭"
      });
    }
  },
  created() {
    this.initParams();
    this.list();
    this.queryWorkList();
  },
  components: {
    citySelecte,
    storeSelecte
  }
};
</script>