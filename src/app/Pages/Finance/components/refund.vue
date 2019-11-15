<style lang="less" scoped>
.refund-left {
  float: left;
  width: 260px;
}
.refund-right {
  margin-left: 280px;
}
.form-item {
  line-height: 28px;
  .label {
    color: #9c9c9c;
    width: 110px;
    float: left;
    text-align: right;
  }
  .inner {
    min-height: 28px;
    margin-left: 120px;
  }
}
</style>

<template>
  <el-tabs v-model="name"
           type="card"
           @tab-click="tabClick">
    <el-tab-pane label="退款操作"
                 name="refund">
      <div v-loading="loading">
        <div class="clearfix m-b-md">
          <div class="refund-left">
            <div class="form-item">
              <div class="label">客户：</div>
              <div class="inner">{{detail.userInfo && detail.userInfo.name || ''}}</div>
            </div>
            <div class="form-item">
              <div class="label">手机号：</div>
              <div class="inner">{{detail.userInfo && detail.userInfo.phone || ''}}</div>
            </div>
            <div class="form-item">
              <div class="label">订单号：</div>
              <div class="inner">
                <router-link v-if="detail.orderInfo"
                             target="_blank"
                             :to="`/order/list/detail/${detail.orderInfo.id}`"
                             class="text-primary">
                  {{detail.orderInfo.orderNo}}
                </router-link>
              </div>
            </div>
            <template v-for="(item, index) in detail.tradeOrderList">
              <div class="form-item">
                <div class="label">支付方式：</div>
                <div class="inner">
                  <span>
                    {{item.payMethodText}}
                  </span>
                </div>
              </div>
              <div class="form-item">
                <div class="label">付款金额</div>
                <div class="inner">
                  ￥{{item.amount || 0 | amtFormat}}
                </div>
              </div>
            </template>
          </div>
          <div class="refund-right">
            <div class="form-item">
              <div class="label">所属门店：</div>
              <div class="inner">{{detail.storeName}}</div>
            </div>
            <div class="form-item">
              <div class="label">申请退款金额：</div>
              <div class="inner text-danger">￥{{detail.amount || 0 | amtFormat}}</div>
            </div>
            <div class="form-item">
              <div class="label">退款原因：</div>
              <div class="inner">{{detail.remark || '无'}}</div>
            </div>
            <div class="form-item">
              <div class="label">申请人：</div>
              <div class="inner">{{detail.createName}}</div>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <div class="refund-left">
            <div class="form-item">
              <div class="label">衣物总额：</div>
              <div class="inner">￥{{detail.orderInfo && detail.orderInfo.orderPrice || 0 | amtFormat}}</div>
            </div>
            <div class="form-item">
              <div class="label">取件费：</div>
              <div class="inner">￥{{detail.orderInfo && detail.orderInfo.takeCarriage || 0 | amtFormat}}</div>
            </div>
            <div class="form-item">
              <div class="label">送件费：</div>
              <div class="inner">￥{{detail.orderInfo && detail.orderInfo.sendCarriage || 0 | amtFormat}}</div>
            </div>
            <div class="form-item">
              <div class="label">使用优惠券：</div>
              <div class="inner">￥{{detail.orderInfo && detail.orderInfo.couponAmt || 0 | amtFormat}}</div>
            </div>
            <div class="form-item">
              <div class="label">实付金额：</div>
              <div class="inner text-success">￥{{detail.orderInfo && detail.orderInfo.paidPrice || 0 | amtFormat}}</div>
            </div>
          </div>
          <div class="refund-right">
            <div class="m-b">
              <div class="text-muted m-b-xs">
                <span class="text-danger">*</span>退款方式</div>
              <div class="m-b-xs"
                   v-if="detail.cardRefundTotalAmt">
                <span class="text-danger">{{detail.cardRefundTotalAmt | amtFormat}}</span>
                （支付比例{{detail.cardPayRatio}}%）元退至优付卡
              </div>
              <div class="m-b-xs"
                   v-if="detail.balRefundTotalAmt">
                <span class="text-danger m-r-xs">{{detail.balRefundTotalAmt | amtFormat}}</span>元退至余额
              </div>
              <div class="m-b-xs"
                   v-if="detail.otherRefundAmt">
                <span class="text-danger m-r-xs">{{detail.otherRefundAmt | amtFormat}}</span>元退至
                <payMethods class="dis-inline"
                            v-model="refundMethod"></payMethods>
              </div>
            </div>
            <div class="m-b">
              <p class="text-muted m-b">备注</p>
              <el-input class="w-xl"
                        type="textarea"
                        :rows="3"
                        v-model.trim="remark"
                        placeholder="请输入退款备注"></el-input>
            </div>
            <div>
              <el-button @click="$emit('cancel')">取消</el-button>
              <el-button type="primary"
                         @click="submit"
                         :loading="refunding">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="退款记录"
                 name="record">
      <el-table v-loading="loading"
                class="text-xs ukao-el-table"
                :data="tableData">
        <el-table-column label="退款时间">
          <template slot-scope="scope">
            <p>{{scope.row.tradeTime | getDate}}</p>
            <p>{{scope.row.tradeTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="storeName"
                         label="所属门店">
        </el-table-column>
        <el-table-column label="流水号/订单号">
          <template slot-scope="scope">
            <p>{{scope.row.seq}}</p>
            <router-link target="_blank"
                         :to="`/order/list/detail/${scope.row.orderId}`"
                         class="text-primary">
              {{scope.row.orderNo}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="退款金额">
          <template slot-scope="scope">
            <span class="text-danger">{{scope.row.amount | amtFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160"
                         label="退款方式">
          <template slot-scope="scope">
            {{scope.row.refundMethodText}}
            <span class="text-danger"
                  v-if="scope.row.isSign">（标记退款）</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusText"
                         label="状态">
        </el-table-column>
      </el-table>
      <div class="text-right m-t-sm">
        <el-pagination :page-size="pagination.size"
                       layout="total, prev, pager, next"
                       :current-page.sync="pagination.current"
                       :total="pagination.total"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";

import payMethods from "./pay_methods";
export default {
  props: ["id", "orderId"],
  data() {
    return {
      name: "refund", //tab名
      tableData: [], //退款记录列表
      // 退款记录分页
      pagination: {
        size: consts.PAGE_SIZE,
        current: 1,
        total: 0
      },
      detail: {}, //退款详情
      refundMethods: [], //退款方式列表
      refundMethod: "", //退款方式
      remark: "", //备注

      refunding: false,
      loading: false,
      reset: true //重新获取退款记录列表
    };
  },
  created() {
    this.getDetail();
  },
  watch: {
    id(n, o) {
      this.name = "refund";
      this.reset = true;
      this.getDetail();
      this.tableData = [];
      this.pagination.current = 1;
      this.pagination.total = 0;
    }
  },
  methods: {
    // tab切换
    tabClick(el) {
      if (el.name == "record" && this.reset) {
        this.getList();
        this.reset = false;
      }
    },
    // 翻页
    currentChange() {
      if (this.name == "record") {
        this.getList();
      }
    },
    // 详情
    getDetail() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeAudit/auditRefund/detail",
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
          this.loading = false;
          this.refundMethod = this.detail.payMethod || "";
        });
    },
    // 退款记录列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeOrderRefund/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            orderId: this.orderId
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 同意退款
    submit() {
      let payMethod =
        this.detail.otherRefundAmt > 0
          ? this.refundMethod
          : this.detail.defaultPayMethod;
      if (!payMethod) {
        msg.warning("请选择退款方式");
        return false;
      }
      this.refunding = true;
      this.$store
        .dispatch("post", {
          uri: "tradeAudit/refund/agree",
          data: {
            id: this.id,
            payMethod,
            auditRemark: this.remark
          },
          forceResolve: true
        })
        .then(res => {
          this.refunding = false;
          if (200 === res.data.httpCode) {
            this.$emit("success", res.data);
          } else {
            msg.error(res.data.msg || consts.ERROR_MSG);
            this.$emit("error", res.data);
          }
        });
    }
  },
  components: {
    // 退款方式
    payMethods
  }
};
</script>
// 退款操作界面
  props
    name | default | type | 说明
    id | 无 | string | 申请记录id
    orderId | 无 | string | 订单id
  events
    name | params | 说明
    success | 无 | 同意退款成功触发
    error | 无 | 同意退款失败触发
    cancel | 无 |取消退款触发