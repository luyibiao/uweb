<template>
	<div>
		<ul class="uk-search">
			<li class="uk-search-item">
				<el-select class="uk-search-label w-sm"
				           v-model="tableData.searchInputType"
				           placeholder="请选择">
					<el-option v-for="item in searchOptions"
					           :key="item.index"
					           :label="item.text"
					           :value="item.val">
					</el-option>
				</el-select>
				<el-input class="uk-search-content w-sm"
									prefix-icon="el-icon-search"
				          v-model="tableData.searchInput"
				          placeholder="请输入内容"></el-input>
			</li>
			<li class="uk-search-item">
				<storeSelect v-model="tableData.storeId"></storeSelect>
			</li>
			<li class="uk-search-item">
				<citySelect v-model="tableData.cityId"></citySelect>
			</li>

			<li class="uk-search-item">
				<span class="m-r-sm">取件状态：</span>
				<el-select class="w-sm"
									 v-model="tableData.isTake"
									 filterable
									 clearable
									 placeholder="全部">
					<el-option value="0" label="未取件"></el-option>
					<el-option value="1" label="已取件"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="m-r-sm">快递状态：</span>
				<el-select class="w-sm"
									 v-model="tableData.expressStatus"
									 filterable
									 clearable
									 placeholder="全部">
					<el-option value="-1" label="派单失败"></el-option>
					<el-option value="1" label="下单"></el-option>
					<el-option value="3" label="已接单(未取件)"></el-option>
					<el-option value="5" label="已取件"></el-option>
					<el-option value="7" label="送件中"></el-option>
					<el-option value="9" label="已签收"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="m-r-sm">签收状态：</span>
				<el-select class="w-sm"
									 v-model="tableData.isSign"
									 filterable
									 clearable
									 placeholder="全部">
					<el-option value="0" label="未签收"></el-option>
					<el-option value="1" label="已签收"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">取送服务商：</span>
				<el-select class="w-sm" 
									 filterable placeholder="全部"
				           clearable v-model="tableData.type">
									 <el-option v-for="item in expressOptions"
										 :key="item.val"
										 :label="item.text"
										 :value="item.val">
									 </el-option>
				</el-select>
			</li>
			<!--<el-checkbox v-show="(tableData.expressStatus == 1 || tableData.expressStatus == 3) && tableData.isTake == 0" v-model="tableData.overTime">是否超时</el-checkbox>-->
			<li class="uk-search-item">
				<span>创建日期：</span>
				<el-date-picker v-model="tableData.createDateObj"
				                type="daterange"
				                align="right"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
				                :picker-options="pickerOptions0">
				</el-date-picker>
			</li>
			<li class="uk-search-item">
				<el-button type="primary"
				           @click="updateUrl(1)">筛选</el-button>
			</li>
		</ul>
		<div class="m-t-xl"
		     v-loading="loading">
			<table class="ukao-order-table w-full">
				<thead>
					<tr>
						<th>客户</th>
						<th>创建时间</th>
						<th>取送服务商</th>
						<th>指派取件时间</th>
						<td><template v-if="expressTab == 1">客户预约</template><template v-else>送件</template>时间</td>
						<th>寄件地址</th>
						<th>收件地址</th>
						<th>所属门店 | 工厂</th>
						<th>运费</th>
						<th>操作人</th>
					</tr>
				</thead>
				<tr class="tr-content"
				    v-if="!tableData.list || tableData.list.length == 0">
					<td colspan="20"
					    style="text-align: center">暂无数据</td>
				</tr>

				<tbody v-for="item in tableData.list"
				       :key="item.id">
					<tr>
						<td colspan="11"></td>
					</tr>
					<tr class="tr-th">
						<td colspan="13">
							<p class="dis-inline w m-r text-black">{{item.originText}} - {{item.takeModeText}}</p>
							<p class="dis-inline m-r-xl">
								<span class="text-muted">订单号：</span>
								<router-link :to="'/order/list/detail/'+item.orderId"
														 class="text-primary">{{item.orderNo}}</router-link>
							</p>
							<p class="dis-inline m-r-xl">包裹件数：{{item.parcelCnt || 0}} <!--<template v-if="item.businessStr">({{item.businessStr}})</template>--></p>
							<p v-if="item.weight" class="dis-inline m-r-xl">计费重量：{{item.weight | kgFormat}}kg</p>
							<p v-if="item.expressStatus == -1" class="text-danger dis-inline m-r-xl">派单失败（{{item.failRemark}}）</p>
							<!--<p class="dis-inline" v-if="item.unionId"><span class="group-ico">团</span>{{item.unionName}}</p>-->
						</td>
					</tr>
					<tr class="tr-content">
						<td>
							<div>
								<p>{{item.userName || item.userRemark}}</p>
								<p>
									<a target="_blank"
									   :href="'/client/list/'+item.userId+'/basic'"
									   class="text-primary">{{item.userPhone || ''}}</a>
								</p>
								<p>
									<a target="_blank"
										 :href="'/client/list/'+item.userId+'/basic'"
										 class="text-primary">{{item.cardNo || ''}}</a>
								</p>
							</div>
						</td>
						<td>
							<div> {{item.createTime | getDate}}</div>
							<div> {{item.createTime | getTime}}</div>
						</td>
						<td>
							<p>{{item.type | getValText('EXPRESS_TYPE')}}：{{item.expressNo}}</p>
						</td>
						<td>
							<p>{{item.bookTime | getDate}}</p>
							<p>{{item.bookTime | getTime}}</p>
						</td>
						<td>
							<div v-if="expressTab == 1">
								<p>{{item.takeDate}}</p>
								<p>{{item.takeTimeStart}}-{{item.takeTimeEnd}}</p>
							</div>
							<div v-else>
								<p>{{item.sendDate}}</p>
								<p>{{item.sendTimeStart}}-{{item.sendTimeEnd}}</p>
							</div>
						</td>
						<td>
							<div style="padding: 3px;">
								<p>{{(item.fromPhone ||'')}} &nbsp; {{(item.fromName || '')}}</p>
								<p>{{(item.fromAddr || '')}}</p>
								<p v-if="item.isTake" class="text-success">已取件：{{item.takeTime | getDate}} {{item.takeTime | getTime}}</p>
								<p v-if="item.takeWorkPhone">取件员：{{item.takeWorkPhone}} {{item.takeWorkName ||''}}</p>
							</div>
						</td>
						<td>
							<div style="padding: 3px;">
								<p>{{(item.toPhone ||'')}} &nbsp; {{(item.toName || '')}}</p>
								<p>{{(item.toAddr || '')}}</p>
								<p v-if="item.isSign" class="text-success">已签收：{{item.signTime | getDate}} {{item.signTime | getTime}}</p>
								<p v-if="item.sendWorkPhone">送件员：{{item.sendWorkPhone}} {{item.sendWorkName ||''}}</p>
							</div>
						</td>
						<td>
							<div>
								<a target="_blank"
								   :href="'/store/info/'+item.storeId"
								   class="text-primary">{{item.storeName || item.factoryName || ''}}</a>
							</div>
							<div></div>
						</td>
						<td>
							{{item.amount | amtFormat}}
						</td>
						<td>
							{{item.createName}}
						</td>
					</tr>
					<tr class="tr-tip"
					    v-show="item.userRemark || item.remark">
						<td colspan="12">
							<span class="text-danger light"
							   v-if="item.remark" style="font-size:10px;">备注：{{item.remark || '-'}}</span>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="text-right m-t-sm">
				<div class="pull-left">
					<auth perm="order.list.export">
						<el-button size="small" @click="exportData">导出</el-button>
					</auth>
				</div>
				<el-pagination :page-size="tableData.pagination.size"
				               layout="total, prev, pager, next"
				               :total="tableData.pagination.total"
				               :current-page.sync="tableData.pagination.page"
				               @current-change="handleCurrentChange">
				</el-pagination>
			</div>
		</div>

		<!-- 管理备注-->
		<el-dialog class="ukao-dialog"
		           title="备注"
		           :visible.sync="remarkDialog.visible"
		           size="small">
			<div>
				<el-form :model="remarkDialog.ruleForm"
				         ref="remarkDialog.ruleForm"
				         label-width="160px">

					<el-form-item label="用户:">
						<div>
							<p v-if="remarkDialog.ruleForm.userRemark"
							   class="w-lg text-warning ">{{remarkDialog.ruleForm.userRemark || '未备注'}}</p>
							<p v-else
							   class="text-muted">未备注</p>
						</div>
					</el-form-item>

					<el-form-item label="管理"
					              prop="remark"
					              :rules="[
							{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input type="textarea"
							          :autosize="{ minRows: 4, maxRows: 6}"
							          v-model="remarkDialog.ruleForm.remark"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="remarkDialog.visible=false">取消</el-button>
						<el-button type="primary"
						           @click="mercRemarkSave('remarkDialog.ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end管理备注-->

	</div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import orderConfig from "@/models/order/config";
import storeSelect from "@/components/DropDownList/store";
import citySelect from "@/components/DropDownList/city";
import keyval from '@/utils/dickeyval';
export default {
  props: ["expressTab"],
  data: function() {
    return {
      loading: true,
      page: 1,
      tableData: {
        keywords: "",
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0,
          page: 1
        },
        type: "",
        origin: "",
        mode: '',
        isTake:'',
        expressStatus:'',
        overTime:'',
        isSign:'',
        payStatus: "",
        orderStatus: "",
        searchInputType: "",
        searchInput: "",
				searchValue:'',
				unionId:'',//团体ID
				userUnionId:'',//用户团体id
        expressNo:'',
        orderNo: "",
        phone: "",
        cardNo: "",
        storeId: "",
        cityId: "",
        noAssignTakeWork: false,
        searchDateType: "1",
        orderCreateTimeObj: "",
				createDateObj:[new Date() - 3600 * 1000 * 24 * 30, new Date()],//预约日期
      },
			unionList:[],//团体列表

			orderInfo:{
        id:'',
				storeId:'',
				sendWorkId:'',
				takeWorkId:'',
			},
      remarkDialog: {
        visible: false,
        ruleForm: {
          id: "",
          userRemark: "",
          remark: ""
        }
      },
      searchOptions: [
				{ val: "", text: "全部" },
        { val: "1", text: "物流单号" },
        { val: "2", text: "订单编号" },
        { val: "3", text: "客户电话" },
        { val: "4", text: "会员卡号" }
      ],
      pickerOptions0: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const date = new Date();
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      payStatusOptions: [],
      orderStatusOptions: [],
			expressOptions:keyval['EXPRESS_TYPE']
    };
  },
  created() {
    this.tableData.mode = this.expressTab ? this.expressTab : "";
    this.initParams();
    this.list();
		this.queryUnionList();
    this.payStatusOptions = orderConfig.orderPayStatusList() || [];
    this.orderStatusOptions = orderConfig.orderStatusList() || [];
  },
  watch: {
    $route() {
      this.initParams();
      this.list();
    }
  },
  methods: {
		queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        }).then(res => {
          this.unionList = res.data.data || [];
        });
    },
    updateUrl(page = 1) {
			if (!this.tableData.orderCreateTimeObj) this.tableData.orderCreateTimeObj = [];
			if (!this.tableData.createDateObj) this.tableData.createDateObj = [];
      this.searchInput(this.tableData.searchInputType);
      this.$router.push({
        path: this.$route.path,
        query: {
          page: page,
          searchType: this.tableData.searchInputType, //查询方式 订单号，电话，会员卡号
					searchValue:this.tableData.searchValue,
          expressNo: this.tableData.expressNo, // 物流单号
          orderNo: this.tableData.orderNo, //订单编号
          phone: this.tableData.phone, //查询的电话
          cardNo: this.tableData.cardNo, //会员卡号
          startCreateTime:time.getDate(this.tableData.createDateObj[0]), //派件时间
          endCreateTime:time.getDate(this.tableData.createDateObj[1]), //派件时间
          isTake: this.tableData.isTake, // 取件状态
          expressStatus: this.tableData.expressStatus, //快递状态
          overTime: this.tableData.overTime, //是否超时
          isSign: this.tableData.isSign, // 签收状态
          type: this.tableData.type, // 取送服务商(物流公司)类型
					unionId:this.tableData.unionId,//团体客户
					userUnionId:this.tableData.unionId,
					takeDate:'',//取件时间
          origin: this.tableData.origin,
          storeId: this.tableData.storeId,
          cityId: this.tableData.cityId
        }
      });
    },
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(this.$route.query) !== "{}") {
        this.tableData.pagination.page = parseInt(data.page || 1);
        this.page = parseInt(data.page || 1);
        this.tableData.searchInputType = data.searchType || "";
				this.tableData.searchValue=data.searchValue || "";
        this.tableData.expressNo = data.expressNo || "";
        this.tableData.orderNo = data.orderNo || "";
        this.tableData.phone = data.phone || "";
        this.tableData.cardNo = data.cardNo || "";
				this.tableData.unionId=data.unionId || "";
				this.tableData.userUnionId=data.unionId || "";
				this.tableData.type=data.type || "";
        this.tableData.isTake = isNaN(data.isTake) ? "" : data.isTake.toString();
        this.tableData.expressStatus = isNaN(data.expressStatus) ? "" : data.expressStatus.toString();
        this.tableData.overTime = data.overTime &&(this.tableData.expressStatus == 1 || (this.tableData.expressStatus == 3 && this.tableData.isTake == 0))  ? true : false;
        this.tableData.isSign = isNaN(data.isSign) ? "" : data.isSign.toString();
        this.tableData.searchInput =
					this.tableData.searchValue ||
          this.tableData.expressNo ||
          this.tableData.orderNo ||
          this.tableData.phone ||
          this.tableData.cardNo;
				this.tableData.createDateObj=[
					data.startCreateTime,
					data.endCreateTime
				];
        this.tableData.cityId = parseInt(data.cityId) || "";
        this.tableData.storeId = parseInt(data.storeId) || "";
      }
		},
		exportData(){
			let params="&mode="+(this.tableData.mode || "");
			params+="&searchValue="+(this.tableData.searchValue || "");
      params+="&expressNo="+(this.tableData.expressNo || "");
			params+="&orderNo="+(this.tableData.orderNo || "");
			params+="&phone="+(this.tableData.phone || "");
			params+="&cardNo="+(this.tableData.cardNo || "");
			params+="&isTake="+(this.tableData.isTake || "");
			params+="&expressStatus="+(this.tableData.expressStatus || "");
			params+="&isSign="+(this.tableData.isSign || "");
			params+="&origin="+(this.tableData.origin || "");
			params+="&type="+(this.tableData.type || "");
			params+="&unionId="+(this.tableData.unionId || "");
			params+="&userUnionId="+(this.tableData.userUnionId || "");
			params+="&storeId="+(this.tableData.storeId || "");
			params+="&cityId="+(this.tableData.cityId || "");
			params+="&bookTime="+(this.tableData.overTime ? 1 : '');
			params+="&startCreateTime="+(time.getDate(this.tableData.createDateObj[0]) || "");
			params+="&endCreateTime="+(time.getDate(this.tableData.createDateObj[1]) || "");
			window.open(consts.BASE_URL + "/export/expressInfo/list?" + params);
		},
    list(page) {
      this.loading = true;
      if (page) this.tableData.pagination.page = parseInt(page || 1);
      let noAssignTakeWork = '';
      if (this.tableData.orderStatus == 1 && this.tableData.noAssignTakeWork) {
        noAssignTakeWork = 1
			}
      this.$store
        .dispatch("post", {
				 	uri: "expressInfo/list",
          data: {
            startRow:
              (this.tableData.pagination.page - 1) *
              this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            mode: this.tableData.mode,
						startCreateTime:time.getDate(this.tableData.createDateObj[0]),
						endCreateTime:time.getDate(this.tableData.createDateObj[1]),
            searchValue: this.tableData.searchValue,
            expressNo: this.tableData.expressNo,
            orderNo: this.tableData.orderNo,
            phone: this.tableData.phone,
            cardNo: this.tableData.cardNo,
            isTake: this.tableData.isTake,
            expressStatus: this.tableData.expressStatus,
            isSign: this.tableData.isSign,
            origin: this.tableData.origin,
            type: this.tableData.type,
						unionId:this.tableData.unionId,
						userUnionId:this.tableData.unionId,
            storeId: this.tableData.storeId,
            cityId: this.tableData.cityId,
						bookTime: this.tableData.overTime? 1 : ''
          }
        })
        .then(res => {
          let list = res.data.data.list || [];
          list.forEach(function(item) {
//            item.destroy = orderConfig.destroy(item.statusVal);

//            if(item.business) {
//              let bList = JSON.parse(item.business);
//              let tmpList = [];
//              bList.forEach(function (item) {
//                tmpList.push(item.name)
//              });
//              item.businessStr = tmpList.join('/')
//            }
          });
					this.tableData.list = list;
          this.tableData.pagination.total = res.data.data.total || 0;
          this.tableData.pagination.page = this.page;
          this.loading = false;
        });
		},
    searchInput(val) {
      let txt = this.tableData.searchInput;
			this.tableData.searchValue ="";
      this.tableData.expressNo = "";
      this.tableData.orderNo = "";
      this.tableData.phone = "";
      this.tableData.cardNo = "";
      switch (val) {
				case "":
          this.tableData.searchValue = txt;
          break;
        case "1":
          this.tableData.expressNo = txt;
          break;
        case "2":
          this.tableData.orderNo = txt;
          break;
        case "3":
          this.tableData.phone = txt;
          break;
        case "4":
          this.tableData.cardNo = txt;
          break;
        default:
          break;
      }
    },
    handleCurrentChange(val) {
      this.updateUrl(val);
    }
 	},
  components: {
    citySelect,
    storeSelect
  }
};
</script>

<style lang="less" scoped>
	.time-item{
   display: inline-block;
   line-height: 30px;
   padding: 0 10px;
   margin-right: 10px;
   border: 1px solid #ccc;
   margin-bottom: 10px;
   cursor: pointer;
   &.disable{
     background-color: #ccc;
     color:#fff;
     cursor:no-drop;
   }
   &.selected{
     background-color: #27c24c;
     border-color: #27c24c;
     color: #fff;
   }
 }
	.scrollbox{
		margin-top: 50px;
   	max-height: 450px;
   	overflow-y: auto;
 	}
	.grid-content{
	    height: 100%;
	    line-height: 34px;
	    cursor: pointer;
	  }
	  .staff-item {
	    width: 90px;
	    cursor: pointer;
	    margin: 0px 10px 0px 10px;
	    vertical-align: top;
	    display: inline-block;
	    .user-logo {
	      margin: 0 auto;
	      width: 80px;
	      height: 80px;
	      border-radius: 50%;
	      overflow: hidden;
	      position: relative;
	      img {
	        width: 100%;
	      }
	      .mask {
	        position: absolute;
	        left: 0;
	        top: 0;
	        width: 100%;
	        line-height: 80px;
	        display: none;
	        background-color: rgba(0, 0, 0, .1);
	        .el-icon-check {
	          color: #fff;
	        }
	      }
	    }
	    .name {
	      margin-top: 5px;
	      line-height: 28px;
	      display: inline-block;
	      padding: 0 15px;
	      border-radius: 14px;
	      border: 1px solid transparent;
	      max-width: 90px;
	    }
	    &.selected {
	      .name {
	        background-color: #d5e5ff;
	        border-color: #20a0ff;
	        color: #20a0ff;
	      }
	      .mask {
	        display: block;
	      }
	    }
	  }
	.group-ico{
		color: #fff;background: #9a74f4; border-radius: 100%;padding: 2px;
		font-size: 12px;
	}
	.text-space{
		max-width: 120px;
		overflow: hidden; 
		text-overflow:ellipsis; 
		white-space: nowrap;
	}
	.item-tag{
		padding: 0px 5px;
		display:inline-block;
		max-width:133px;
		min-width: 35px;
		white-space:normal;
		min-height: 20px;
		line-height: 19px;
		font-size: 12px;
		border-radius: 4px;
		box-sizing: border-box;
		color: #20a0ff;
		border: 1px solid transparent;
		border-color: rgba(32,160,255,.2);
		background-color: rgba(32,160,255,.1);
	}
</style>