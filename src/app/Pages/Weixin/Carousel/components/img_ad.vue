<template>
  <div>
    <p class="text-center m-b">广告</p>
    <el-row class="padder-v b-t b-b">
      <el-col :span="18">
        微信首页广告
      </el-col>
      <el-col :span="6">
        <el-button v-if="list && list.length < 1"
                   size="small"
                   type="primary"
                   @click="openDialog(null)">添加广告</el-button>
      </el-col>
    </el-row>

    <el-table class="ukao-el-table"
              :data="list">
      <el-table-column label="图片/视频">
        <template slot-scope="scope">
          <img v-if="!scope.row.fileType || scope.row.fileType == 'image'" class="thumb-xl" :src="scope.row.imgPath"/>
          <video width="128px" v-else :poster="scope.row.posterPath"
                 :src="scope.row.imgPath" @click="openSrc(scope.row.imgPath)"></video>
        </template>
      </el-table-column>
      <el-table-column label="公众号链接">
        <template slot-scope="scope">
          <el-popover
                      placement="bottom-start"
                      width="300"
                      trigger="hover"
                      :content="scope.row.link || '无链接地址'">
            <div class="dis-inline text-primary" slot="reference">
              <span>查看链接</span>
              <i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="小程序跳转页面">
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
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
      <!--<el-table-column label="显示顺序"-->
                       <!--prop="sortNo"></el-table-column>-->
      <el-table-column width="160px"
                       label="操作">
        <template slot-scope="scope">
          <auth perm="weixin.carousel.update">
            <el-button type="primary"
                     size="small"
                     @click="openDialog(scope.row,getItemData)">编辑</el-button>
            <el-button type="danger"
                     size="small"
                     @click="deleteImgAd(scope.row.id)">删除</el-button>
            <template slot="noPerm">-</template>
          </auth>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="ukao-dialog"
               :title="form.id ? '修改广告': '新建广告'"
               :visible.sync="dialogVisible"
               size="small">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="160px">
        <el-form-item label="小程序路径"
                      prop="appLink"
        >
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
          <el-input placeholder="http://或者https://开头"
                    class="w-lg"
                    type="textarea"
                    v-model="form.link"/>
        </el-form-item>
        <!--<el-form-item label="序号"-->
                      <!--prop="sortNo">-->
          <!--<el-input class="w-lg"-->
                    <!--v-model.trim="form.sortNo"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="广告图片/视频"
                      prop="imgPath">
          <Uploader class="u-avatar-uploader"
                    tip="图片只能上传jpg/png文件，建议宽度750像素；视频为mp4格式，大小不超过20M"
                    size="20480"
                    accept="movie|image"
                    :path="form.imgPath"
                    :fileType="form.fileType"
                    :beforeFn="beforeUpload"
                    :successFn="successFn" />
        </el-form-item>
        <el-form-item v-if="form.fileType == 'video'" label="视频封面"
                      prop="imgPath">
          <Uploader class="u-avatar-uploader"
                    tip="图片只能上传jpg/png文件，建议宽度750像素；大小不超过2M"
                    size="2048"
                    accept="image"
                    :path="form.posterPath"
                    :beforeFn="beforeUpload"
                    :successFn="postSuccessFn" />
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
import Uploader from "@/components/Uploader/index.vue";
import consts from '@/utils/consts'
import auth from '@/utils/auth'

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
    }
  },
  watch: {
    status(n) {
      this.openStatus = n ? 1 : 0;
    }
  },
  data() {
    return {
      comUrls:[],//小程序路径下拉选
      openStatus: 0,
      dialogVisible: false,
      form: {
        id: "",
        imgPath: "",
        posterPath: "",
        appLink:'',
        sortNo: 0,
        fileType: 'image',
        link: "",
        pageIndex: 0,
        scene: 14
      },
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
        imgPath: { required: true, message: "请上广告图片/视频" },
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
      saving: false
    };
  },
  methods: {
    // 开启弹窗
    openDialog(item, fn) {
      if(this.comUrls.length < 1){
        this.queryMenuUrl();
      }else{
        this.dialogVisible = true;
      }
      if (this.$refs.form) {
        this.form.id = "";
        this.form.name = "";
        this.form.fileType = "image";
        if (item) {
          this.form.fileType = item.fileType;
        }
        this.form.imgPath = "";
        this.form.posterPath = "";
        this.form.appLink = "";
        this.form.link = "";
        this.form.sortNo = 0;
        this.form.scene = 14;
      }
      item && fn && fn(item);
    },
    openSrc(src) {
      window.open(src);
    },
    // 获取单个轮播图数据
    getItemData(item) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = item[key];
      });
    },
    // 删除单个轮播图片
    deleteImgAd(id) {
      msg.confirm({
        msg: "此操作将永久删除选中项, 是否继续?",
        confirmFn: _ => {
          this.$store
            .dispatch("post", {
              uri: "clientAdve/delete",
              data: {id}
            }).then(res => {
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
              data: this.form,
              forceResolve: true
            }).then(res => {
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
    postSuccessFn(file) {
      if (file && file[0]) this.form.posterPath = file[0];
      this.saving = false;
    },
    // 提交图片成功
    successFn(file, type) {
      if (file && file[0]) this.form.imgPath = file[0];
      this.form.fileType = type;
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
        let obj = this.comUrls[item]
        if( obj.pagepath == idx){
          this.form.name = obj.name;
          this.form.link = obj.url
          break;
        }
      }
      this.form.appLink = idx;
    }
  },
  components: {
    Uploader
  }
};
</script>

