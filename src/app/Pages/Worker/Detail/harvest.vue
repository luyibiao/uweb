<style lang="less" scoped>
.content {
  padding: 20px 25px;
}
</style>
<template>
  <div class="b-a content">
    <div>
      <div>账户余额<span class="m-l-xs text-xs text-muted">(申请提现金额<span class="text-danger">{{info.withdrawals || 0 | amtFormat}}</span>元)</span>
      </div>
      <div class="m-t">
        <span style="margin-right: 180px;"><span class="text-lg text-warning">{{info.balance || 0 | amtFormat}}</span>元</span>
        <auth perm="worker.list.chgbal">
          <el-button type="primary" @click="operating(0)">充值</el-button>
          <el-button type="primary" @click="operating(1)">奖励</el-button>
          <el-button type="danger" @click="operating(2)">处罚</el-button>
        </auth>
      </div>
    </div>
    <el-dialog
      class="ukao-dialog"
      :title="manner[dialog.type].title" 
      size="tiny" 
      @close="dialog.btnload = false"
      :visible.sync="dialog.show">
      <el-form ref="form" :model="form">
        <el-form-item :label="`${manner[dialog.type].text}金额（元）`" prop="amount" :rules="rule">
          <el-input :placeholder="`请输入${manner[dialog.type].text}金额`" v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" placeholder="请输入备注" v-model.trim="form.remark"></el-input>
        </el-form-item>
        <el-form-item class="text-right">
        <el-button type="primary" :loading="dialog.btnload" @click="subOperating">确定</el-button>
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
      workId: 0, //员工id
      info: {}, //收成信息
      dialog: {
        show: false, //是否显示
        type: 0, //操作方式[0:充值，1:奖励，2:处罚]
        btnload: false //确定中
      },
      // 操作方式
      manner: [
        { title: "给取送员充值", text: "充值", postUrl: "profitDetail/recharge" },
        { title: "给取送员奖励", text: "奖励", postUrl: "profitDetail/reward" },
        { title: "处罚取送员", text: "处罚", postUrl: "profitDetail/punish" }
      ],
      form: {
        amount: "", //金额
        remark: "" //备注
      },
      rule: [
        { required: true, message: "请输入金额" },
        {
          validator: (rule, value, callback) => {
            validate.amount(value, 2, 0.01, 999999)
              ? callback()
              : callback(new Error("金额必须是大于0的数字（最多保留2位小数）"));
          },
          trigger: "blur"
        }
      ]
    };
  },
  created() {
    this.workId = this.$route.params.id;
    this.getInfo();
  },
  methods: {
    // 获取概况信息
    getInfo() {
      this.$store
        .dispatch("post", {
          uri: "profitDetail/income",
          data: {
            workId: this.workId
          }
        })
        .then(res => {
          this.info = res.data.data;
        });
    },
    // 上传操作信息
    postOperating() {
      return this.$store.dispatch("post", {
        uri: this.manner[this.dialog.type].postUrl,
        data: {
          workId: this.workId,
          amount: calculation.accMul(this.form.amount, 100),
          remark: this.form.remark
        }
      });
    },
    // 操作取送员
    operating(val) {
      this.dialog.type = val;
      this.dialog.show = true;
      this.$nextTick(_ => {
        this.$refs.form.resetFields();
      });
    },
    // 提交操作结果
    subOperating() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.dialog.btnload = true;
          let result = await this.postOperating();
          msg.success(this.manner[this.dialog.type].text + "成功！");
          let money =
            this.dialog.type === 2
              ? calculation.accMul(this.form.amount, -100)
              : calculation.accMul(this.form.amount, 100);
          this.info.balance += money;
          this.dialog.show = false;
        }
      });
    }
  }
};
</script>
