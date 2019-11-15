<style lang="less" scoped>
.wap-bg {
  width: 350px;
  height: 625px;
  position: relative;
  background: url("/static/img/weixin_public.png") no-repeat center center;
  background-size: 350px 625px;
  .wap-content {
    position: absolute;
    top: 18px;
    left: 0;
    right: 0;
  }
  .top-text {
    line-height: 42px;
    text-align: center;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
  }
}
.main {
  margin-left: 440px;
  overflow: hidden;
}
.b-h {
  line-height: 1.5;
}
.text {
  background-color: #fff;
  height: 565px;
  overflow: auto;
}
.quill-editor {
  max-width: 800px;
}
</style>

<template>
  <div class="clearfix">
    <div class="pull-left">
      <div class="wap-bg b-a">
        <div class="wap-content">
          <div class="head">
            <p class="top-text">{{form.title || '友商推广计划'}}</p>
          </div>
          <QContent class="text" v-model="form.content"></QContent>
        </div>
      </div>
      <p class="m-t-md text-center">微信预览界面</p>
    </div>
    <div class="main">
      <el-form label-width="100px" :model="form" ref="form">
        <el-form-item label="页面标题" prop="title" :rules="[
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]">
          <el-input class="w-xxl" v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div class="b-h">
            <Quill ref="myEditor" readonly="true" v-model="form.content" placeholder="请输入内容"></Quill>
            <auth perm="marketing.friend.plan.update">
              <el-button type="text" @click="dialog.show = true">查看模板</el-button>
            </auth>
          </div>
        </el-form-item>
        <el-form-item>
          <auth perm="marketing.friend.plan.update">
            <el-button type="primary" @click="submitPlan">保存</el-button>
          </auth>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="友商计划说明文档"
      :visible.sync="dialog.show">
      <div>
        <p>&nbsp;以下友商计划说明模板，请根据情况自行修改，仅供参考。</p><p>———————————</p>
        <QContent class="text" v-model="dialog.model"></QContent>
      </div>
      
      <div slot="footer">
        <el-button type="primary" @click="replaceModel">使用模板替换当前内容</el-button>
        <el-button @click="dialog.show = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import Quill from "@/components/Quill";
import QContent from "@/components/Quill/content";

export default {
  data() {
    return {
      form: {
        title: "",
        content: ""
      },
      plan: {},
      dialog: {
        show: false,
        model:
          "<p>小伙伴，欢迎加入我们！</p><p><br></p><p>我们诚挚邀请你加入我们的友商推广计划，无任何成本即可成为XXX的友商，一起分享收获的喜悦。你只需将XX公众号分享推荐给他人，就能挣得属于自己的利润。</p><p><br></p><p>1.&nbsp;业绩说明</p><p>1）买家通过友商分享链接关注微信公众号或成交，即算作友商的业绩；</p><p>2）订单交易完成前发生退款的订单，相应的友商业绩将扣除相应的退款金额；</p><p><br></p><p>2.&nbsp;结算说明</p><p>1）订单提成为X%（订单不含取送费与优惠券）；</p><p>2）加粉提成为X元/个；</p><p>3）充值提成为X%；</p><p>4）每月XX号前，我们将会和各友商核算业绩；</p><p>5）每月XX号前，我们会将业绩奖励打入各友商提供的银行账号。</p><p><br></p><p>3.&nbsp;其他说明</p><p>2）有任何疑问，请直接在微信公众号内询问或直接致电；</p><p>4）不传播或者扩散有关于政治、色情等任何违法的信息，一经发现，直接踢你出局，如果触犯任何法律相关问题，本公司不负任何责任；</p><p>5）以上内容解释权归本本公司所有。</p><p><br></p><p>4.&nbsp;联系方式</p><p>1）联络人：XXX</p><p>2）手机：1234567889</p><p>3）分销员QQ交流群：12345678</p><p>4）邮箱：xxx@xxx.com</p><p>无论是销售、对账，还是结算问题，请通过以上方式咨询。&nbsp;</p>"
      }
    };
  },
  created() {
    this.getPlan();
  },
  methods: {
    // 获取提交计划
    getPlan() {
      this.$store
        .dispatch("get", {
          uri: "friendMarketing/recruit/info"
        })
        .then(res => {
          this.plan = res.data.data || {};
          Object.keys(this.form).forEach(item => {
            this.form[item] = this.plan[item] || "";
          });
        });
    },
    // 保存计划
    savePlan() {
      this.$store
        .dispatch("post", {
          uri: "friendMarketing/recruit/save",
          data: {
            ...this.form
          }
        })
        .then(res => {
          msg.success("保存成功！");
        });
    },
    // 提交计划
    submitPlan() {
      if (/\S/.test(this.editor.getText())) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.savePlan();
          }
        });
      } else {
        msg.warning("内容不能为空");
      }
    },
    // 替换模板
    replaceModel() {
      this.form.content = this.dialog.model;
      this.dialog.show = false;
    }
    // 复制链接地址
    // copy(e) {
    //   if (this.plan.link) {
    //     this.$refs.copy.$refs.input.select();
    //     document.execCommand("Copy");
    //     msg.success("复制链接地址成功！");
    //   } else {
    //     msg.warning("没有可复制的链接地址！");
    //   }
    // }
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor;
    }
  },
  components: {
    Quill,
    QContent
  }
};
</script>

// 招募计划