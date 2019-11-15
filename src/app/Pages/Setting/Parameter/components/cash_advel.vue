<template>
<div>
  <el-row class="padder-v b-t b-b">
    <el-col :span="8">
      通洗智店副屏轮播图
    </el-col>
    <el-col :span="10">
      <!--<auth perm="weixin.carousel.update">-->
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
     <!-- </auth>-->
    </el-col>
    <el-col :span="6">
      <el-button v-if="openStatus && list.length < 9"
                 size="small"
                 type="primary"
                 @click="openDialog(null)">添加轮播图片</el-button>
    </el-col>
  </el-row>
  <vBanner class="m-t-md"
           :isShow="!openStatus"
           title="未启用"
           msg="若要启用该功能，请在上方点击“启用”按钮"></vBanner>
  <el-table class="ukao-el-table"
            v-show="openStatus"
            :data="list">
    <el-table-column label="图片">
      <template slot-scope="scope">
        <img class="thumb-xl"
             v-bind:src="scope.row.imgPath">
      </template>
    </el-table-column>

    <el-table-column label="显示顺序"
                     prop="sortNo"></el-table-column>
    <el-table-column width="160px"
                     label="操作">
      <template slot-scope="scope">
        <auth perm="weixin.carousel.update">
          <el-button type="primary"
                     size="small"
                     @click="openDialog(scope.row,getItemData)">编辑</el-button>
          <el-button type="danger"
                     size="small"
                     @click="deleteClientAdve(scope.row.id)">删除</el-button>
          <template slot="noPerm">-</template>
        </auth>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog class="ukao-dialog"
             :title="form.id ? '修改轮播图': '添加轮播图'"
             :visible.sync="dialogVisible"
             size="small">
    <el-form :model="form"
             :rules="rules"
             ref="form"
             label-width="160px">
      <!--<el-form-item label="链接"
                    prop="link">
        <el-input placeholder="http://或者https://开头"
                  class="w-lg"
                  type="textarea"
                  v-model="form.link">
        </el-input>
      </el-form-item>-->
      <el-form-item label="序号"
                    prop="sortNo">
        <el-input class="w-lg"
                  v-model.trim="form.sortNo"></el-input>
      </el-form-item>
      <el-form-item label="广告图片"
                    prop="imgPath">
        <Uploader class="u-avatar-uploader"
                  tip="尺寸: 1170**1080像素，小于1M，支持jpg,png,jpeg格式"
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
import vBanner from "../../../Weixin/banner";
import Uploader from "@/components/Uploader/index.vue";
import validate from "@/utils/helpers/validate";

export default {
  data () {
    return {
      list:[],
      dialogVisible: false,
      openStatus: 0,
      form: {
        id: "",
        imgPath: "",
        link: "",
        sortNo: 0,
        scene: 21
      },
      saving: false,
      rules: {
        link: {
          validator: (rule, value, callback) => {
            if (value) {
              /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(
                value
              )
                ? callback()
                : callback(new Error("链接格式错误"));
            } else {
              callback();
            }
          }
        },
        imgPath: { required: true, message: "请上广告图片" },
        sortNo: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                validate.amount(value, 0, 0, 999999999)
                  ? callback()
                  : callback(new Error("序号应该是大于等于0的整数"));
              } else {
                callback();
              }
            }
          }
        ]
      },
    }
  },
  created () {
    this.queryRotationChart();
    this.queryClientAdve();
  },
  watch: {
    status(n) {
      this.openStatus = n ? 1 : 0;
    }
  },
  methods: {
    queryRotationChart(){
      //获取运费相关信息
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.openStatus = res.data.data.rotationChart;
        })
    },
    queryClientAdve(){
      this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene:21
          }
        })
        .then(res => {
          this.list = res.data.data.list;
        })
    },
    // 提交轮播图开关状态
    postStatus() {
      return this.$store.dispatch("post", {
        uri: "mercCityParam/update",
        data: {
          rotationChart: this.openStatus
        }
      });
    },
    changeStatus() {
      msg.confirm({
        msg: `确认${this.openStatus ? "开启" : "关闭"}副屏轮播图？`,
        confirmFn: _ => {
          this.postStatus().then(res => {
            //this.$emit("update:status", this.openStatus == 1);
            msg.success();
          });
        },
        cancelFn: _ => {
          this.openStatus = this.openStatus ? 0 : 1;
        }
      });
    },
    // 开启弹窗
    openDialog(item, fn) {
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.form.id = "";
        this.form.imgPath = "";
        this.form.link = "";
        this.form.sortNo = 0;
        this.form.scene = 21;
        this.$refs.form.resetFields();
      }
      item && fn && fn(item);
    },
    // 保存
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
                msg.success();
                this.queryClientAdve();
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
    // 取消
    cancel() {
      this.dialogVisible = false;
    },
    // 提交图片成功
    successFn(file) {
      if (file && file[0]) this.form.imgPath = file[0];
      this.$refs.form.validateField("imgPath");
    },
    // 删除单个轮播图片
    deleteClientAdve(id) {
      msg.confirm({
        msg: "此操作将永久删除选中项, 是否继续?",
        confirmFn: _ => {
          this.$store
            .dispatch("post", {
              uri: "clientAdve/delete",
              data: {
                id
              }
            })
            .then(res => {
              // 更新数据列表
              msg.success();
              this.queryClientAdve();
            });
        }
      });
    },

  },
  components: {
    vBanner,
    Uploader
  }
}
</script>

</style>
