<template>
	<div class="ukao-pt-md ukao-padder">
		<el-collapse v-if="!payType || payType == 2" style="max-width: 1000px;">
			<el-collapse-item>
				<template slot="title">
					微信支付-<template v-if="wxAgentPay==1">代销</template><template v-else>自有</template>
					<auth perm="setting.payment.update">
						<el-switch
							class="collapse-switch"
							v-model="isEnableWx"
							@change="changePaymentConfig('isEnableWx')"
							active-text="已启用"
							inactive-text="已停用"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
						<template slot="noPerm">
							<el-switch
								class="collapse-switch"
								v-model="isEnableWx"
								disabled
								active-text="已启用"
								inactive-text="已停用"
								active-color="#13ce66"
								inactive-color="#ff4949">
							</el-switch>
						</template>
					</auth>
				</template>
				<div class="collapse-content">
					<div>启用通洗微信支付（代销账户），你可以通过通洗代销产品，并由你发起提现申请与通洗结算相应货款。</div>

					<el-form :model="wxConfig" ref="wxForm" label-width="100px">
						<el-form-item label-width="120px" label="当前微信支付：">
							<div class="w-lg">
								微信支付 - <template v-if="wxAgentPay==1">代销</template><template v-else>自有</template>
								<auth perm="setting.payment.update">
									<a class="text-primary" v-if="paymentPartner === 'Native'" @click="showWxDialog" href="javascript:void(0)">修改</a>
								</auth>
							</div>
							<el-alert
								v-if="wxAgentPay==1"
								title="注意：你正在使用通洗微信支付帐号。 买家通过朋友圈、微信好友聊天窗口和微信群进入购买，可以通过通洗微信支付付款。"
								style="background-color:#ffc;color:#333"
								type="warning"
								:closable="false">
							</el-alert>
							<el-alert
								v-if="wxAgentPay==0"
								title="注意：使用自有微信支付，货款直接入账至你的账户，由微信自动扣除每笔0.6%交易手续费。"
								style="background-color:#ffc;color:#333"
								type="warning"
								:closable="false">
							</el-alert>
						</el-form-item>
						<template v-if="paymentPartner === 'AllInPay'">
							<div v-if="isConfig == 0">请联系客服申请自有支付参数</div>
							<div v-if="isConfig == 1" class="text-success">已设置自有支付参数</div>
						</template>
						<template v-if="wxAgentPay==0 && paymentPartner === 'Native'">
							<el-form-item label-width="120px" label="商户号：" :rules="{required: true, min: 8, max: 10, message: '长度在8到10位', trigger: 'blur'}" prop="mchID">
								<div class="w-lg">
									<el-input :maxlength="10" v-model="wxConfig.mchID"></el-input>
								</div>
								<p class="text-muted">请填写微信发给你的商户号</p>
							</el-form-item>
							<el-form-item label-width="120px" label="支付密钥：" :rules="{required: true, min: 32, max: 32, message: '支付密钥长度为32位', trigger: 'blur'}" prop="key">
								<div class="w-lg">
									<el-input v-model="wxConfig.key" :maxlength="32"></el-input>
									<p class="text-muted">请填写在微信商户平台中设置的支付密钥</p>
								</div>
							</el-form-item>
							<auth perm="setting.payment.update">
								<el-form-item label-width="120px" label="支付证书：" :rules="{required: true, message: '请上传证书'}" prop="certName">
									<div class="w-lg">
										<el-upload :action="getUploadUrl" :with-credentials="true" :before-upload="beforeUpload" :on-success="onSuccess"
															 :on-error="onError" :on-change="handleChange" :on-remove="onRemove" :fileList="fileList">
											<el-button size="small" type="primary">点击上传</el-button>
											<div slot="tip" class="el-upload__tip">请上传.p12格式的证书，大小不超过8k</div>
										</el-upload>
									</div>
								</el-form-item>
							</auth>
							<el-form-item>
								<auth perm="setting.payment.update">
									<el-button type="primary" @click="saveWxConfig">保存</el-button>
								</auth>
							</el-form-item>
						</template>
					</el-form>
					<hr style="background-color:#ebeef5;height:1px;border:none"/>
					<el-form :model="wxAppConfig" ref="wxAppForm" label-width="100px">
						<el-form-item label-width="120px" label="微信小程序支付：">
							<div class="w-lg">
								微信支付(小程序) - 自有
							</div>
							<el-alert
								title="注意：微信小程序仅支持自有配置，货款直接入账至你的账户，由微信自动扣除每笔0.6%交易手续费。"
								style="background-color:#ffc;color:#333"
								type="warning"
								:closable="false">
							</el-alert>
						</el-form-item>
						<template v-if="paymentPartner === 'AllInPay'">
							<div v-if="isConfig == 0">请联系客服申请自有支付参数</div>
							<div v-if="isConfig == 1" class="text-success">已设置自有支付参数</div>
						</template>
						<template v-if="paymentPartner === 'Native'">
							<el-form-item label-width="120px" label="商户号：" :rules="{required: true, min: 8, max: 10, message: '长度在8到10位', trigger: 'blur'}" prop="mchID">
								<div class="w-lg">
									<el-input :maxlength="10" v-model="wxAppConfig.mchID"></el-input>
								</div>
								<p class="text-muted">请填写微信发给你的商户号</p>
							</el-form-item>
							<el-form-item label-width="120px" label="支付密钥：" :rules="{required: true, min: 32, max: 32, message: '支付密钥长度为32位', trigger: 'blur'}" prop="key">
								<div class="w-lg">
									<el-input v-model="wxAppConfig.key" :maxlength="32"></el-input>
									<p class="text-muted">请填写在微信商户平台中设置的支付密钥</p>
								</div>
							</el-form-item>
							<auth perm="setting.payment.update">
								<el-form-item label-width="120px" label="支付证书：" :rules="{required: true, message: '请上传证书'}" prop="certName">
									<div class="w-lg">
										<el-upload :action="getUploadAppUrl" :with-credentials="true" :before-upload="beforeAppUpload" :on-success="onAppSuccess"
															 :on-error="onError" :on-change="handleAppChange" :on-remove="onAppRemove" :fileList="fileAppList">
											<el-button size="small" type="primary">点击上传</el-button>
											<div slot="tip" class="el-upload__tip">请上传.p12格式的证书，大小不超过8k</div>
										</el-upload>
									</div>
								</el-form-item>
							</auth>
							<el-form-item>
								<auth perm="setting.payment.update">
									<el-button type="primary" @click="saveWxAppConfig">保存</el-button>
								</auth>
							</el-form-item>
						</template>
					</el-form>

					<!--<template v-if="wxAgentPay==1">-->
						<!--<div style="margin-top:20px"><b>提现时间：</b></div>-->
						<!--<div>当天18点前申请提现，当天审核完成，实际到账时间以银行入账时间为准。 <a class="text-primary" href="javascript:void(0)">查看收入</a></div>-->
						<!--<div style="margin-top:20px"><b>交易手续费：</b></div>-->
						<!--<div>通洗不收取任何提现手续费；</div>-->
						<!--<div>支付机构收取0.6%交易手续费，通过通洗完成代缴。</div>-->
					<!--</template>-->

				</div>
			</el-collapse-item>
			<el-collapse-item>
				<template slot="title">
					支付宝-<template v-if="aliAgentPay==1">代销</template><template v-else>自有</template>
					<auth perm="setting.payment.update">
						<el-switch
							class="collapse-switch"
							v-model="isEnableAli"
							@change="changePaymentConfig('isEnableAli')"
							active-text="已启用"
							inactive-text="已停用"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
						<template slot="noPerm">
							<el-switch
								class="collapse-switch"
								v-model="isEnableAli"
								disabled
								active-text="已启用"
								inactive-text="已停用"
								active-color="#13ce66"
								inactive-color="#ff4949">
							</el-switch>
						</template>
					</auth>
				</template>
				<div class="collapse-content">
					<div>启用通洗支付宝支付（代销账户），你可以通过通洗代销产品，并由你发起提现申请与通洗结算相应货款。</div>

					<el-form :model="aliConfig" ref="aliForm" label-width="100px">
						<el-form-item label-width="120px" label="当前模式：">
							<div class="w-lg">
								支付宝 - <template v-if="aliAgentPay==1">代销</template><template v-else>自有</template>
								<auth perm="setting.payment.update">
									<a class="text-primary" v-if="paymentPartner === 'Native'" @click="showAliDialog" href="javascript:void(0)">修改</a>
								</auth>
							</div>
							<el-alert
								v-if="aliAgentPay==0"
								title="注意：使用自有支付宝支付，货款直接入账至你的账户，由支付宝自动扣除每笔0.6%交易手续费。"
								style="background-color:#ffc;color:#333"
								type="warning"
								:closable="false">
							</el-alert>
						</el-form-item>
						<template v-if="paymentPartner === 'AllInPay'">
							<div v-if="isConfig == 0">请联系客服申请自有支付参数</div>
							<div v-if="isConfig == 1" class="text-success">已设置自有支付参数</div>
						</template>
						<template v-if="aliAgentPay==0 && paymentPartner === 'Native'">
							<el-form-item label-width="120px" label="APPID：" :rules="{required: true, message: '请输入appid', trigger: 'blur'}" prop="appid">
								<div class="w-lg">
									<el-input :maxlength="20" v-model="aliConfig.appid"></el-input>
								</div>
								<p class="text-muted">请填写支付宝的应用APPID</p>
							</el-form-item>
							<el-form-item label-width="120px" label="应用私钥RSA(SHA256)：" :rules="{required: true, message: '请输入应用私钥', trigger: 'blur'}" prop="privateKey">
								<div class="w-lg">
									<el-input v-model="aliConfig.privateKey" type="textarea" :rows="12"></el-input>
									<p class="text-muted">请将支付宝应用接口加签方式改成RSA2(SHA256)，并设置对应的应用私钥</p>
								</div>
							</el-form-item>
							<el-form-item label-width="120px" label="支付宝公钥RSA(SHA256)：" :rules="{required: true, message: '请输入支付宝公钥', trigger: 'blur'}" prop="alipayPublicKey">
								<div class="w-lg">
									<el-input v-model="aliConfig.alipayPublicKey" type="textarea" :rows="12"></el-input>
									<p class="text-muted">请填写支付宝生成的公钥</p>
								</div>
							</el-form-item>
							<el-form-item>
								<auth perm="setting.payment.update">
									<el-button type="primary" @click="saveAliConfig">保存</el-button>
								</auth>
							</el-form-item>
						</template>
					</el-form>

					<!--<template v-if="aliAgentPay==1">-->
						<!--<div style="margin-top:20px"><b>提现时间：</b></div>-->
						<!--<div>当天18点前申请提现，当天审核完成，实际到账时间以银行入账时间为准。 <a class="text-primary" href="javascript:void(0)">查看收入</a></div>-->
						<!--<div style="margin-top:20px"><b>交易手续费：</b></div>-->
						<!--<div>通洗不收取任何提现手续费；</div>-->
						<!--<div>支付机构收取0.6%交易手续费，通过通洗完成代缴。</div>-->
					<!--</template>-->
				</div>
			</el-collapse-item>
			<el-collapse-item>
				<template slot="title">
					现金支付
					<auth perm="setting.payment.update">
						<el-switch
							class="collapse-switch"
							v-model="isEnableCash"
							@change="changePaymentConfig('isEnableCash')"
							active-text="已启用"
							inactive-text="已停用"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
						<template slot="noPerm">
							<el-switch
								class="collapse-switch"
								v-model="isEnableCash"
								disabled
								active-text="已启用"
								inactive-text="已停用"
								active-color="#13ce66"
								inactive-color="#ff4949">
							</el-switch>
						</template>
					</auth>
				</template>
				<div class="collapse-content">
					<div>启用后买家可选择现金付款。平台不参与货款代收服务，只做标记处理。</div>
				</div>
			</el-collapse-item>
			<el-collapse-item>
				<template slot="title">
					其它支付
					<auth perm="setting.payment.update">
						<el-switch
							class="collapse-switch"
							v-model="isEnableUnion"
							@change="changePaymentConfig('isEnableUnion')"
							active-text="已启用"
							inactive-text="已停用"
							active-color="#13ce66"
							inactive-color="#ff4949">
						</el-switch>
						<template slot="noPerm">
							<el-switch
								class="collapse-switch"
								v-model="isEnableUnion"
								disabled
								active-text="已启用"
								inactive-text="已停用"
								active-color="#13ce66"
								inactive-color="#ff4949">
							</el-switch>
						</template>
					</auth>
				</template>
				<div class="collapse-content">
					<div>启用后买家可选择线下其它付款方式。与现金支付一样，平台只做标记处理。</div>
					<el-table class="ukao-el-table w-full ukao-v-loading" :data="tableData.list">
						<el-table-column label="序号" prop="sortNo">
						</el-table-column>
						<el-table-column label="名称" prop="name">
						</el-table-column>
						<el-table-column label="操作" prop="name">
							<template slot-scope="scope">
								<auth perm="setting.payment.update">
									<el-button type="text" @click="showSign(scope.row)">编辑</el-button>
									<el-button class="text-danger" type="text" @click="delSign(scope.row)">删除</el-button>
									<template slot="noPerm">-</template>
								</auth>
							</template>
						</el-table-column>
					</el-table>
					<div class="m-t-sm">
						<auth perm="setting.payment.update">
							<el-button type="primary" size="small" @click="showSign()">添加支付标记</el-button>
						</auth>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>

		<el-alert v-else style="max-width: 1000px;"
			:closable="false"
			title="设置提示"
			type="warning"
			description="当前城市支付配置已由商户代理，无法进行配置，如需设置请联系商户管理员开启"
			show-icon>
		</el-alert>

		<el-dialog class="ukao-dialog" :close-on-click-modal="false" :close-on-press-escape="false"
							 title="微信支付" :visible.sync="dialogWxVisible" size="small">
			<div>
				请根据你的实际情况，选择一种方式：
				<div style="border-top: 1px solid #e5e5e5;margin-top: 15px; padding-top: 15px">
					<h4>情况1：商户已绑定“认证服务号”，且已向微信申请开通“微信支付权限”</h4>
					<div style="margin-top: 10px;">你可以在此配置，使用自己的微信支付。货款直接进入你的微信支付对应的财付通帐号。微信将收取每笔0.6%的交易手续费。</div>
					<el-button type="primary" v-if="wxAgentPay==1" @click="changeWxAgent(0)" size="small" style="margin-top: 15px;">立即设置</el-button>
					<el-button type="success" v-if="wxAgentPay==0" size="small" style="margin-top: 15px;">正在使用</el-button>
				</div>
				<div style="border-top: 1px solid #e5e5e5;margin-top: 15px; padding-top: 15px">
					<h4>情况2：无论商户是否绑定了微信公众号</h4>
					<div style="margin-top: 10px;">你可以通过通洗代销商品，后由通洗与你结算货款（需你发起提现申请）</div>
					<div style="margin-top: 5px;">微信收取0.6%交易手续费，通过通洗完成代缴。</div>
					<div style="margin-top: 5px;">提现人工审核周期：当天18点前申请提现，当天审核完成，实际到账时间以银行入账时间为准。</div>
					<el-button type="primary" v-if="wxAgentPay==0" @click="changeWxAgent(1)" size="small" style="margin-top: 15px;">立即设置</el-button>
					<el-button type="success" v-if="wxAgentPay==1" size="small" style="margin-top: 15px;">正在使用</el-button>
				</div>
			</div>
		</el-dialog>

		<el-dialog class="ukao-dialog" :close-on-click-modal="false" :close-on-press-escape="false"
							 title="支付宝支付" :visible.sync="dialogAliVisible" size="small">
			<div>
				请根据你的实际情况，选择一种方式：
				<div style="border-top: 1px solid #e5e5e5;margin-top: 15px; padding-top: 15px">
				<h4>使用自己的支付宝支付</h4>
				<div style="margin-top: 5px;">货款直接进入你的支付宝支账号中。支付宝将收取每笔0.6%的交易手续费。</div>
				<el-button type="primary" v-if="aliAgentPay==1" @click="changeAliAgent(0)" size="small" style="margin-top: 15px;">立即设置</el-button>
				<el-button type="success" v-if="aliAgentPay==0" size="small" style="margin-top: 15px;">正在使用</el-button>
			</div>
				<div style="border-top: 1px solid #e5e5e5;margin-top: 15px; padding-top: 15px">
					<h4>通过通洗代销商品，后由通洗与你结算货款（需你发起提现申请）</h4>
					<div style="margin-top: 5px;">支付宝收取0.6%交易手续费，通过通洗完成代缴。</div>
					<div style="margin-top: 5px;">提现人工审核周期：当天18点前申请提现，当天审核完成，实际到账时间以银行入账时间为准。</div>
					<el-button type="primary" v-if="aliAgentPay==0" @click="changeAliAgent(1)" size="small" style="margin-top: 15px;">立即设置</el-button>
					<el-button type="success" v-if="aliAgentPay==1" size="small" style="margin-top: 15px;">正在使用</el-button>
				</div>
			</div>
		</el-dialog>

		<!-- 管理备注-->
		<el-dialog class="ukao-dialog"
							 :title="signDialog.title" :visible.sync="signDialog.visible"  size="small">
			<div>
				<el-form :model="signForm" ref="signForm" label-width="160px">

					<el-form-item label="名称" prop="name" :rules="[{ required: true, message: '标记名称不能为空', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input :maxlength="16" v-model="signForm.name" ></el-input>
						</div>
					</el-form-item>
					<el-form-item
						label="序号" prop="sortNo" :rules="[{ required: true, type:'number', message: '请输入序号', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input type="number" v-model.number="signForm.sortNo"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="signDialog.visible=false">取消</el-button>
						<el-button type="primary" @click="saveSign('signForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end管理备注-->

	</div>
</template>

<script>
  import msg from '@/utils/msg'
  import consts from '@/utils/consts'
  import BIZCONSTS from '@/utils/bizconsts'

	export default {
		data() {
			return {
        wxConfig: {
          mchID: '',
          key: '',
          certName: ''
				},
        wxAppConfig: {
          mchID: '',
          key: '',
          certName: ''
				},
        aliConfig: {
          appid: '',
          privateKey: '',
          alipayPublicKey: ''
				},
        tableData: {
          list : [],
        },
				signForm: {
          groupCode: BIZCONSTS.TRADE.CONFIG_KEY.OTHER_PAY,
					id: '',
					name: '',
					sortNo: ''
				},
				signDialog: {
          title: '',
          visible: false
				},
        wxAgentPay: '0',
			  aliAgentPay: '0',
			  fileList:[],
			  fileAppList:[],
        paymentPartner: 'Native',
        isConfig: 0,
        payType: null,
			  isEnableWx:true,
        isEnableAli:true,
        isEnableCash:true,
        isEnableUnion:true,
        dialogWxVisible: false,
        dialogAliVisible: false
			}
		},
    computed: {
      getUploadUrl: function() {
		    return consts.BASE_URL + '/attachment/uploadWxCert';
			},
      getUploadAppUrl: function() {
        return consts.BASE_URL + '/attachment/uploadWxCert?sign=wxapp';
      }
		},
		methods: {
      queryPaymentConfig: function () {
        this.$store.dispatch('post', {
          uri : 'mercParam/getPaymentConfig',
        }).then((res)=>{
          let data = res.data.data;
          let paymentConfig = data.paymentConfig;
          this.payType = data.payType;
          let wxCfg = this.getPosNum(paymentConfig, 0);
          let aliCfg = this.getPosNum(paymentConfig, 1);
          this.isEnableWx = wxCfg > 0;
          this.isEnableAli = aliCfg > 0;
          this.isEnableCash = this.getPosNum(paymentConfig, 2) > 0;
          this.isEnableUnion = this.getPosNum(paymentConfig, 3) > 0;
          this.paymentPartner = data.paymentPartner;
          this.isConfig = data.isConfig;

          if (wxCfg != 2) {
            this.wxAgentPay = 0;
            this.queryWxConfig();
          } else {
            this.wxAgentPay = 1;
					}

					this.queryWxAppConfig();

          if (aliCfg != 2) {
            this.aliAgentPay = 0;
            this.queryAliConfig();
					}else{
            this.aliAgentPay = 1;
					}
        });
      },
      queryOtherPay() {
        this.$store.dispatch('post', {
          uri : 'tradeConfig/list',
					data: {groupCode: BIZCONSTS.TRADE.CONFIG_KEY.OTHER_PAY}
        }).then((res)=>{
          this.tableData.list = res.data.data.list || []
        });
			},
      showSign(item) {
        let title = '';
        if (item) {
          this.signForm.id = item.id;
          this.signForm.name = item.name;
          this.signForm.sortNo = item.sortNo;
          title = '编辑';
				} else {
          this.signForm.id = '';
          this.signForm.name = '';
          this.signForm.sortNo = '';
          title = '添加';
				}
        this.signDialog.title = title + "支付标记";
        this.signDialog.visible = true;
			},
      saveSign(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.signForm.id;
            this.$store.dispatch('post', {
              uri: id?'tradeConfig/update':'tradeConfig/add',
              data: this.signForm
            }).then((res) => {
              this.signDialog.visible = false
              msg.success();
              this.queryOtherPay()
            })
					}
        })
			},
      delSign(item) {
        let _this = this;
        msg.confirm({
          msg: '确认删除?',
          confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'tradeConfig/delete',
              data: {id: item.id}
            }).then((res) => {
              msg.success();
              _this.queryOtherPay()
            })
          }
        })
			},
      getPosNum(paymentConfig, pos) {
        return paymentConfig[pos];
      },
      showWxDialog: function () {
        this.dialogWxVisible = true;
      },
      changeWxAgent: function (wxAgentPay) {
        this.dialogWxVisible = false;
        this.wxAgentPay = wxAgentPay;
        if(wxAgentPay == 0){
          this.queryWxConfig();
				}
        this.isEnableWx = true;
        this.savePaymentConfig(1);
      },
      showAliDialog: function () {
        this.dialogAliVisible = true;
      },
      changeAliAgent: function (aliAgentPay) {
        this.dialogAliVisible = false;
        this.aliAgentPay = aliAgentPay;
        if(aliAgentPay == 0){
          this.queryAliConfig();
				}

        this.isEnableAli = true;
        this.savePaymentConfig(2);
      },
      beforeUpload: function (file) {
				if (file.type !== 'application/x-pkcs12') {
				  msg.error("无效的证书文件");
          this.fileList = [];
          return false;
				}
      },
      onRemove : function (file, fileList) {
        this.wxConfig.certName = '';
			},
      onSuccess: function (response, file, fileList) {
        if (response.httpCode == 200) {
          let fileNames = response.fileNames||[];
          if(fileNames && fileNames[0]){
            file.name = fileNames[0];
            this.wxConfig.certName = file.name;
          }
				} else if (response.httpCode == 401){
          msg.error("登录过期，请重新登录");
				} else {
          msg.error();
				}
			},
      beforeAppUpload: function (file) {
        if (file.type !== 'application/x-pkcs12') {
          msg.error("无效的证书文件");
          this.fileAppList = [];
          return false;
        }
      },
      onAppRemove : function (file, fileList) {
        this.wxAppConfig.certName = '';
      },
      onAppSuccess: function (response, file, fileList) {
        if (response.httpCode == 200) {
          let fileNames = response.fileNames||[];
          if(fileNames && fileNames[0]){
            file.name = fileNames[0];
            this.wxAppConfig.certName = file.name;
          }
        } else if (response.httpCode == 401){
          msg.error("登录过期，请重新登录");
        } else {
          msg.error();
        }
      },
      handleAppChange: function (file, fileList) {
        this.fileAppList = fileList.slice(-1);
      },
      onError: function (err, file, fileList) {
        msg.error();
			},
      handleChange: function (file, fileList) {
        this.fileList = fileList.slice(-1);
			},
			getPaymentConfig: function() {
        return (this.isEnableWx?(this.wxAgentPay == 1?'2':'1'):'0') + (this.isEnableAli?(this.aliAgentPay == 1?'2':'1'):'0') + (this.isEnableCash?'1':'0') + (this.isEnableUnion?'1':'0');
			},
			changePaymentConfig: function (configType) {

        // 阻止折叠面板冒泡事件响应
        event.preventDefault();
        event.stopPropagation();

        let _this = this;
        setTimeout(function (){
          _this.savePaymentConfig(configType)
        }, 100);
			},
			savePaymentConfig: function(configType) {
        let paymentConfig = this.getPaymentConfig();
        if (paymentConfig == '0000') {
          msg.error("至少开启一种收款方式");
          return ;
				}

        this.$store.dispatch('post', {
          uri : 'mercParam/updatePaymentConfig',
          data: {
            paymentConfig: paymentConfig
          },
					forceResolve:true
        }).then( res =>{
          if(res.data.httpCode != 200){
            msg.error(res.data.msg);
            if(configType == 1){
              this.isEnableWx = false;
            }else if(configType == 2){
              this.isEnableAli = false;
						}
            if(configType == "isEnableWx"){
              let flag = this.isEnableWx;
              this.isEnableWx = !flag;
            }
            if(configType == "isEnableAli"){
              let flag = this.isEnableAli;
              this.isEnableAli = !flag;
            }
            if(configType == "isEnableCash"){
              let flag = this.isEnableCash;
              this.isEnableCash = !flag;
            }
            if(configType == "isEnableUnion"){
              let flag = this.isEnableUnion;
              this.isEnableUnion = !flag;
            }

          }

				})
			},
      queryWxConfig: function() {
        this.$store.dispatch('post', {
          uri : 'mercPayParam/detail',
          data: {payMethod: BIZCONSTS.TRADE.PAY_WX}
        }).then((res)=>{
          if (res.data.data) {
            this.wxConfig = JSON.parse(res.data.data.params);
            if(this.fileList.length == 0){
              this.fileList.push({name:this.wxConfig.certName});
						}else{
              for(var i = 0 ;i < this.fileList.length; i++){
                if(this.fileList[i].name != this.wxConfig.certName){
                  this.fileList.push({name:this.wxConfig.certName});
                  return;
                }
              }
						}
          }
        });
      },
      queryWxAppConfig: function() {
        this.$store.dispatch('post', {
          uri : 'mercPayParam/detail',
          data: {payMethod: BIZCONSTS.TRADE.PAY_WX_APP}
        }).then((res)=>{
          if (res.data.data) {
            this.wxAppConfig = JSON.parse(res.data.data.params);
            if(this.fileAppList.length == 0){
              this.fileAppList.push({name:this.wxAppConfig.certName});
            }else{
              for(var i = 0 ;i < this.fileAppList.length; i++){
                if(this.fileAppList[i].name != this.wxAppConfig.certName){
                  this.fileAppList.push({name:this.wxAppConfig.certName});
                  return;
                }
              }
            }
          }
        });
      },
      queryAliConfig: function() {
        this.$store.dispatch('post', {
          uri : 'mercPayParam/detail',
          data: {payMethod: BIZCONSTS.TRADE.PAY_ALIPAY}
        }).then((res)=>{
          if (res.data.data) {
            this.aliConfig = JSON.parse(res.data.data.params);
          }
        });
      },
      saveWxConfig: function() {
        let _this = this;
				this.$refs['wxForm'].validate((valid)=> {
				  if (valid) {
            _this.$store.dispatch('post', {
              uri : 'mercPayParam/save',
              data: {payMethod: BIZCONSTS.TRADE.PAY_WX, params: JSON.stringify(this.wxConfig)}
            }).then((res)=>{
              msg.success();
						});
					}
				});
			},
      saveWxAppConfig: function() {
        let _this = this;
        this.$refs['wxAppForm'].validate((valid)=> {
          if (valid) {
            _this.$store.dispatch('post', {
              uri : 'mercPayParam/save',
              data: {payMethod: BIZCONSTS.TRADE.PAY_WX_APP, params: JSON.stringify(this.wxAppConfig)}
            }).then((res)=>{
              msg.success();
            });
          }
        });
      },
      saveAliConfig: function() {
        let _this = this;
        this.$refs['aliForm'].validate((valid)=> {
          if (valid) {
            _this.$store.dispatch('post', {
              uri : 'mercPayParam/save',
              data: {payMethod: BIZCONSTS.TRADE.PAY_ALIPAY, params: JSON.stringify(this.aliConfig)}
            }).then((res)=>{
              msg.success();
            });
          }
        });
      }
		},
		created: function() {
		  this.queryPaymentConfig();
		  this.queryOtherPay();
		}
	}
</script>

<style scoped>
	.u-select-list ul {
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-select-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
	.u-select-list ul li:hover {
		background: #e4e8f1;
	}
	.u-select-list ul li.active {
		background: #20a0ff;
		color: #fff;
	}
	.u-select-list ul li.active:hover {
		background: #1c8de0;
	}
	.collapse-switch {
		float: right;
		margin-top: 10px;
		margin-right:20px;
	}
	.collapse-content {
		margin: 10px 18px;
	}
	.sc-selected-list li {
		float: left;
		padding-right: 50px;
		margin-bottom: 15px;
	}
	.sc-selected-list .item {
		position: relative;
		padding: 8px 20px;
		line-height: 20px;
		background: #fceeee;
		border: 1px solid #f64643;
		border-radius: 6px;
	}
	.sc-selected-list li .item > a {
		display: none;
		position: absolute;
		top: 0;
		right: -34px;
		color: #f56866;
	}
	.sc-selected-list li:hover .item > a {
		display: block;
	}
	.u-add-list .u-add-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 10px;
	}
	.u-add-list ul {
		min-width: 240px;
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-add-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
</style>