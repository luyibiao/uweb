<style lang="less" scoped>
.form-item {
  line-height: 28px;
  .label {
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
  <div>
    <div class="form-item">
      <div class="label">退款原因：</div>
      <div class="inner">{{remark || '无'}}</div>
    </div>
    <div class="form-item">
      <div class="label">审核备注：</div>
      <div class="inner">{{auditRemark || '无'}}</div>
    </div>
    <template  v-for="(item,index) in list">
      <div class="form-item">
        <div class="label">退款方式：</div>
        <div class="inner">{{item.refundMethodText}}</div>
      </div>
      <div class="form-item">
        <div class="label">退款金额：</div>
        <div class="inner text-danger">￥{{item.amount | amtFormat}}</div>
      </div>
    </template>
  </div>
</template>
<script>
import consts from "@/utils/consts";

export default {
  props: ["seq", "remark", "auditRemark"],
  data() {
    return {
      loading: false,
      list: {}
    };
  },
  created() {
    this.getList();
  },
  watch: {
    seq() {
      this.getList();
    }
  },
  methods: {
    // 详情
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeOrderRefund/list",
          params: {
            auditSeq: this.seq
          }
        })
        .then(res => {
          this.list = res.data.data.list;
          this.loading = false;
        });
    }
  }
};
</script>

同意退款成功详情
  props
    name | default | type |说明
    seq | 无 | string | 订单流水号
    remark | 无 | string | 同意退款备注