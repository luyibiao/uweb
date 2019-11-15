<template>
	<div>
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="/setting/account/basic"><i class="el-icon-arrow-left icon-smaller"></i>基本设置</el-breadcrumb-item>
			  <el-breadcrumb-item>商家信息认证</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div v-loading="loading" class="m-t-lg ukao-el-form-container">
			<div class="tip">
				通洗认证说明：认证审核周期为3个工作日。
      </div>
			<el-form :model="authForm" :rules="rules" ref="authForm" label-width="140px">
			  <el-form-item label="商户类型" prop="type">
				  <el-radio-group v-model="authForm.type" :disabled="authForm.status === 1 || authForm.status===0">
				  	<div class="dis-inline">
				  		<el-radio :label="1" style="line-height: 36px;">个体工商户</el-radio>
				  	</div>
				    <div class="dis-inline m-l-lg">
				    	<el-radio :label="2" style="line-height: 36px;">企业法人</el-radio>
				    </div>
				  </el-radio-group>
			  </el-form-item>

        <el-form-item label="营业执照" prop="licensePath">
					<div class="ds-mc-im ds-mg text-muted">请上传最新的营业执照。</div>
					<div class="ds-mc-im text-muted">格式要求：原件照片、扫描件或者加盖公章的复印件，仅支持jpg，png格式照片，大小不超过5M。</div>
					<Uploader
						:disabled="authForm.status === 1 || authForm.status===0"
						:path="authForm.licensePath"
						tip=" "
						accept="image"
						:beforeFn="beforeUpload"
						:successFn="successLicenseFn"/>
					<el-button v-if="authForm.licensePath" size="mini" @click="onSeeImg(authForm.licensePath)" type="text">查看大图</el-button>
        </el-form-item>

				<el-form-item label="洗衣店门头照片" prop="storePath">
					<div class="ds-mc-im ds-mg text-muted">仅支持jpg，png格式照片，大小不超过5M</div>
					<Uploader
						:disabled="authForm.status === 1 || authForm.status===0"
						:path="authForm.storePath"
						tip=" "
						accept="image"
						:beforeFn="beforeUpload"
						:successFn="successStoreFn"/>
					<el-button v-if="authForm.storePath" size="mini" @click="onSeeImg(authForm.storePath)" type="text">查看大图</el-button>
				</el-form-item>

			  <el-form-item v-if="authForm.status == -1 || authForm.status===''">
					<el-button type="primary" :loading="saving" @click="save()">提交</el-button>
			  </el-form-item>
				<el-alert v-if="authForm.status === 1" title="已认证" type="success" :closable="false">
				</el-alert>
				<el-alert v-if="authForm.status === 0" title="认证信息审核中..." type="info" :closable="false">
				</el-alert>
				<el-alert v-if="authForm.status === -1" :title="'认证审核失败：' + authForm.auditRemark" type="error" :closable="false">
				</el-alert>
			</el-form>
		</div>

		<seeimg :imgUrl="imgurl" :show.sync="imgShow" >
		</seeimg>
	</div>
</template>

<script>

  import msg from '@/utils/msg'
  import validate from "@/utils/helpers/validate";
  import Uploader from '@/components/Uploader'
  import seeimg from "@/components/SeeImg/seeImg"

	export default {
    components: {
      Uploader,
      seeimg
    },
    data: function() {
			return {
        imgurl:'',
        imgShow: false,
        loading: true,
        saving: false,
        authForm: {
				  id: '',
          type: 1,
          licensePath: '',
          storePath: '',
          status: '',
          auditRemark: ''
        },
        rules: {
          type: [
            { required: true, trigger: 'blur' }
          ],
          licensePath: [
            { required: true, message:"请上传营业执照", trigger: 'blur' }
          ],
          storePath: [
            { required: true, message:"请上传店门头照片", trigger: 'blur' }
          ]
        },
			}
		},
    created() {
			this.getLastAudit()
    },
    methods: {
      beforeUpload() {
        this.saving = true;
      },
      onSeeImg(url){
        this.imgurl = url;
        this.imgShow = true;
      },
      // 提交图片成功
      successLicenseFn(file) {
        if (file && file[0]) this.authForm.licensePath = file[0];
        this.saving = false;
      },
      successStoreFn(file) {
        if (file && file[0]) this.authForm.storePath = file[0];
        this.saving = false;
      },
      getLastAudit() {
        this.$store
          .dispatch("post", {
            uri: "mercAudit/getLastAudit"
          })
          .then(res => {
            if (res.data.data) {
              let data = res.data.data;
              this.authForm.type = data.type;
              this.authForm.licensePath = data.licensePath;
              this.authForm.storePath = data.storePath;
              this.authForm.status = data.status;
              this.authForm.auditRemark = data.auditRemark;
            }
            this.loading = false;
          });
      },
      save() {
        this.$refs['authForm'].validate((valid) => {
          if (valid) {

            let authForm = {...this.authForm};

            this.$store
              .dispatch("post", {
                uri: "mercAudit/submit",
                data: authForm
              })
              .then(res => {
                this.$router.push("/setting/account/basic");
              });
          }
        });
      }
    }
	}
</script>

<style scoped>
	.el-form-item{
		margin-bottom:0
	}
	.ds-mc-im {
		font-size: 1px;
		line-height: 25px;
	}
	.ds-mg {
		margin-top: 7px;
	}
	.tip {
		margin-left: 35px;
		margin-top: 10px;
		background: #f3f7ff;
		padding: 10px 20px;
		line-height: 1.6;
		font-size: 12px;
		border-radius: 8px;
	}
</style>