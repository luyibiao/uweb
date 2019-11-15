<template>
  <div>
    <el-row class="b-a">
      <el-col :span="12">
        <div class="b-r m-t-sm m-b-sm padder-v padder-md">
          <p class="text-md m-b-md">{{income.oneWeekIncomeName || "近7天收入"}}</p>
          <p>
            <span class="dis-inline w-sm ">
              <span class="text-lg text-warning m-r-xs">{{income.oneWeekIncome || 0 | amtFormat}}</span>元
            </span>
          </p>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="m-t-sm m-b-sm padder-v padder-md">
          <div class="text-md">
            {{income.balanceName || "账户余额"}}
            <span class="m-l-xs text-xs text-muted">
              ({{income.withdrawalsName || '申请提现金额'}}<span class="text-danger">{{income.withdrawals || 0 | amtFormat}}</span>元)
            </span>
          </div>
          <div class="m-t">
            <span class="dis-inline w"><span class="text-lg text-warning">{{ income.balance || 0 | amtFormat}}</span>元</span>
            <auth perm="marketing.friend.recharge">
              <el-button type="primary" @click="dialog.show = true">充值</el-button>
            </auth>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      class="ukao-dialog"
      title="充值" 
      :visible.sync="dialog.show">
      <el-form ref="form" label-width="180px" :model="dialog.form">
        <el-form-item label="充值金额（元）" prop="amount" :rules="dialog.rule">
          <el-input class="w-md" :placeholder="`请输入充值金额`" v-model="dialog.form.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input class="w-md" type="textarea" placeholder="请输入备注" v-model.trim="dialog.form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button type="primary"  @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  
</template>
<script>
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
export default {
  data() {
    return {
      income: {},
      dialog: {
        show: false,
        form: {
          amount: "",
          remark: ""
        },
        rule: [
          { required: true, message: "请输入金额", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (validate.amount(value, 2, 0, 99999)) {
                callback();
              } else {
                callback(new Error("请输入0-99999的数字（最多保留2位小数）"));
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getIncome();
  },
  methods: {
    // 获取概况
    getIncome() {
      this.$store
        .dispatch("get", {
          uri: "profitDetail/friend/income",
          params: {
            friendId: this.$route.params.id
          }
        })
        .then(res => {
          this.income = res.data.data;
        });
    },
    // 充值
    recharge(fn) {
      this.$store
        .dispatch("post", {
          uri: "profitDetail/friend/recharge",
          data: {
            friendId: this.$route.params.id,
            amount: calculation.accMul(this.dialog.form.amount, 100),
            remark: this.dialog.form.remark
          }
        })
        .then(res => {
          fn && fn();
        });
    },
    // 提交充值
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.recharge(_ => {
            this.getIncome();
            this.dialog.show = false;
            msg.success("充值成功！");
          });
        }
      });
    }
  }
};
</script>
