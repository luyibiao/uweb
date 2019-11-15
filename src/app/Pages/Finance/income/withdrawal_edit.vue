<template>
	<div class="ukao-pt-lg">
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="/finance/income/withdrawal"><i class="el-icon-arrow-left icon-smaller"></i>申请提现</el-breadcrumb-item>
			  <el-breadcrumb-item>设置提现账号</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="m-t-lg ukao-el-form-container">
			<el-form :model="walletForm" :rules="rules" ref="walletForm" label-width="140px">
			  <el-form-item label="可提现方式">
				  <el-radio-group v-model="walletForm.bankType">
				  	<div class="dis-inline">
				  		<el-radio :label="1" style="line-height: 36px;">对私银行账户</el-radio>
				  		<p class="text-muted text-xs m-l-md">支持提现至个人银行借记卡</p>
				  	</div>
				    <div class="dis-inline m-l-lg">
				    	<el-radio :label="2" style="line-height: 36px;">对公银行账户</el-radio>
				    	<p class="text-muted text-xs m-l-md">提现至对公司账户</p>
				    </div>
				  </el-radio-group>
			    <div class="tip">
			    	<div v-if="walletForm.bankType==1">
			    		<p>1.请仔细填写账户信息，如果由于您填写错误导致资金流失，通洗概不负责； </p>
			    		<p>2.只支持提现到银行卡借记卡，<span class="text-danger">不支持信用卡和存折</span>。提现审核周期为3-5个工作日； </p>
			    	</div>
			    	<div v-else>
			    		<p>1.请仔细填写账户信息，如果由于您填写错误导致资金流失，通洗概不负责； </p>
			    		<p>2.只支持提现到公司账户，<span class="text-danger">不支持信用卡和存折</span>。提现审核周期为3-5个工作日； </p>
			    		<p>3.准确填写银行开户许可证上的公司名称，否则无法提现；</p>
			    	</div>
			    </div>
			  </el-form-item>

        <el-form-item label="开户银行" prop="bankCode">
          <el-select v-model="walletForm.bankCode" placeholder="请选择">
            <el-option v-for="item in banks" :key="item.val" :label="item.text" :value="item.val"></el-option>
          </el-select>
        </el-form-item>

			  <div v-if="walletForm.bankType==1">
				  <el-form-item label="银行卡卡号" prop="accountNo">
				    <span class="w-xl dis-inline"><el-input :maxlength="32" v-model="walletForm.accountNo" placeholder="只支持提现至借记卡，不支持信用卡和存折"></el-input></span>
				  </el-form-item>
				  <el-form-item label="开卡人姓名" :show-message="false" prop="accountName">
				    <span class="w-xl dis-inline"><el-input :maxlength="32" v-model="walletForm.accountName" placeholder="准备填写银行卡开卡人姓名，否则无法提现"></el-input></span>
				  </el-form-item>
			  </div>

			  <div v-else>
				  <el-form-item label="公司账户" prop="accountNo">
				    <span class="w-xl dis-inline"><el-input :maxlength="32" v-model="walletForm.accountNo"></el-input></span>
				  </el-form-item>
				  <el-form-item label="公司名称" :show-message="false" prop="accountName">
				    <span class="w-xl dis-inline"><el-input :maxlength="32" v-model="walletForm.accountName" placeholder="准备填写银行卡公司名称，否则无法提现"></el-input></span>
				  </el-form-item>
			  </div>
			  
		   	<el-form-item label="短信验证码" prop="verifyCode">
			  	<span class="w-xl dis-inline">
				    <el-input v-model="walletForm.verifyCode" :maxlength="12">
				    	 <el-button slot="append" :disabled="codeBtn.disable" @click="getCode">{{codeBtn.name}}</el-button>
				    </el-input>
				  </span>
			    <p class="text-xs text-muted" style="line-height: 20px;">验证短信将发送到您绑定的手机：{{workInfo.phone}}，请注意查收</p>
			  </el-form-item>
			  <el-form-item>
			  	<el-button type="primary" @click="save()">保存</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>

  import msg from '@/utils/msg'
  import keyval from '@/utils/dickeyval';
  import validate from "@/utils/helpers/validate";

	export default {
    data: function() {
			return {
			  codeBtn: {
			    disable: false,
          name: '获取'
        },
			  workInfo: {},
        walletForm: {
				  id: '',
          bankType: 1,
          bankCode: '',
          accountNo: '',
          accountName: '',
          verifyCode: ''
        },
        banks:keyval['BANK'],
        rules: {
          accountNo: [
            { required: true, message: '请输入银行卡', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (validate.number(value)) {
                  callback()
                } else {
                  callback("银行卡必须为数字")
                }
              },
              trigger: "change"
            }
          ],
          accountName: [
            { required: true, trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
          bankCode: [
            { required: true, message: '请选择开户行', trigger: 'change' }
          ],
        },
			}
		},
    created() {
      this.queryManagerInfo();
      if (this.$route.params.id) {
        this.queryDetail(this.$route.params.id)
      }
    },
    methods: {
      queryDetail(id) {
        this.$store
          .dispatch("post", {
            uri: "tradeWallet/detail",
            data: {id}
          })
          .then(res => {
            if (res.data.data) {
              this.walletForm = res.data.data;
            }
          });
      },
      queryManagerInfo() {
        this.$store
          .dispatch("post", {
            uri: "workerInfo/queryManagerInfo"
          })
          .then(res => {
            if (res.data.data) {
              this.workInfo = res.data.data;
            }
          });
      },
      getCode() {
        let _this = this;
        if (!_this.walletForm.bankCode || !_this.walletForm.accountNo || !_this.walletForm.accountName) {
          return;
        }
        this.codeBtn.disable = true;
        let codeBtnTime = 60;
        this.codeBtn.name = codeBtnTime + "s";
        let t = setInterval(function (){
          codeBtnTime --;
          _this.codeBtn.name = codeBtnTime + "s";
          if (codeBtnTime <= 0) {
            clearInterval(t);
            _this.codeBtn.name = '获取';
            _this.codeBtn.disable = false;
          }
        }, 1000);

        this.$store.dispatch('post', {
          uri: 'sms/merc/verifyBank',
          forceResolve:true
        }).then((res) => {
          if (res.data.httpCode != 200) {
            clearInterval(t);
            msg.error(res.data.msg)
            _this.codeBtn.name = '获取验证码';
            _this.codeBtn.disable = false;
          }
        });
      },
      save() {
        this.$refs['walletForm'].validate((valid) => {
          if (valid) {
            let uri = 'mercAdd';
            if (this.walletForm.id) {
              uri = 'mercUpdate';
            }

            let walletForm = {...this.walletForm};
            walletForm.createTime = null;
            walletForm.updateTime = null;

            this.$store
              .dispatch("post", {
                uri: "tradeWallet/" + uri,
                data: walletForm
              })
              .then(res => {
                this.$router.push("/finance/income/withdrawal");
              });
          }
        });
      }
    }
	}
</script>

<style scoped>
	.tip {
		margin-top: 10px;
		background: #f3f7ff;
		padding: 10px 20px;
		line-height: 1.6;
		font-size: 12px;
		border-radius: 8px;
	}
</style>