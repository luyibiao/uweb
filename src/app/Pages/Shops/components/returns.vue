<template>
  <div>
    <el-table :data="goods"
              border
              tooltip-effect="dark"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="40">
      </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          <p class="text-primary l-h">{{scope.row.goodsName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="数量"
                       prop="count"
                       width="80"></el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">
          ￥{{scope.row.price | amtFormat}}
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="statusText"
                       width="100"></el-table-column>
    </el-table>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="90px"
             class="m-t-sm">
      <p class="text-xs l-h36">
        <span class="text-danger m-l-md m-r-xs">*</span>退货成功后不可恢复，请仔细核对退货信息！</p>
      <el-form-item label="退货金额"
                    prop="amount">
        <el-input class="w-md"
                  v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="退货备注">
        <el-input class="w-md"
                  type="textarea"
                  :rows="2"
                  v-model.trim="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div class="text-right">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button :loading="saving"
                 type="primary"
                 @click="submit">退货</el-button>
    </div>
  </div>
</template>
<script>
import calculation from "@/utils/helpers/calculation.js";
import validate from "@/utils/helpers/validate.js";
import msg from "@/utils/msg";
export default {
  props: {
    // 商品列表
    goods: {
      default: _ => [],
      type: Array
    },
    refundablePrice: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      saving: false,
      form: {
        id: "",
        amount: "",
        remark: "",
        goodsIds: ""
      },
      rules: {
        amount: [
          { required: true, message: "请输入退款金额" },
          {
            validator: (rule, value, callback) => {
              if (validate.amount(value, 2, 0.01, 999999999)) {
                let ablePrice = calculation.accDiv(this.refundablePrice, 100);
                value > ablePrice
                  ? callback(new Error(`退款金额不能超过${ablePrice}元`))
                  : callback();
              } else {
                callback(new Error("金额格式错误"));
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    // checkGoods() {
    //   let flag = this.form.goodsIds.replace(/\s+/g, "");
    //   if (!flag) msg.warning("请选择商品");
    //   return flag;
    // },
    handleSelectionChange(val) {
      this.form.goodsIds = val.map(item => item.id).join(",");
      console.log(this.form.goodsIds);
    },
    postBackOrder(data) {
      return this.$store.dispatch("post", {
        uri: "mall/order/backOrder",
        data
      });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true;
          let data = {
            id: this.goods[0].orderId,
            remark: this.form.remark,
            goodsIds: this.form.goodsIds,
            amount: calculation.accMul(this.form.amount, 100)
          };
          this.postBackOrder(data).then(res => {
            this.$emit("success");
            this.saving = false;
          });
        }
      });
    }
  }
};
</script>
