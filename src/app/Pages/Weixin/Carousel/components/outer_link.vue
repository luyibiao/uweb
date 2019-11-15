<style lang="less" scoped>
.link-switch {
  padding: 15px 0;
}
.link-logo {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>

<template>
  <div>
    <p class="text-center m-b">外链菜单</p>
    <el-row class="link-switch b-t b-b">
      <el-col :span="8">
        微信首页外链菜单
      </el-col>
      <el-col :span="10">
        <auth perm="weixin.carousel.update">
          <el-switch v-model="openStatus"
                   active-color="#13ce66"
                   inactive-color="#dcdcdc"
                   active-text="启用"
                   inactive-text="停用"
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
      <el-col :span="6">
        <auth perm="weixin.carousel.update">
          <el-button v-if="status && list.length < 4"
                   size="small"
                   type="primary"
                   @click="openDialog(null)">添加外链菜单</el-button>
        </auth>
      </el-col>
    </el-row>
    <el-row class="link-switch b-b m-b-md" v-show="status">
      <el-col :span="8">
        置顶
      </el-col>
      <el-col :span="10">
        <el-switch v-model="topOutsideLink"
           active-color="#13ce66"
           inactive-color="#dcdcdc"
           active-text="开启"
           inactive-text="关闭"
           :active-value="1"
           :inactive-value="0"
           @change="updateTop">
        </el-switch>
      </el-col>
      <el-col :span="6">
      </el-col>
    </el-row>
    <el-table v-show="status"
              class="ukao-el-table"
              :data="list">
      <el-table-column prop="name"
                       label="名称">
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <img class="link-logo"
               v-bind:src="scope.row.imgPath">
        </template>
      </el-table-column>
      <el-table-column label="公众号链接">
        <template slot-scope="scope">
          <el-popover
                      placement="bottom-start"
                      width="200"
                      trigger="hover">
            <p v-text="scope.row.link"></p>
            <div class="dis-inline text-primary" slot="reference">
              <span>查看链接</span>
              <i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="小程序跳转页面链接">
        <template slot-scope="scope">
          <el-popover
            placement="bottom-start"
            width="300"
            trigger="hover"
            :content="scope.row.appLink || '无链接地址'">
            <div class="dis-inline text-primary" slot="reference">
              <span>查看链接</span>
              <i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="显示序号"
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
    <vBanner :isShow="!status"
             title="未启用"
             msg="若要启用该功能，请在上方点击“启用”按钮"></vBanner>
    <el-dialog class="ukao-dialog"
               title="外链菜单"
               :visible.sync="dialogVisible"
               size="small">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="160px">
        <el-form-item label="外链名称"
                      prop="name">
          <el-input class="w-lg"
                    v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="外链图标"
                      prop="imgPath">
          <Uploader class="u-avatar-uploader"
                    tip="只能上传jpg/png文件，尺寸100像素*100像素，且不超过500kb"
                    size="500"
                    :path="form.imgPath"
                    :beforeFn="beforeUpload"
                    :successFn="successFn" />
        </el-form-item>
        <el-form-item label="小程序路径" prop="appLink">
          <el-select v-model="form.appLink" placeholder="请选择" @change="updateMiniPath">
            <el-option
              v-for="(item, index) in comUrls"
              :key="item.pagepath"
              :label="item.name"
              :value="item.pagepath">
            </el-option>
          </el-select>
          <div class="m-t-xxs">
            <el-input class="w-lg" v-model="form.appLink"></el-input>
          </div>
          <!--<div class="text-xs text-muted">页面路径：{{form.appLink}}</div>-->
        </el-form-item>
        <el-form-item label="公众号链接"
                      prop="link">
          <el-input class="w-lg"
                    type="textarea"
                    placeholder="http://或者https://开头"
                    v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="显示序号"
                      prop="sortNo">
          <el-input class="w-lg"
                    v-model.number="form.sortNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" :loading="saving"
                     @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import consts from '@/utils/consts'
import auth from '@/utils/auth'

import vBanner from "../../banner";
import Uploader from "@/components/Uploader/index.vue";

export default {
  props: {
    // 数据列表
    list: {
      default: _ => [],
      type: Array
    },
    // 启用状态
    status: {
      default: false,
      type: [Number, Boolean]
    },
    top: {
      default: false,
      type: [Number, Boolean]
    }
  },
  watch: {
    status(n) {
      this.openStatus = n ? 1 : 0;
    },
    top(n) {
      this.topOutsideLink = n ? 1 : 0;
    }
  },
  data() {
    return {
      comUrls:[],//小程序路径下拉选
      openStatus: 0,
      topOutsideLink: 0,
      dialogVisible: false,
      form: {
        id: "",
        name: "",
        imgPath: "",
        link: "",
        sortNo: 0,
        scene: 13
      },
      rules: {
        name: [
          { required: true, message: "请输入外链名称" },
          { min: 2, max: 32, message: "长度在 2 到 32 个字符" }
        ],
        link: {
          validator: (rule, value, callback) => {
            if (value) {
              /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(
                value
              )
                ? callback()
                : callback(new Error("链接格式错误"));
            } else {
              callback(new Error("请输入链接"));
            }
          }
        },
        imgPath: { required: true, message: "请上传外链图片" },
        sortNo: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                validate.amount(value, 0, 1, 999999999)
                  ? callback()
                  : callback(new Error("序号应该是大于 0 的整数"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      saving: false
    };
  },
  methods: {
    // 更新外链状态
    changeStatus() {
      msg.confirm({
        msg: `确认${this.openStatus ? "开启" : "关闭"}首页外链菜单？`,
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
    // 提交外链状态修改
    postStatus() {
      return this.$store.dispatch("post", {
        uri: "mercCityParam/update",
        data: {
          showOutsideLink: this.openStatus
        }
      });
    },
    updateTop() {
      msg.confirm({
        msg: `确认${this.topOutsideLink ? "开启" : "关闭"}置顶首页外链菜单？`,
        confirmFn: _ => {
          this.$store.dispatch("post", {
            uri: "mercCityParam/update",
            data: {
              topOutsideLink: this.topOutsideLink
            }
          }).then(res => {
            this.$emit("update:top", this.topOutsideLink == 1);
            msg.success();
          });
        },
        cancelFn: _ => {
          this.topOutsideLink = this.topOutsideLink ? 0 : 1;
        }
      });
    },
    // 打开弹窗
    openDialog(item, fn) {
      if(this.comUrls.length < 1){
        this.queryMenuUrl();
      }else{
        this.dialogVisible = true;
      }
      if (this.$refs.form) {
        this.form.id = "";
        this.form.name = "";
        this.form.link = "";
        this.form.imgPath = "";
        this.form.sortNo = 0;
        this.form.scene = 13;
        this.$refs.form.resetFields();
      }
      item && fn && fn(item);
    },
    // 获取单个外链数据
    getItemData(item) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = item[key];
      });
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
              this.$emit("updataList");
              msg.success();
            });
        }
      });
    },
    // 保存
    submitForm(formName) {
      this.saving = true;
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          this.$store
            .dispatch("post", {
              uri: this.form.id ? "clientAdve/update" : "clientAdve/add",
              data: this.form
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
    // 取消
    cancel() {
      this.dialogVisible = false;
    },
    beforeUpload() {
      this.saving = true;
    },
    // 提交图片成功
    successFn(file) {
      if (file && file[0]) this.form.imgPath = file[0];
      this.saving = false;
    },
    queryMenuUrl() {
      this.$store.dispatch('post', {
        uri : 'sysDicKey/keyList',
        data: {code:'WX_MENU_URL'}
      }).then((res) =>{
        if (res.data.data) {
          let mList = res.data.data;
          for (let i = 0; i < mList.length; i ++) {
            let m = mList[i];
            if(m.attr1){
              this.comUrls.push({'name': m.text, 'url': consts.WX_URL + m.val + '?u_code=' + auth.getMercInfo().code, 'pagepath': m.attr1});
            }
          }
        }
        this.dialogVisible = true;
      })
    },
    updateMiniPath(idx) {
      for(let item in this.comUrls){
        let obj = this.comUrls[item];
        if(obj.pagepath == idx){
          if (!this.form.name) {
            this.form.name = obj.name;
          }
          this.form.link = obj.url;
          break;
        }
      }
      this.form.appLink = idx;
    }
  },
  components: {
    vBanner,
    Uploader
  }
};
</script>

