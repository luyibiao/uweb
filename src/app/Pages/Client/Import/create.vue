<style lang="less" scoped>
/* 说明 */
.note{
	display: inline-block;
	padding: 15px 20px;
	border-radius: 8px;
	background: #fff3d3;
  color: #f00;
  line-height: 28px;
}
.tips-warn{
  text-indent: 2em;
  color: #f00;
  font-size: 16px;
}
.timing{
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #f00
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/" class="m-b-md">
      <el-breadcrumb-item to="/client/import"><i class="el-icon-arrow-left icon-smaller"></i>导入记录</el-breadcrumb-item>
      <el-breadcrumb-item>新建批量导入</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="note m-b-md">
      <div class="pull-left">注：</div>
      <div class="m-l-lg">
        <p>导入数据时按门店会员折扣分为不同表格，再把表格按照折扣从高到低顺序分批次导入；</p>
        <p>最新导入的客户不会覆盖已导入的客户数据；</p>
        <p>导入失败的客户请“下载失败数据”，调整后按模板要求重新上传，切记不要上传原始表格数据；</p>
        <p>确定导入的数据不能删除，若需要删除请联系客服并支付费用（根据删除数据的工作量计算费用）</p>
      </div>
    </div>
    <el-form ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属门店" prop="storeId" :rules="[{ required: true, message: '请选择门店'}]">
          <el-select
            placeholder="请选择门店"
            v-model="form.storeId">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="text" @click="$router.push('/store/new_store')">去添加</el-button>
          <!-- <p class="text-muted text-xs l-h m-t-xs">重复导入时，会覆盖上次导入的数据（余额，积分，会员折扣等）</p> -->
        </el-form-item>
          <el-form-item label="分组">
            <el-select clearable
                       v-model="form.groupId"
                       placeholder="请选择分组">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="text" @click="$router.push('/client/group')">去添加</el-button>
          </el-form-item>
          <el-form-item label="团体">
            <el-select v-model="form.unionId"
                       filterable @change="chgUnion"
                       clearable
                       placeholder="全部">
              <el-option v-for="item in unionList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-button type="text" @click="$router.push('/marketing/group/list')">去添加</el-button>
            <p class="text-muted text-sm">若选择团体设置统一会员卡，则会覆盖当前所选择的会员卡</p>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="会员卡" prop="cardId" :rules="[{ required: true, message: '请选择会员卡'}]">
            <el-select :disabled="editCardDisable"
              placeholder="请选择会员卡"
              v-model="form.cardId">
              <el-option
                v-for="item in cardList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                {{item.name}}（{{item.level}}级，{{item.discount | cardDiscount(item.discountType)}}）
              </el-option>
            </el-select>
            <el-button type="text" @click="$router.push('/client/card/new')">去添加</el-button>
          </el-form-item>
          <el-form-item label="标签">
            <el-select clearable
                       v-model="form.tagId"
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       placeholder="输入搜索标签">
              <el-option
                v-for="item in labelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="text" @click="$router.push('/client/label')">去添加</el-button>
          </el-form-item>
          <el-form-item label="享受会员价" v-if="mercInfo.isOpenVipPrice">
            <el-radio-group v-model="form.isVip">
              <el-radio :label="1">享受</el-radio>
              <el-radio :label="0">不享受</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" style="display: none">
        <el-input 
          type="textarea" 
          class="w-xl"
          :rows="3"
          v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="导入识别字段" required>
        <el-radio-group v-model="form.required">
          <el-radio :label="1">手机号</el-radio>
          <el-radio :label="2">会员卡</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据模板文件" prop="fileCode" :rules="[{ required: true, message: '请上传EXCEL文件',trigger: 'change'}]">
        <el-upload
          class="w-xxl"
          drag
          :with-credentials="true"
          :before-upload="beforeUpload"
          :on-success="successUpload"
          :on-error = "errorUpload"
          :on-remove = "removeFile"
          :action="uploadUrl">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__text">最后一次上传的模板数据为最终导入数据。</div>
          <!-- <el-button type="primary">点击上传</el-button> -->
          <div class="text-muted text-xs l-h" slot="tip">
            只能上传EXCEL文件，
            <el-button type="text" size="small" @click="downloadTemplate">下载模板，{{form.required === 1 ? '手机号' : '会员卡'}}必填</el-button>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item >
        <el-button type="primary"  @click="submit('form',openDialog)">确定导入</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      custom-class="ukao-dialog"
      @close="closeDialog"
      :visible.sync="dialogVisible">
      <p class="tips-warn">确定导入的数据不能删除，若需要删除请联系客服并支付费用（根据删除数据的工作量计算费用）</p>
      <p class="timing m-t-lg" v-show="timing > 0">{{timing}}</p>
      <div slot="footer" class="text-center">
        <el-button @click="dialogVisible = false">返回</el-button>
        <el-button type="primary" :disabled="timing > 0" @click="postFile" :loading="uploading">确定导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import auth from '@/utils/auth';
export default {
  data() {
    return {
      form: {
        cardId: "",
        storeId: "",
        groupId: "",
        tagId: "",
        couponId: "",
        remark: "",
        required: 1,
        isVip: 0,
        fileCode: ""
      },
      editCardDisable: false,
      mercInfo: auth.getMercInfo(),
      loading: false,
      storeList: [],
      cardList: [],
      groupList: [],
      unionList:[],//团体列表
      labelList: [],
      uploading: false,
      dialogVisible:false,
      timer:null,
      timing:10,
    };
  },
  computed: {
    // 文件上传地址
    uploadUrl() {
      return consts.BASE_URL + "/attachment/uploadTemplate";
    }
  },
  created() {
    this.getStoreList();
    this.getCardList();
    this.getGroupList();
    this.queryUnionList();
  },
  methods: {
    // 获取会员卡列表 选项
    getCardList() {
      this.$store
        .dispatch("post", {
          uri: "userCard/listForSelect"
        })
        .then(res => {
          this.cardList = res.data.data.list;
        });
    },
    // 获取分组 选项
    getGroupList() {
      this.$store
        .dispatch("post", {
          uri: "userGroup/list"
        })
        .then(res => {
          this.groupList = res.data.data.list;
        });
    },
    // 获取门店 选项
    getStoreList() {
      this.$store
        .dispatch("post", {
          uri: "storeInfo/list"
        })
        .then(res => {
          this.storeList = res.data.data.list;
        });
    },
    // 获取团体客户
    queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        })
        .then(res => {
          this.unionList = res.data.data || [];
        });
    },
    chgUnion(id) {
      if (!id) {
        this.editCardDisable = false;
        return;
      }
      for (let i = 0; i < this.unionList.length; i ++) {
        if (this.unionList[i].id == id) {
          if (this.unionList[i].saleType == 2) {
            this.form.cardId = this.unionList[i].cardId;
            this.editCardDisable = true;
          } else {
            this.editCardDisable = false;
          }
          break;
        }
      }
    },
    // 提交
    submit(formName, fn) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fn && fn();
        }
      });
    },
    // 提交导入文件
    postFile() {
      this.uploading = true;
      this.$store
        .dispatch("post", {
          uri: "import/userBatch/template/data",
          data: this.form,
          forceResolve: true
        })
        .then(res => {
          if (200 === res.data.httpCode) {
            msg.success("导入数据成功，请等待导入结果");
            setTimeout(_ => {
              this.$router.push("/client/import/list");
            }, 2000);
          } else {
            msg.error(res.data.msg || consts.ERROR_MSG);
            this.uploading = false;
          }
        });
    },
    // 打开确认导入弹窗
    openDialog(){
      this.dialogVisible = true;
      this.timer = setInterval(_=>{
        this.timing --;
        if(this.timing < 1) clearInterval(this.timer)
      },1000)
    },
    // 关闭确认导入弹窗
    closeDialog(){
      clearInterval(this.timer)
      this.timing = 10;
    },
    // 搜索标签
    remoteMethod(query) {
      if (query.replace(/\s+/, "")) {
        this.loading = true;
        this.$store
          .dispatch("get", {
            uri: "userTag/list",
            params: { keywords: query }
          })
          .then(res => {
            this.labelList = res.data.data.list;
            this.loading = false;
          });
      } else {
        this.labelList = [];
      }
    },
    // 上传文件前检测文件类型
    beforeUpload(file) {
      if (!/\.(xl|XL)[a-zA-Z]{1,2}$/.test(file.name)) {
        msg.warning("请上传EXCEL文件");
        return false;
      }
    },
    // 上传文件成功
    successUpload(response, file, fileList) {
      this.form.fileCode = response.data[0].code;
      // 始终显示最新上传文件
      if (fileList.length > 1) {
        fileList.shift();
      }
      this.$refs.form.validateField("fileCode");
    },
    // 删除文件
    removeFile(file, fileList) {
      // 上传文件列表为空，则清空fileCode
      if (fileList.length === 0) {
        this.form.fileCode = "";
      }
    },
    // 上传失败
    errorUpload() {
      msg.error("上传失败，请重试");
    },
    // 下载模板
    downloadTemplate() {
      window.open(
        `${consts.BASE_URL}/import/userBatch/template?required=${this.form
          .required}&cardId=${this.form.cardId}`
      );
    }
  }
};
</script>
