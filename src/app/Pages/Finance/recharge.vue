<template>
  <div class="ukao-pt-md">
  	<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="income"><i class="el-icon-arrow-left icon-smaller"></i>我的收入</el-breadcrumb-item>
			  <el-breadcrumb-item>充值</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="m-t-lg ukao-el-form-container">
			<el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
				<el-form-item label="账户可用余额">
			    <span class="text-danger text-xl">{{mercIncome.balance | amtFormat}}</span> 元
			  </el-form-item>
			  <el-form-item label="充值金额" prop="amt" :rules="{validator: checkAmount, min:1, max:1000000, ignoreEmpty:true,trigger: 'blur'}">
			  	<div class="dis-inline w-xl m-r">
			  		<el-input v-model="ruleForm.amt" placeholder="请输入充值金额"></el-input>
			  	</div>元
			  </el-form-item>
			  <el-form-item>
			  	<el-button type="primary" @click="rechargeDialog">确认充值</el-button>
			  </el-form-item>
			</el-form>
		</div>
		<div class="tip">
			<h4>使用遇到问题？</h4>
			<p class="m-t-sm">输入充值金额后，为什么无法充值成功？</p>
			<p>答：大额充值会受到充值额度的限制，建议你分批进行充值，每次充值金额不超过10000元。</p>
			<p class="m-t-sm">充值成功了，为什么收支明细里面没有记录？</p>
			<p>答：充值金额是实时到账的，若收支明细中没有记录，可能是系统延时引起的。若超过一天仍未显示，请与通洗客服联系。</p>
		</div>

		<el-dialog class="ukao-dialog"
		  title="充值成功"
		  :visible.sync="rechargeSuccess"
		  size="small">
		  <div>充值金额 <span class="text-danger">{{ruleForm.amt}}</span> 元，您可到收支明细查看。</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="rechargeSuccess = false">我知道了</el-button>
		  </span>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="充值"
		  :visible.sync="recharge"
		  size="small">
		  <div>
		  	<ul class="recharge-info-list">
		  		<li>商户名称：{{mercInfo.name}}</li>
		  		<li>当前余额：{{mercIncome.balance | amtFormat}}元</li>
		  		<li>充值金额：<span class="text-danger text-xl m-r-sm">{{ruleForm.amt}}元</span><span class="text-primary" @click="recharge = false">修改</span></li>
		  	</ul>
		  	<div class="m-t-lg">
					<ul class="ukao-tabs-nav clearfix">
						<li class="ukao-tabs-item" v-for="(item, index) in tabsNavList" v-bind:class="{ 'is-active': active == index }" v-on:click="toggle(index, item.view)" v-text="item.text"></li>
					</ul>
					<div class="m-t">
						<div v-if="currentView == 'firstChild'"> 
							<div class="recharge-scan clearfix wrapper">
								<div class="left">
									<qrcode class="thumb-xl" :value="rechargeUrl + ruleForm.amt"  v-if="ruleForm.amt"  :options="{ size: 128 }"></qrcode>
								</div>
								<div class="right">
									<p>微信或支付宝支付，成功后立即充值到账</p>
									<div class="m-t-lg">
										<el-button type="primary" @click="rechargeOk">我已成功支付</el-button>
										<el-button @click="rechargeOk">支付遇到问题</el-button>
									</div>
								</div>
							</div>
						</div> 
						<div v-if="currentView == 'secondChild'">
							<div class="recharge-transfer">
								<p class="m-b-sm">您需转账<span class="text-danger">{{ruleForm.amt}} 元</span>至以下账户，转账成功后填写相应信息并提交审核</p>
								<p><span class="name dis-inline">收款方户名:</span>桐叶粑粑科技（湖南）有限公司</p>
								<p><span class="name dis-inline">收款方开户行:</span>招商银行麓谷支行</p>
								<p><span class="name dis-inline">收款账号:</span>57190 717701 0808</p>
							</div>
							<div class="m-t text-right">
						    <el-button type="primary" @click="rechargeFunc">已转账汇款，我要上传凭证</el-button>
						  </div>
						</div>
					</div>
				</div>
		  </div>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="线下转账凭证"
		  :visible.sync="transferVoucher"
		  size="small">
		  <div class="transfer-voucher">
	  		<p class="text-muted">收款方信息</p>
	  		<div class="m-t-sm">
	  			<p><span class="name dis-inline">户名：</span>桐叶粑粑科技（湖南）有限公司</p>
	  			<p><span class="name dis-inline">开户行：</span>招商银行麓谷支行</p>
	  			<p><span class="name dis-inline">账号：</span>57190 717701 0808</p>
	  		</div>
		  	<div class="m-t-md m-b b-t-dashed"></div>
	  		<p class="text-muted">付款信息</p>
	  		<div class="padder-lg m-t-sm m-r-lg">
	  			<el-form ref="form" :model="form" label-width="140px">
					  <el-form-item label="户名：" 
						prop="name"
						:rules="[
							{ required: true, message: '请输入户名', trigger: 'blur' },
						]">
					    <el-input v-model.trim="form.name"></el-input>
					  </el-form-item>
					  <el-form-item label="开户行：">
					    <el-input placeholder="例：招商银行 麓谷分行" v-model="form.bank"></el-input>
					  </el-form-item>
					  <el-form-item label="账号："
						prop="account"
						:rules="[
							{ required: true, message: '请输入账号', trigger: 'blur' },
						]">
					    <el-input v-model.trim="form.account"></el-input>
					  </el-form-item>
					  <el-form-item label="金额：">
							{{ruleForm.amt}}元
					  </el-form-item>
					  <el-form-item label="付款时间：">
					    <el-date-picker
					      v-model="form.date"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="transferVoucherFunc">确认提交</el-button>
					  </el-form-item>
					</el-form>
	  		</div>
		  </div>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="转账汇款凭证"
		  :visible.sync="voucher"
		  size="small">
		  <div>凭证提交后，通洗将在2个工作日完成审核，审核通过后充值成功，你可使用店铺余额进行交易。</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="voucher = false">我知道了</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>

  import auth from '@/utils/auth'
  import consts from '@/utils/consts'
  import qrcode from '@xkeshi/vue-qrcode'
	import validate from '@/utils/helpers/validate'
	import setTime from '@/utils/helpers/timeLite'
  import bizconsts from '@/utils/bizconsts'
  export default {
  	components: {
      qrcode: qrcode
		},
  	data: function() {
			return {
			  rechargeUrl: consts.WX_URL + '/recharge_confirm?amt=',
        mercInfo: auth.getMercInfo(),
        mercIncome: {},
				ruleForm: {
          amt: ''
        },
        rules: {
          amt: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
          ]
        },
        recharge: false,
        rechargeSuccess: false,
        transferVoucher: false,
        voucher: false,
        active: 0,
				currentView: 'firstChild',
				tabsNavList: [
					{ view: 'firstChild', text: '线上扫码充值' },
					{ view: 'secondChild', text: '线下转账充值' }
				],
	      form: {
	      	name: '',
	      	bank: '',
	      	account: '',
	      	date: ''
	      }
			}
		},
    created() {
      this.getMercIncome();
    },
		methods: {
      checkAmount(rule, value, callback) {
				if(!value || value < rule.min || value > rule.max){
					callback(new Error('金额应在1 ~ 1000000元之间，并保留两位小数'));
				} else if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
          callback(new Error('无效的金额,保留两位小数'));
        } else {
          callback();
        }
      },
      rechargeDialog() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.recharge = true;
					}
        })
			},
      toggle: function(i, v) {
				this.active = i;
				this.currentView = v;
			},
			rechargeFunc: function() {
				this.recharge = false;
				var _this=this;
				setTimeout(function(){
					_this.transferVoucher = true;
				}, 500);
			},
			transferVoucherFunc() {
        this.$refs['form'].validate((valid) => {
					if(valid){
						let time =setTime.getDateTime(this.form.date) || '';
						this.$store.dispatch('post',{
							uri:'tradeAudit/merc/recharge',
							data:{
								accountName:this.form.name,
								bankName:this.form.bank,
								accountNo:this.form.account,
								payMethod:bizconsts.TRADE.PAY_UNION,
								amount:this.ruleForm.amt,
								tradeTime: time
							}
						}).then(res=>{
							this.transferVoucher = false;
							this.voucher = true;
						})
					}
				})
			},
			rechargeOk: function() {
				this.recharge = false;
//				var _this=this;
//				setTimeout(function(){
//					_this.rechargeSuccess = true;
//				}, 500);
        this.getMercIncome();
			},
      getMercIncome(){
        this.$store.dispatch('post', {
          uri: 'mercIncome/detail',
        }).then((res) => {
          if (res.data.data) {
            this.mercIncome = res.data.data;
          }
        })
      }
    }
  }
</script>

<style scoped>
	.tip {
		max-width: 800px;
		background: #f3f7ff;
		padding: 10px 20px;
		line-height: 1.6;
		font-size: 12px;
		border-radius: 8px;
	}
	.recharge-info-list li {
		line-height: 26px;
	}
	.recharge-transfer {
		padding: 10px 15px;
		background: #f8f8f8;
	}
	.recharge-transfer .name {
		width: 100px;
		margin-right: 10px;
		text-align: right;
		line-height: 26px;
	}
	.recharge-scan {
		text-align: right;
	}
	.recharge-scan .left {
		float: left;
		margin-left: 50px;
	}
	.recharge-scan .right {
		margin-left: 180px;
		margin-top: 42px;
	}
	.transfer-voucher .name {
		width: 160px;
		margin-right: 10px;
		text-align: right;
		line-height: 26px;
	}
	.b-t-dashed {
		border-top: 1px dashed #aaa;
	}
</style>
