<template>
	<div v-loading="loading">
		<p class="text-center project-item-top">
			<el-breadcrumb class="link-back"
			               separator="/">
				<el-breadcrumb-item to="/weixin/project">
					<i class="el-icon-arrow-left icon-smaller"></i>经营项目</el-breadcrumb-item>
				<el-breadcrumb-item>{{item.name}}</el-breadcrumb-item>
			</el-breadcrumb>
			<span v-text="item.name"></span>
		</p>
		<table class="ukao-table b-t"
		       style="width: 100%">
			<tbody>
				<tr>
					<td>状态</td>
					<td>
						<el-switch
							active-color="#13ce66"
						 	inactive-color="#dcdcdc"
						 	active-text="已启用"
						 	inactive-text="未启用"
						 	:active-value="1"
						 	:inactive-value="0"
						 	v-model="item.status"
						 	@change="updateStatus">
						</el-switch>
					</td>
					<td></td>
					<td></td>
				</tr>
				<tr v-if="!item.status">
					<td colspan="4">
						<vBanner isShow="1"></vBanner>
					</td>
				</tr>
				<tr>
					<td>显示序号</td>
					<td>
						<span v-text="item.sortNo"></span>
					</td>
					<td></td>
					<td>
						<el-button plain
						           type="primary"
						           size="small"
						           @click="update('sortNo')">修改</el-button>
					</td>
				</tr>
				<tr>
					<td>服务项目名称</td>
					<td>
						<span v-text="item.name"></span>
					</td>
					<td>
						<el-checkbox v-model="item.showName"
						             :true-label="0"
						             :false-label="1"
						             @change="changeNameChecked">隐藏</el-checkbox>
					</td>
					<td>
						<el-button plain
						           type="primary"
						           size="small"
						           @click="update('name')">修改</el-button>
					</td>
				</tr>
				<tr>
					<td>备注说明</td>
					<td>
						<span v-text="item.subtitle"></span>
					</td>
					<td>
						<el-checkbox v-model="item.showSubtitle"
						             :true-label="0"
						             :false-label="1"
						             @change="changeSubtitleChecked">隐藏</el-checkbox>
					</td>
					<td>
						<el-button plain
						           type="primary"
						           size="small"
						           @click="update('subtitle')">修改</el-button>
					</td>
				</tr>
				<tr>
					<td>图标</td>
					<td><img class="thumb-md"
						     v-bind:src="item.imgPath"
						     alt=""></td>
					<td></td>
					<td>
						<el-button plain
						           type="primary"
						           size="small"
						           @click="update('imgPath')">修改</el-button>
					</td>
				</tr>
				<tr>
					<td>服务产品</td>
					<td>
						<span v-text="item.productCnt"></span>
					</td>
					<td></td>
					<td>
						<router-link :to="'/weixin/project/products/'+item.id">
							<el-button plain
							           type="primary"
							           size="small">查看</el-button>
						</router-link>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- 修改 -->
		<el-dialog class="ukao-dialog"
		           :title="'编辑'"
		           :visible.sync="dialogVisible"
		           size="small">
			<div>
				<el-form :model="ruleForm"
				         ref="ruleForm"
				         label-width="160px"
				         class="demo-ruleForm"
				         enctype="multipart/form-data">
					<el-form-item label="服务项目名称"
					              prop="name"
					              v-if="attr == 'name'"
					              :rules="[
				    { required: true, message: '名称不能为空'},
				    { min: 1, max: 5, message: '长度在1到5个长度', trigger: 'blur' }
				  ]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.name"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="序号"
					              prop="sortNo"
					              v-if="attr == 'sortNo'"
					              :rules="[
				    { required: true, message: '序号不能为空'}
				  ]">
						<div class="dis-inline w-xl">
							<el-input v-model.number="ruleForm.sortNo"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="备注说明"
					              prop="subtitle"
					              v-if="attr == 'subtitle'"
					              :rules="[
				    { min: 0, max: 12, message: '长度在0到12个长度' }
				  ]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.subtitle"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>

					<el-form-item v-if="attr == 'imgPath'">
						<Uploader tip="只能上传jpg/png文件，建议尺寸160像素*160像素，且不超过2M"
						          :path="ruleForm.imgPath"
						          :beforeFn="beforeAvatarUpload"
						          :successFn="handleAvatarSuccess"
						          :errorFn="handleAvatarError"></Uploader>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialogVisible=false">取消</el-button>
						<el-button type="primary"
						           :loading="dialog.btn"
						           @click="submitForm('ruleForm')">{{dialog.text}}</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import Uploader from "@/components/Uploader/index.vue";
import vBanner from "../banner";

export default {
  components: {
    Uploader,
    vBanner
  },
  props: ["id"],
  data: function() {
    return {
      dialogVisible: false,
      attr: "",
      item: {},
      ruleForm: {
        id: "",
        name: "",
        sortNo: "",
        name: "",
        showName: "",
        subtitle: "",
        showSubtitle: "",
        imgPath: ""
      },
      dialog: {
        btn: false,
        text: "保存"
      },
      loading: true
    };
  },
  created() {
    this.item.id = this.id;
    this.info();
  },
  methods: {
    info() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "mercBusiness/detail",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.item = res.data.data;
          this.loading = false;
        });
    },
    update(attr) {
      this.attr = attr;
      this.initRuleForm(this.item);
      this.dialogVisible = true;
      this.dialog.btn = false;
      this.dialog.text = "保存";
    },
    // 初始化表单数据
    initRuleForm(data) {
      Object.keys(this.ruleForm).forEach(key => {
        this.ruleForm[key] = data[key];
      });
    },
    // 修改数据选项
    editInfo(data) {
      Object.keys(data).forEach(key => {
        this.item[key] = data[key];
      });
    },
    // 修改启用状态
    updateStatus(val) {
      msg.confirm({
        msg: `确定${val ? '启用' : '停用'}改项目？`,
        confirmFn: _ => {
          this.$store
            .dispatch("post", {
              uri: val ? "mercBusiness/enable" : "mercBusiness/disable",
              data: {
                id: this.item.id
              }
            })
            .then(res => {
              this.$emit("updateSuccess");
              msg.success();
            });
        },
        cancelFn: _ => {
          this.item.status = this.item.status ? 0 : 1;
        }
      });
    },
    // 修改是否隐藏服务项目名称
    changeNameChecked(event) {
      msg.confirm({
        msg: `确定${this.item.showName ? "显示" : "隐藏"}服务项目名称？`,
        confirmFn: _ => {
          this.initRuleForm(this.item);
          this.updateSave();
        },
        cancelFn: _ => {
          this.item.showName = this.item.showName ? 0 : 1;
        }
      });
    },
    // 修改是否隐藏备注
    changeSubtitleChecked(event) {
      msg.confirm({
        msg: `确定${this.item.showSubtitle ? "显示" : "隐藏"}备注？`,
        confirmFn: _ => {
          this.initRuleForm(this.item);
          this.updateSave();
        },
        cancelFn: _ => {
          this.item.showSubtitle = this.item.showSubtitle ? 0 : 1;
        }
      });
    },
    // 提交内容修改
    updateSave() {
      this.$store
        .dispatch("post", {
          uri: "mercBusiness/update",
          data: this.ruleForm
        })
        .then(res => {
          this.dialogVisible = false;
          this.editInfo(this.ruleForm);
          this.$emit("updateSuccess");
          msg.success();
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateSave();
        }
      });
    },
    handleAvatarSuccess(fileNames) {
      var _this = this;
      if (fileNames && fileNames[0]) {
        _this.ruleForm.imgPath = fileNames[0];
      }
      _this.dialog.btn = false;
      _this.dialog.text = "保存";
    },
    beforeAvatarUpload(file) {
      const isImg = validate.image(file.type);
      if (!isImg) {
        msg.error("上传文件不是图片！");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        msg.error("上传图片大小不能超过 2MB!");
      }
      if (isImg && isLt2M) {
        this.dialog.btn = true;
        this.dialog.text = "上传中...";
      }
      return isImg && isLt2M;
    },
    handleAvatarError(file) {
      this.dialog.btn = false;
      this.dialog.text = "保存";
    }
  }
};
</script>

<style scoped>
.link-back {
  height: 30px;
  line-height: 30px;
}
.project-item-top {
  position: relative;
  line-height: 30px;
  margin-bottom: 15px;
}
.project-item-top .link-back {
  position: absolute;
  top: 0;
  left: 0;
}
</style>