<template>
  <div>
    <span v-for="item in refundMethods"
          @click="select(item.val)"
          :key="item.val"
          :class="{'ways-item':true,'is-active':refundMethod == item.val}">
      {{item.text}}
    </span>
  </div>
</template>
<script>
import consts from "@/utils/consts";

export default {
  props: {
    value: {
      default: ""
    }
  },
  data() {
    return {
      refundMethod: "",
      refundMethods: []
    };
  },
  watch: {
    value(n) {
      this.refundMethod = n;
    }
  },
  created() {
    this.getRefundMethod();
    this.refundMethod = this.value;
  },
  methods: {
    // 获取退款方式
    getRefundMethod() {
      this.$store
        .dispatch("get", {
          uri: "sysDicKey/refundMethodList"
        })
        .then(res => {
          this.refundMethods = res.data.data;
        });
    },
    // 选择
    select(val) {
      this.refundMethod = val;
      this.$emit("input", this.refundMethod);
    }
  }
};
</script>
<style lang="less" scoped>
.ways-item {
  padding: 4px 9px;
  font-size: 12px;
  border: 1px solid #bfcbd9;
  display: inline-block;
  margin: 0 8px 8px 0;
  line-height: 18px;
  cursor: pointer;
  &:hover {
    color: #20a0ff;
  }
  &.is-active {
    border-color: #20a0ff;
    color: #fff;
    background-color: #20a0ff;
  }
}
</style>
退款方式