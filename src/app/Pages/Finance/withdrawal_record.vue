<template>
	<div class="ukao-pt-md">
		<!-- 筛选 -->
		<ul class="uk-search">
			<li class="uk-search-item">
				<div class="uk-search-label">申请时间：</div>
				<el-date-picker class="uk-search-content"
				                v-model="search.time"
				                type="daterange"
												start-placeholder="开始日期"
												end-placeholder="结束日期">
				</el-date-picker>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">角色：</div>
				<el-select class="uk-search-content w-sm"
				           v-model="search.userType"
				           placeholder="请选择">
					<el-option v-for="item in options"
					           :key="item.id"
					           :label="item.label"
					           :value="item.value">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<div class="uk-search-label">申请人：</div>
				<div class="uk-search-content">
					<el-input class="w m-r-sm"
					          v-model="search.searchValue"
										prefix-icon="el-icon-search"
					          placeholder="输入姓名、手机号"></el-input>
					<el-button type="primary"
					           @click="searchData">查询</el-button>
				</div>
			</li>
		</ul>
		<!-- tab -->
		<el-tabs v-model="search.auditStatus"
		         @tab-click="searchData"
		         type="card">
			<el-tab-pane label="全部"
			             name="all"></el-tab-pane>
			<el-tab-pane label="申请中"
			             name="0"></el-tab-pane>
			<el-tab-pane label="已付款"
			             name="1"></el-tab-pane>
			<el-tab-pane label="已拒绝"
			             name="-1"></el-tab-pane>
		</el-tabs>
		<!-- 数据列表 -->
		<el-table class="m-t-lg ukao-el-table"
		          :data="tableData"
		          v-loading="loading"
		          style="width: 100%">
			<el-table-column label="申请时间"
			                 min-width="130">
				<template slot-scope="scope">
					<div>{{ scope.row.createTime | getDate }}</div>
					<div>{{ scope.row.createTime | getTime }}</div>
				</template>
			</el-table-column>
			<el-table-column label="提现账户信息"
			                 min-width="255">
				<template slot-scope="scope">
					<el-popover
					            placement="bottom-start"
					            width="250"
					            trigger="hover">
						<div>
							<p>收款银行：{{scope.row.bankName}}</p>
							<p>银行账户：{{scope.row.accountNo}}</p>
							<p>账户名称：{{scope.row.accountName}}</p>
						</div>
						<div slot="reference">
							<span>
								{{scope.row.bankType === 2 ? '对公' : '个人'}}账户 | {{scope.row.bankName}}...{{scope.row.accountNoHide}}
							</span>
							<i class="el-icon-caret-bottom m-l-xs"></i>
						</div>
					</el-popover>
					<div class="text-muted text-sm">申请单号：{{scope.row.seq}}</div>
				</template>
			</el-table-column>
			<el-table-column label="提现金额（元）"
			                 min-width="150px">
				<template slot-scope="scope">
					<div class="text-danger">{{scope.row.amount | amtFormat}}</div>
				</template>
			</el-table-column>
			<el-table-column label="申请人"
			                 min-width="150px">
				<template slot-scope="scope">
					<template v-if="scope.row.userType === 2">
						<p>{{scope.row.createName}}</p>
						<p>{{scope.row.createPhone}}</p>
					</template>
					<template v-if="scope.row.userType === 4">
						<p>{{scope.row.friendName}}</p>
						<p>{{scope.row.friendPhone}}</p>
					</template>
				</template>
			</el-table-column>
			<el-table-column label="角色"
			                 min-width="140px">
				<template slot-scope="scope">
					<template v-if="scope.row.userType === 2">
						<p>{{scope.row.roleName}}</p>
					</template>
					<template v-if="scope.row.userType === 4">
						<p>{{scope.row.userTypeText}}</p>
					</template>
				</template>
			</el-table-column>
			<el-table-column label="提现状态"
			                 min-width="120px">
				<template slot-scope="scope">
					<span :class="{'text-success':scope.row.auditStatus === 1 , 'text-muted' : scope.row.auditStatus ===-1}">
						{{scope.row.auditStatusText}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="操作"
			                 width="150px">
				<template slot-scope="scope">

					<template v-if="scope.row.auditStatus === 0">
						<auth perm="finance.withdrawal.audit">
							<el-button size="small"
						           type="success"
						           @click="openDialog(1,'付款',scope.row)">付款</el-button>
							<el-button size="small"
						           type="danger"
						           @click="openDialog(-1,'拒绝',scope.row)">拒绝</el-button>
							<template slot="noPerm">-</template>
						</auth>
					</template>
					<el-button v-else
					           type="text"
					           @click="openDialog(0,'查看详情',scope.row)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="text-right m-t-sm">
			<auth perm="finance.withdrawal.export">
				<el-button size="small"
			           @click="exportData"
			           class="pull-left">导出</el-button>
			</auth>
			<el-pagination :page-size="pagination.size"
			               layout="total, prev, pager, next"
			               :current-page.sync="pagination.current"
			               :total="pagination.total"
			               @current-change="updateUrl">
			</el-pagination>
		</div>
		<!-- 弹窗 -->
		<el-dialog :custom-class="detail.auditStatus === 1 && dialog.type === 0 ? 'ukao-dialog-lg' : 'ukao-dialog-md'"
		           :title="dialog.title"
		           :visible.sync="dialog.visible">
			<!-- 拒绝详情 只在查看详情并且状态为拒绝时显示-->
			<el-form label-width="110px"
			         v-if="dialog.type === 0 && detail.auditStatus === -1">
				<el-form-item label="拒绝原因">
					<div class="w-lg">
						{{detail.auditRemark}}
					</div>
				</el-form-item>
				<el-form-item label="操作时间">
					<div class="w-lg">
						{{detail.auditTime | getDateTime}}
					</div>
				</el-form-item>
				<el-form-item label="操作人">
					<div class="w-lg">
						{{detail.auditName}}
					</div>
				</el-form-item>
			</el-form>
			<!--提现申请操作 -->
			<el-row v-else>
				<!-- 申请人信息 -->
				<el-col :span="detail.auditStatus === 1 ? 10 : 14">
					<div class="form-item">
						<div class="form-label text-muted">开户银行：</div>
						<div class="form-inner">{{detail.bankName}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">账户：</div>
						<div class="form-inner">{{detail.accountNo}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">账户名：</div>
						<div class="form-inner">{{detail.accountName}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">申请人：</div>
						<div class="form-inner">
							<template v-if="detail.userType == 2">
								{{detail.createName}}
							</template>
							<template v-if="detail.userType == 4">
								{{detail.friendName}}
							</template>
						</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">申请提现金额：</div>
						<div class="form-inner text-success">￥{{detail.amount || 0 | amtFormat}}</div>
					</div>
				</el-col>
				<!-- 申请成功详情 -->
				<el-col :span="14"
				        v-if="detail.auditStatus === 1">
					<div class="form-item">
						<div class="form-label text-muted">付款方式：</div>
						<div class="form-inner">{{detail.auditPayMethodText}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">付款金额：</div>
						<div class="form-inner">￥{{detail.amount | amtFormat}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">备注</div>
						<div class="form-inner">{{detail.auditRemark}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">操作时间：</div>
						<div class="form-inner">{{detail.auditTime | getDateTime}}</div>
					</div>
					<div class="form-item">
						<div class="form-label text-muted">操作人</div>
						<div class="form-inner">{{detail.auditName}}</div>
					</div>
				</el-col>
			</el-row>
			<!-- 付款表单 -->
			<el-form class="m-t-lg"
			         v-show="dialog.type === 1"
			         :model="form"
			         label-width="110px">
				<el-form-item required>
					<span class="text-muted"
					      slot="label">
						付款方式</span>
					<payMethods v-model="form.payMethod"></payMethods>
				</el-form-item>
				<el-form-item>
					<span class="text-muted"
					      slot="label">
						备注</span>
					<el-input class="w-lg"
					          type="textarea"
					          v-model.trim="form.agreeRemark"
					          :rows="3"
					          placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<!-- 拒绝表单 -->
			<el-form class="m-t-lg"
			         ref="refuseForm"
			         v-show="dialog.type === -1"
			         :model="form"
			         label-width="110px">
				<el-form-item prop="refuseRemark"
				              :rules="[{ required: true, message: '请输入拒绝理由'}]">
					<span class="text-muted"
					      slot="label">
						拒绝原因</span>
					<el-input class="w-lg"
					          v-model.trim="form.refuseRemark"
					          type="textarea"
					          :rows="3"
					          placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div :class="dialog.type !== 0 ? 'text-center' : ''"
			     slot="footer">
				<el-button v-if="dialog.type == 0"
				           @click="dialog.visible = false">关闭</el-button>
				<el-button v-else
				           @click="dialog.visible = false">取消</el-button>
				<el-button v-if="dialog.type === 1"
				           type="primary"
				           :loading="form.loading"
				           @click="submit(1)">确定</el-button>
				<el-button v-if="dialog.type === -1"
				           type="danger"
				           :loading="form.loading"
				           @click="submit(-1)">确定拒绝</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import time from "@/utils/helpers/timeLite";
import msg from "@/utils/msg";

import payMethods from "./components/pay_methods";
export default {
  data() {
    return {
      // 选项
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 4,
          label: "友商"
        },
        {
          value: 2,
          label: "员工"
        }
      ],
      loading: false,
      // 搜索
      search: {
        time: [new Date() - 3600 * 1000 * 24 * 30, new Date()], //时间
        auditStatus: "all", //状态
        userType: "", //角色
        searchValue: "" //关键字
      },
      // 列表
      tableData: [],
      // 分页
      pagination: {
        size: consts.PAGE_SIZE,
        current: 1,
        total: 0
      },
      // 弹窗
      dialog: {
        title: "",
        visible: false,
        type: 0 //弹窗类型  0：查看详情 , 1 : 提现 ， -1：拒绝
      },
      // 提现表单
      form: {
        loading: false,
        payMethod: "", //提现方式
        agreeRemark: "", //同意提现备注
        refuseRemark: "" //拒绝提现备注
      },
      // 提现申请详情
      detail: {}
    };
  },
  created() {
    this.init();
    this.getList();
  },
  watch: {
    $route() {
      this.init();
      this.getList();
    }
  },
  methods: {
    // 初始化数据
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current);
        this.search.auditStatus = data.auditStatus;
        this.search.userType = parseInt(data.userType) || "";
        this.search.searchValue = data.searchValue;
        this.search.time = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ];
      }
    },
    // 变动url
    updateUrl() {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          startDate: time.getDate(this.search.time[0]) || "",
          endDate: time.getDate(this.search.time[1]) || "",
          auditStatus: this.search.auditStatus,
          userType: this.search.userType,
          searchValue: this.search.searchValue
        }
      });
    },
    // 搜索
    searchData() {
      this.pagination.current > 1
        ? (this.pagination.current = 1)
        : this.updateUrl();
    },
    // 获取列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "tradeAudit/audit/list",
          data: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || "",
            auditStatus:
              this.search.auditStatus === "all" ? "" : this.search.auditStatus,
            userType: this.search.userType,
            searchValue: this.search.searchValue
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 打开弹窗
    openDialog(type, title, data = null) {
      this.dialog.type = type;
      this.dialog.title = title;
      this.dialog.visible = true;
      if (type === -1) {
        // 重置拒绝提现表单
        this.$nextTick(_ => {
          this.$refs.refuseForm.resetFields();
        });
      } else if (type === 1) {
        // 清除提现备注和支付方式
        this.form.agreeRemark = "";
        this.form.payMethod = "";
      }
      // 获取详情
      if (data) this.detail = data;
    },
    // 提交
    submit(type) {
      if (type === 1 ? this.checkAgree() : this.checkRefuse()) {
        this.form.loading = true;
        (type === 1 ? this.agree() : this.refuse()).then(res => {
          if (res.data.httpCode === 200) {
            this.getList();
            msg.success();
            this.dialog.visible = false;
          } else {
            msg.error(res.data.msg);
          }
          this.form.loading = false;
        });
      }
    },
    // 提现前校验
    checkAgree() {
      if (this.form.payMethod) {
        return true;
      }
      msg.warning("请选择付款方式");
      return false;
    },
    // 拒绝提现前校验
    checkRefuse() {
      let result;
      this.$refs.refuseForm.validate(value => {
        result = value;
      });
      return result;
    },
    // 同意提现
    agree() {
      return this.$store.dispatch("post", {
        uri: "tradeAudit/examine/agree",
        data: {
          id: this.detail.id,
          payMethod: this.form.payMethod,
          remark: this.form.agreeRemark
        },
        forceResolve: true
      });
    },
    // 拒绝提现
    refuse() {
      return this.$store.dispatch("post", {
        uri: "tradeAudit/examine/reject",
        data: {
          id: this.detail.id,
          remark: this.form.refuseRemark
        },
        forceResolve: true
      });
    },
    exportData() {
      let params = `
				?startDate=${time.getDate(this.search.time[0]) || ""}
				&endDate=${time.getDate(this.search.time[1]) || ""}
				&auditStatus=${this.search.auditStatus === "all" ? "" : this.search.auditStatus}
				&userType=${this.search.userType}
				&searchValue=${this.search.searchValue}
			`;
      window.open(`${consts.BASE_URL}/export/tradeAudit/list${params}`);
    }
  },
  filters: {
    applicantInfo() {}
  },
  components: {
    payMethods
  }
};
</script>
<style lang="less">
.w50 {
  width: 50%;
}
.form-item {
  line-height: 28px;
  .form-label {
    width: 110px;
    float: left;
    text-align: right;
  }
  .form-inner {
    min-height: 28px;
    margin-left: 120px;
  }
}
</style>
