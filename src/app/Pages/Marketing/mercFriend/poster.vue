<style lang="less" scoped>
.preview {
  width: 320px;
  overflow: hidden;
  .poster {
    height: 320px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .avatar {
    padding: 9px 14px;
    width: 30px;
  }
  .qr {
    width: 120px;
    height: 120px;
    position: relative;
    background-color: #f2f2f2;
    .word {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      height: 40px;
      margin: auto;
    }
  }
}
.main {
  margin-left: 400px;
  overflow: hidden;
  max-width: 680px;
}
</style>
<template>
  <div>
    <div class="pull-left preview b-a">
      <div class="poster" :style="form.imgPath ? `background-image:url(${form.imgPath});`:'background-color: #f2f2f2;'" ></div>
      <div class="wrapper-md clearfix">
        <div class=" pull-left">
          <div class="avatar text-center b-a text-muted">头像区域</div>
          <p class="m-t-sm" style="width:130px;">{{form.title}}</p>
        </div>
        <div class="qr pull-right">
          <div class="word text-center text-muted">
            <p >自动生成</p>
            <p>二维码区域</p>
          </div>
        </div>
      </div>
    </div>
    <div class="main b-a r-3x padder-v">
      <el-form :model="form" ref="form" label-width="140px">
        <el-form-item label="海报功能">
          <el-switch v-model="status" active-text="开启" inactive-text="关闭" active-color="#13ce66"  inactive-color="#ff4949" @change="changeStatus">
          </el-switch>
        </el-form-item>
        <auth perm="marketing.friend.post.update">
          <el-form-item label="选择图片" required>
            <Uploader
              tip="最佳尺寸：640像素*640像素"
              ref="upload"
              :path="form.imgPath"
              :manual="true"
              :changeFn="changeImgPath"
              :saveSuccessFn="saveImgSuccess"></Uploader>
            <p class="text-xs text-muted">建议上传正方形图片，尺寸不匹配时，图片将被压缩或者拉伸</p>
          </el-form-item>
        </auth>
        <el-form-item label="编辑文字" prop="title" :rules="[
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ]">
          <el-input class="w-xxl" placeholder="请输入内容" v-model.trim="form.title"></el-input>
          <p class="text-xs text-muted">编辑一段文案引导用户关注公众号，最多不超过40个字</p>
        </el-form-item>
        <el-form-item>
          <auth perm="marketing.friend.post.update">
            <el-button type="primary" :loading="saving" @click="submitPlan">保存</el-button>
          </auth>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      // 开启状态
      status: false,
      // 表单
      form: {
        imgPath: "",
        title: ""
      },
      saving: false, //保存中
      poster: {} //海报信息
    };
  },
  created() {
    this.getPoster();
  },
  methods: {
    // 获取海报
    getPoster() {
      this.$store
        .dispatch("get", {
          uri: "friendMarketing/poster/info"
        })
        .then(res => {
          this.poster = res.data.data || {};
          this.status = this.poster.status === 1;
          Object.keys(this.form).forEach(item => {
            this.form[item] = this.poster[item] || "";
          });
        });
    },
    // 保存
    savePoster() {
      this.$store
        .dispatch("post", {
          uri: "friendMarketing/poster/save",
          data: {
            status: this.status ? 1 : 0,
            ...this.form
          }
        })
        .then(res => {
          msg.success("保存成功！");
          this.saving = false;
        });
    },
    // 提交计划
    submitPlan() {
      if (this.form.imgPath) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.saving = true;
            if (this.form.imgPath != this.poster.imgPath) {
              this.$refs.upload.$children[0].submit();
            } else {
              this.savePoster();
            }
          }
        });
      } else {
        msg.warning("请选择图片");
      }
    },
    changeStatus(value) {
      let data = value ? "启用" : "关闭";
      msg.info(`已设置${data}海报功能，请保存！`);
    },
    // 选择的图片改变
    changeImgPath(file) {
      this.form.imgPath = file.url || "";
    },
    // 上传图片成功回调
    saveImgSuccess(data) {
      this.form.imgPath = data.data.path;
      this.savePoster();
    }
  },
  components: {
    Uploader
  }
};
</script>
