<template>
  <div>
    <!-- 配送方式信息 -->
    <el-table class="ukao-el-table"
              :data="payData">
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          {{ scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="使用状态">
        <template slot-scope="scope">
          <auth perm="setting.parameter.mall">
            <el-switch v-model="scope.row.value"
                     @change="changePayMode(scope.row)"
                     active-value="1"
                     inactive-value="0"
                     :disabled="scope.$index === 0"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-text="启用"
                     inactive-text="停用">
            </el-switch>
            <template slot="noPerm">
              <el-switch v-model="scope.row.value"
                         active-value="1"
                         inactive-value="0"
                         disabled
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         active-text="启用"
                         inactive-text="停用">
              </el-switch>
            </template>
          </auth>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      // 配置信息
      payData: [],
      //支付宝信息
      alipay: "0"
    };
  },
  created() {
    this.getPayMode();
  },
  methods: {
    getPayMode() {
      this.$store
        .dispatch("get", {
          uri: "mall/config/payment"
        })
        .then(res => {
          let payName = ["微信支付", "余额支付"],
            data = res.data.data.split("");
          // 删除并获取支付配置数据
          this.alipay = data.splice(1, 1).join("");
          // 初始化支付配置数据
          this.payData = payName.map((item, index) => {
            return {
              name: item,
              value: data[index] || "0"
            };
          });
        });
    },
    changePayMode(item) {
      // 控制是否能提交更改 支付方式全部关闭时不能提交
      let flag = this.payData.filter(item => item.value == "1").length > 0;
      msg.confirm({
        msg: flag
          ? `确认${item.value == "1" ? "开启" : "关闭"}${item.name}？`
          : "至少开启一种支付方式！",
        confirmFn: _ => {
          if (flag) {
            let data = this.payData.map(item => item.value);
            // 加入支付宝支付方式
            data.splice(1, 0, this.alipay);
            this.updatePayMode(data.join(""));
          } else {
            item.value = item.value == "1" ? "0" : "1";
          }
        },
        cancelFn: _ => {
          item.value = item.value == "1" ? "0" : "1";
        }
      });
    },
    updatePayMode(paymentConfig) {
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/updateMallPaymentCfg",
          data: { paymentConfig }
        })
        .then(res => {
          msg.success();
        });
    }
  }
};
</script>

支付方式设置