<template>
  <div>
    <p class="text-center m-b">预约智柜</p>
    <el-row class="padder-v b-t"
            :class="{'b-b' : !status}">
      <el-col :span="12">
        微信首页预约智柜
      </el-col>
      <el-col :span="12">
        <auth perm="weixin.carousel.update">
          <el-switch v-model="openStatus"
                   active-color="#13ce66"
                   inactive-color="#dcdcdc"
                   active-text="已启用"
                   inactive-text="未启用"
                   :active-value="1"
                   :inactive-value="0"
                   @change="changeStatus">
          </el-switch>
          <template slot="noPerm">
            <template v-if="openStatus == 1">
              <span class="text-success">{{openStatus | getValText('DATE_STATUS')}}</span>
            </template>
            <template v-else>
              <span class="text-danger">{{openStatus | getValText('DATE_STATUS')}}</span>
            </template>
          </template>
        </auth>
      </el-col>
    </el-row>
    <vBanner class="m-t-md"
             :isShow="!status"
             title="未启用"
             msg="若要启用该功能，请在上方点击“启用”按钮"></vBanner>
    <table class="ukao-table b-t w-full"
           v-show="status">
      <tbody>
        <tr>
          <td>
            <span class="thumb">图片</span>
          </td>
          <td class="text-center">
            <img v-if="list[0]"
                 class="w-sm"
                 :src="list[0].imgPath">
            <span v-else>暂无图片请上传!</span>
          </td>
          <td class="text-muted text-xs">建议上传400像素 * 200像素的图像</td>
          <td>
            <auth perm="weixin.carousel.update">
              <el-button type="primary"
                       @click="openDialog(list[0] || '',getItemData)">{{list[0] ? '修改' : '上传'}}</el-button>
            </auth>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog class="ukao-dialog"
               title="智柜图片"
               :visible.sync="dialogVisible"
               size="small">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="160px">
        <el-form-item label="智柜图片"
                      prop="imgPath">
          <Uploader class="u-avatar-uploader"
                    tip="请上传jpg/png文件，建议上传400像素 * 200像素的图像，且不超过500kb"
                    size="500"
                    :path="form.imgPath"
                    :successFn="successFn" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary"
                     :loading="saving"
                     @click="submitForm('form')">{{saving ? '保存中' : '保存'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import msg from "@/utils/msg";

import vBanner from "../../banner";
import Uploader from "@/components/Uploader/index.vue";

export default {
  props: {
    // 启用状态
    status: {
      default: false,
      type: [Number, Boolean]
    },
    // 数据列表
    list: {
      default: _ => [],
      type: Array
    }
  },
  watch: {
    status(n) {
      this.openStatus = n ? 1 : 0;
    }
  },
  data() {
    return {
      openStatus: 0,
      dialogVisible: false,
      form: {
        id: "",
        imgPath: "",
        scene: 12
      },
      rules: {
        imgPath: { required: true, message: "请上传智柜图片" }
      },
      saving: false
    };
  },
  created() {
    this.openStatus = this.status;
  },
  methods: {
    // 打开弹窗
    openDialog(item, fn) {
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.form.id = "";
        this.form.imgPath = "";
        this.form.scene = 12;
        this.$refs.form.resetFields();
      }
      item && fn && fn(item);
    },
    // 获取单个数据
    getItemData(item) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = item[key];
      });
    },
    // 更新状态
    changeStatus() {
      msg.confirm({
        msg: `确认${this.openStatus ? "开启" : "关闭"}微信首页预约智柜？`,
        confirmFn: _ => {
          this.postStatus().then(res => {
            this.$emit("update:status", this.openStatus == 1);
            msg.success();
          });
        },
        cancelFn: _ => {
          this.openStatus = this.openStatus ? 0 : 1;
        }
      });
    },
    // 提交微信首页预约智柜状态修改
    postStatus() {
      return this.$store.dispatch("post", {
        uri: "mercCityParam/update",
        data: {
          showBookCupboard: this.openStatus
        }
      });
    },
    // 上传图片成功
    successFn(file) {
      if (file && file[0]) this.form.imgPath = file[0];
      this.$refs.form.validateField("imgPath");
    },
    submitForm(formName) {
      this.saving = true;
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          this.$store
            .dispatch("post", {
              uri: this.form.id ? "clientAdve/update" : "clientAdve/add",
              data: this.form,
              forceResolve: true
            })
            .then(res => {
              if (200 === res.data.httpCode) {
                this.$emit("updataList");
                msg.success();
                this.dialogVisible = false;
              } else {
                msg.error(res.data.msg);
              }
              this.saving = false;
            });
        } else {
          this.saving = false;
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  components: {
    vBanner,
    Uploader
  }
};
</script>

