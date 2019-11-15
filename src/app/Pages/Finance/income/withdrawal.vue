<template>
	<div class="ukao-pt-lg">
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="/finance/income"><i class="el-icon-arrow-left icon-smaller"></i>我的收入</el-breadcrumb-item>
			  <el-breadcrumb-item>申请提现</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="m-t-lg ukao-el-form-container">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
			  <el-form-item label="可提现金额">
					<span class="text-danger text-xl">{{mercIncome.balance | amtFormat}}</span> 元
			  </el-form-item>

				<el-form-item label="选择提现银行" prop="bankIndex">
					<el-select class="w-xl" v-model="ruleForm.bankIndex" @change="bankChange" placeholder="请选择">
						<el-option v-for="(item, index) in walletList" :key="item.id" :label="getValText(item.bankCode,'BANK') + ' ' + item.accountLessNo + ' '+ item.accountName" :value="index">
							<span style="float: left">{{item.bankCode | getValText('BANK')}} {{ item.accountLessNo }} {{item.accountName}}</span>
							<span style="float: right;"><router-link :to="'withdrawal/edit/' + item.id" class="text-primary">修改</router-link>|<a class="text-primary" @click="delWallet(item.id)">删除</a></span>
						</el-option>
					</el-select>
					<router-link to="withdrawal/edit" class="text-primary">添加银行卡</router-link>
				</el-form-item>
				<el-form-item label="提现金额" prop="amount">
					<span class="w-xl dis-inline"><el-input v-model="ruleForm.amount" :placeholder="'最多可提现' + incomeBalance + '元'"></el-input></span>
				</el-form-item>

			  <el-form-item>
			  	<el-button type="primary" @click="withdrawApply">确认提现</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>

  import calculation from "@/utils/helpers/calculation";
  import msg from "@/utils/msg";
  import keyval from '@/utils/dickeyval';
  import validate from "@/utils/helpers/validate";

	export default {
		data: function() {
			return {
        walletList: [],
        mercIncome: {},
				ruleForm: {
          accountNo:'',
          accountName:'',
          bankType: '',
          bankName: '',
          amount: '',
          bankIndex: '',
					remark:''
        },
        rules: {
          bankIndex: [
            {type: 'number', required: true, message: '请选择银行卡', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请输入金额', trigger: 'blur'},
            {
							validator: (rule, value, callback) => {
								if (value || value === 0) {
									this.valiPayAmt(rule, value, callback)
								} else {
									callback();
								}
							}, trigger: "blur"
						}
					]
        },
			}
		},
		created() {
      this.getMercIncome();
      this.queryWalletList();
		},
		computed: {
			incomeBalance() {
        return calculation.accDiv(this.mercIncome.balance || 0, 100)
			}
		},
		methods: {
      valiPayAmt(rule, value, callback) {
        if(validate.amount(value, 2, 0.01, 99999999)) {
          let balance = calculation.accDiv(this.mercIncome.balance || 0, 100);
          if (value <= balance) {
            callback()
					} else {
            callback(new Error('金额不能大于' + balance))
					}
				} else {
          callback(new Error('金额格式错误'))
				}
      },
      getValText(val, key) {
        let list = keyval[key];
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.val == val) {
            return item.text;
          }
        }
        return val;
      },
      getMercIncome() {
        this.$store
          .dispatch("post", {
            uri: "mercIncome/detail"
          })
          .then(res => {
            if (res.data.data) {
              this.mercIncome = res.data.data;
            }
          });
      },
			queryWalletList() {
        this.$store
          .dispatch("post", {
            uri: "tradeWallet/mercList"
          })
          .then(res => {
            if (res.data.data) {
              this.walletList = res.data.data;
            }
          });
			},
			delWallet(id) {
        msg.confirm({
          msg: "确认删除？",
          confirmFn: _ => {
            this.$store
              .dispatch("post", {
                uri: "tradeWallet/delete",
                data: {
                  id
                }
              })
              .then(res => {
                msg.success();
                this.ruleForm.bankIndex = '';
                this.queryWalletList();
              });
          }
        });
			},
      bankChange(index){
        if (typeof (index) !=='undefined' && index !== '') {
          this.ruleForm.accountNo = this.walletList[index].accountNo;
          this.ruleForm.accountName = this.walletList[index].accountName;
          this.ruleForm.bankType = this.walletList[index].bankType;
          this.ruleForm.bankName = this.getValText(this.walletList[index].bankCode,'BANK');
          this.ruleForm.remark = this.ruleForm.bankName + this.walletList[index].accountLessNo
				}
			},
      withdrawApply() {

				this.$refs['ruleForm'].validate((valid) => {
				  if (valid) {

				    let ruleForm = {...this.ruleForm};
            ruleForm.amount = calculation.accMul(ruleForm.amount, 100);
//						console.log(ruleForm);
//						return;
            this.$store
              .dispatch("post", {
                uri: "tradeAudit/merc/withdraw/apply",
                data: ruleForm
              })
              .then(res => {
                msg.success();
                this.$router.push("/finance/income");
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