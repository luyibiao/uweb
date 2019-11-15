<template>
	<div class="ukao-pt-lg">
		<div>
			<div class="w pull-right m-l">
				<el-input placeholder="请输入内容" v-model="searchKeys.value">
					<el-button slot="append" icon="el-icon-search" @click="updateUrl(1)"></el-button>
				</el-input>
			</div>
			<div class="dis-inline m-r m-b-sm">
				<el-date-picker class="ukao-el-date"
												v-model="searchKeys.createTimeObj"
												type="daterange" align="right"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
												:picker-options="createTimeOptions">
				</el-date-picker>
			</div>
			<storeSelect class="m-r" v-model="searchKeys.storeId"></storeSelect>
			<citySelect class="m-r" v-model="searchKeys.cityId"></citySelect>
			<div class="dis-inline m-b-sm">
				<el-button type="primary" @click="updateUrl(1)">筛 选</el-button>
			</div>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table ukao-v-loading"
								v-loading="loading"
								:data="tableData.list"
								tooltip-effect="dark"
								style="width: 100%">
				<el-table-column label="申请时间">
					<template slot-scope="scope">
						<div>{{ scope.row.createTime | getDate}}</div>
						<div>{{ scope.row.createTime | getTime}}</div>
					</template>
				</el-table-column>
				<el-table-column label="所属门店">
					<template slot-scope="scope">
						<div>{{ scope.row.storeName }}</div>
					</template>
				</el-table-column>
				<el-table-column label="流水号/订单号">
					<template slot-scope="scope">
						<div>{{ scope.row.seq }}</div>
						<div><router-link class="text-primary" target="_blank" :to="'/order/list/detail/'+scope.row.orderId+''">{{ scope.row.orderNo }}</router-link></div>
					</template>
				</el-table-column>
				<el-table-column label="退款金额（元）">
					<template slot-scope="scope">
						<div class="text-success">{{ scope.row.amount | amtFormat}}</div>
					</template>
				</el-table-column>
				<el-table-column label="支付方式" prop="payMethodText">
				</el-table-column>
				<el-table-column label="申请人">
					<template slot-scope="scope">
						<div>{{ scope.row.createName }}</div>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<div :class="scope.row.auditStatus == 1?'text-success':(scope.row.auditStatus == -1?'text-danger':'')">{{ scope.row.auditStatusText }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<div v-if="scope.row.auditStatus != 0">
							<el-button size="small" @click="showDialog(scope.$index,0)">查看详情</el-button>
						</div>
						<div v-else>
							<auth perm="finance.trade.audit_refund.audit">
								<el-button type="primary" size="small" @click="showDialog(scope.$index, 1)">退款</el-button>
								<el-button type="danger" size="small" @click="showDialog(scope.$index, -1)">拒绝</el-button>
							</auth>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination
				:page-size="tableData.pagination.size"
				layout="total, prev, pager, next"
				:current-page.sync="tableData.pagination.page"
				:total="tableData.pagination.total"
				@current-change="handleCurrentChange">
			</el-pagination>
		</div>

		<el-dialog
			:custom-class="editDialog.type === 1 ? 'ukao-dialog-lg':'ukao-dialog'"
			:title="editDialog.title"
			:visible.sync="editDialog.show"
			size="small">
			<div>
				<!-- 退款 -->
				<refund
					v-if="editDialog.type === 1"
					:id="formData.id"
					:orderId="formData.orderId"
					@cancel="editDialog.show = false"
					@success="refundSuccess">
				</refund>
				<!-- 拒绝退款 -->
				<el-form :model="formData" ref="editForm" label-width="120px" v-else-if="editDialog.type === -1">
					<el-form-item label="拒绝原因" prop="auditRemark" :rules="{ required: true, message: '请输入拒绝原因' }">
						<div class="w-lg">
							<el-input v-model.trim="formData.auditRemark" type="textarea"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="editDialog.show=false">取消</el-button>
						<el-button type="primary" @click="refuse(formData.id)">确认</el-button>
					</el-form-item>
				</el-form>
				<!-- 查看 -->
				<div v-else >
					<!-- 退款成功详情 -->
					<refundDetail
						v-if="formData.auditStatus ===1"
						:remark = "formData.remark"
						:auditRemark="formData.auditRemark"
						:seq="formData.seq">
					</refundDetail>
					<!-- 拒绝退款理由 -->
					<el-form v-else>
						<el-form-item label="退款原因：" >
							<div class="w-lg">
								{{formData.remark}}
							</div>
						</el-form-item>
						<el-form-item label="申请人：">
							<div class="w-lg">
								{{formData.createName}}
							</div>
						</el-form-item>
						<el-form-item label="退款方式：" v-if="formData.payMethodText">
							<div class="w-lg">
								{{formData.payMethodText}}
							</div>
						</el-form-item>
						<el-form-item label="退款金额：">
							<div class="w-lg text-danger">
								￥{{formData.amount | amtFormat}}
							</div>
						</el-form-item>
						<el-form-item label="拒绝原因：">
							<div class="w-lg">
								{{formData.auditRemark}}
							</div>
						</el-form-item>
						<el-form-item label="操作时间：">
							<div class="w-lg">
								{{formData.auditTime | getDateTime}}
              </div>
						</el-form-item>
						<el-form-item label="操作人：">
							<div class="w-lg">
								{{formData.auditName}}
              </div>
						</el-form-item>
					</el-form>
					<div class="text-right">
						<el-button @click="editDialog.show=false">关闭</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import consts from "@/utils/consts";
  import time from "@/utils/helpers/timeLite";
  import msg from '@/utils/msg'
  import citySelect from '@/components/DropDownList/city'
  import storeSelect from '@/components/DropDownList/store'
  import refund from '../components/refund'
  import refundDetail from '../components/refund_detail'
  export default {
    data: function() {
      return {
        storeList: [],
        loading: false,
        searchKeys: {
          value: "",
          storeId: "",
          cityId: "",
          createTimeObj: [new Date() - 3600 * 1000 * 24 * 30, new Date()]
        },
        editDialog : {
          type:1, //1 退款 -1 拒绝 0 查看详情
          title:'',
          show:false
        },
        formData: {},
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
      }
    },
    methods: {
      // 初始化参数
      initParams(){
        let data = this.$route.query;
        if(JSON.stringify(data) !== '{}'){
          this.searchKeys.storeId = parseInt(data.storeId) || "";
          this.searchKeys.cityId = parseInt(data.cityId) || "";
          this.searchKeys.value = data.searchValue || "";
          this.searchKeys.createTimeObj = [data.startDate, data.endDate];
          this.tableData.pagination.page = parseInt(data.page || 1);
        }
      },
      showDialog(index, type){
        this.formData = this.tableData.list[index];
        this.editDialog.type = type;
        if (type === 1) {
          this.editDialog.title = "退款";
        } else if (type === -1) {
          this.editDialog.title = "拒绝退款";
        } else {
          this.editDialog.title = "查看详情"
        }
        this.editDialog.show = true;
      },
      // 退款成功
      refundSuccess() {
        msg.success('退款成功');
        this.list();
        this.editDialog.show = false;
      },
      refuse() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.$store.dispatch("post", {
              uri: "tradeAudit/refund/refuse",
              data: {...this.formData}
            }).then(res => {
              this.editDialog.show = false;
              this.list();
            });
          }
        });
      },
      // 更新url
      updateUrl(page = 1){
        if (!this.searchKeys.createTimeObj) this.searchKeys.createTimeObj = [];
        this.$router.push({
          path: this.$route.path,
          query:{
            page: page,
            storeId: this.searchKeys.storeId,
            cityId: this.searchKeys.cityId,
            searchValue: this.searchKeys.value,
            startDate: time.getDate(this.searchKeys.createTimeObj[0]),
            endDate: time.getDate(this.searchKeys.createTimeObj[1])
          }
        })
      },
      handleCurrentChange(val) {
        this.updateUrl(val);
      },
      list() {
        this.loading = true;
        this.$store
          .dispatch("post", {
            uri: "tradeAudit/refund/list",
            data: {
              startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
              pageSize: this.tableData.pagination.size,
              storeId: this.searchKeys.storeId,
              cityId: this.searchKeys.cityId,
              searchValue: this.searchKeys.value,
              startDate: time.getDate(this.searchKeys.createTimeObj[0]) || "",
              endDate: time.getDate(this.searchKeys.createTimeObj[1]) || ""
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
        params += "&searchValue=" + (this.searchKeys.value || "");
        params +=
          "&startDate=" + time.getDate(this.searchKeys.createTimeObj[0]);
        params +=
          "&endDate=" + time.getDate(this.searchKeys.createTimeObj[1]);
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
    },
    components: {
      citySelect,
      storeSelect,
      refund,
      refundDetail
    }
  };
</script>
<style>
	.el-form-item__label{
		font-size: 14px;
		color: #9c9c9c;
	}

	.el-form-item{
		margin-bottom: 0px;

	}

	.el-dialog__body {
		padding: 30px 80px;
		color: #606266;
		font-size: 14px;
	}

	.el-form-item__content {
		line-height: 30px;
		position: relative;
		font-size: 14px;
	}

	.el-form-item__label {
		width: 90px;
		text-align: right;
		float: left;
		font-size: 14px;
		color: #9c9c9c;
		line-height: 30px;
		padding: 0 12px 0 0;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>