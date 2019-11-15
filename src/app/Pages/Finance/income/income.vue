<template>
	<div class="ukao-pt-lg">
		<!--<div class="clearfix wrapper company-info">
			<img class="pull-left v-middle" :src="mercInfo.logoPath||'/static/img/logo.png'" alt="">
			<div class="text">
				<p><span>商户名称：</span>{{mercInfo.name}}</p>
				<p><span>认证状态：</span><template v-if="mercParam.isAuth">已认证</template><template v-else>未认证</template><span class="text-primary m-l" style="display: none;">修改认证</span></p>
				<p><span>认证信息：</span><template v-if="mercParam.mainInfo">{{mercParam.mainInfo}}</template><template v-else>未设置</template></p>
			</div>
		</div>-->
		<div class="ds-basics m-b-md">
			<div class="clearfix">
				<div class="ds-logo pull-left">
					<img :src="mercInfo.logoPath||'/static/img/logo.png'" />
				</div>
				<div class="ds-mc">
					<div class="ds-mc-im">
						<div class="ds-mc-tm">
							<span class="name">{{mercInfo.name}}</span>
							<!--<span class="aut" v-if="mercParam.isAuth">已认证</span>
							<span class="n-aut" v-else>未认证</span>-->
						</div>
					</div>
					<div class="ds-mc-im text-muted">{{mercInfo.symbol}}</div>
					<div class="ds-mc-im" v-if="mercParam.mainInfo">{{mercParam.mainInfo}}</div>
					<div class="ds-mc-im text-muted" v-else>未设置主体信息</div>
				</div>
			</div>
		</div>
		<div class="content wrapper b-a">
			<el-row :gutter="30">
			  <el-col :span="colSpan" class="b-r iconme-box">
					<div>账户余额</div>
					<div class="clearfix m-t-sm">
						<span class="text-danger text-xl">{{mercIncome.balance | amtFormat}}</span> 元
						<auth perm="finance.income.detail.withdrawal">
							<router-link to="income/withdrawal" class="pull-right text-primary m-t-xs">提现</router-link>
						</auth>
						<auth perm="finance.check.list.read">
							<router-link to="/finance/check/list" class="pull-right text-primary m-t-xs m-r-xs">账单明细</router-link>
						</auth>
					</div>
			  </el-col>
			  <el-col :span="colSpan" class="b-r iconme-box" v-if="rateDetail.paymentPartner === 'AllInPay'">
					<div>绑定银行账户</div>
					<div class="m-t-sm" v-if="rateDetail.settleAccount">
						{{rateDetail.settleBank || '-'}}<br>
						（{{rateDetail.settleAccount }}）
					</div>
					<div class="m-t-sm" v-else>未绑定银行账户</div>
			  </el-col>
			  <el-col :span="colSpan" class="iconme-box">
					<p style="padding-left:55px;">手续费率</p>
					<div class="m-t-sm">
						<!--<p class="m-b-xs">-->
							<!--<span class="thumb-lg text-right">借记卡：</span>-->
							<!--<span class="dis-inline" v-if="rateDetail.debitRate || rateDetail.debitRate === 0">{{rateDetail.debitRate / 100}}%</span>-->
							<!--<span class="dis-inline" v-else>-</span>-->
						<!--</p>-->
						<!--<p class="m-b-xs">-->
							<!--<span class="thumb-lg text-right">信用卡：</span>-->
							<!--<span class="dis-inline" v-if="rateDetail.creditRate || rateDetail.creditRate === 0">{{rateDetail.creditRate / 100}}%</span>-->
							<!--<span class="dis-inline" v-else>-</span>-->
						<!--</p>-->
						<p class="m-b-xs">
							<span class="thumb-lg text-right">微信支付：</span>
							<span class="dis-inline" v-if="rateDetail.wxRate || rateDetail.wxRate === 0">{{rateDetail.wxRate / 100}}%</span>
							<span class="dis-inline" v-else>-</span>
						</p>
						<p class="m-b-xs">
							<span class="thumb-lg text-right">支付宝支付：</span>
							<span class="dis-inline" v-if="rateDetail.aliRate || rateDetail.aliRate === 0">{{rateDetail.aliRate / 100}}%</span>
							<span class="dis-inline" v-else>-</span>
						</p>
					</div>
			  </el-col>
			</el-row>
		</div>

	</div>
</template>

<script>
import auth from "@/utils/auth";

export default {
  data: function() {
    return {
      mercInfo: auth.getMercInfo(),
      mercParam: {},
      mercIncome: {},
      rateDetail: {}
    };
  },
  created() {
    this.getMercParam();
    this.getMercIncome();
    // this.getPaymentPartner();
    this.getRateDetail();
  },
  methods: {
    getMercParam() {
      this.$store
        .dispatch("post", {
          uri: "mercParam/detail"
        })
        .then(res => {
          this.mercParam = res.data.data;
        });
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
    // Native AllInPay
    // 获取商户费率配置
    getRateDetail() {
      this.$store
        .dispatch("post", {
          uri: "mercRate/detail"
        })
        .then(res => {
          this.rateDetail = res.data.data || {};
        });
    }
    // 商户获取支付合作方
    // getPaymentPartner() {
    //   this.$store.dispatch("post", {
    //     uri: "mercParam/getPaymentPartner"
    //   });
    // },
  },
  computed: {
    colSpan() {
      return this.rateDetail.paymentPartner === "AllInPay" ? 8 : 12;
    }
  }
};
</script>

<style scoped>

.company-info > img {
  width: 60px;
  height: 60px;
}
.company-info .text {
  margin-left: 70px;
  line-height: 20px;
}
.iconme-box {
  padding: 10px 0;
  height: 145px;
}

.ds-basics .ds-mc .ds-mc-tm .n-aut {
	background: #C0CCDA;
	color: #fff;
	border-radius: 15px;
	padding: 6px 15px;
	font-size: 12px;
	margin-left: 5px
}
.ds-basics .ds-logo {
	width: 85px;
	border-radius: 5px;
	overflow: hidden;
}
.dash .ds-basics {
	width: 100%;
}
.ds-basics .ds-mc-im {
	line-height: 25px;
}
.ds-mc{
	margin-left:110px;
}

.dash .ds-basics {
	width: 100%;
}

.ds-basics .ds-logo {
	width: 85px;
	border-radius: 5px;
	overflow: hidden;
}

.ds-logo img {
	vertical-align: middle;
	width: 85px;
	height: 85px;
}
.ds-mc{
	margin-left:110px;
}
.ds-basics .ds-mc-im {
	line-height: 25px;
}

.ds-basics .ds-mc .ds-mc-tm .name {
	font-size: 18px;
	color: #1F2D3D
}

.ds-basics .ds-mc .ds-mc-tm .aut {
	background: #F7BA2A;
	color: #fff;
	border-radius: 15px;
	padding: 6px 15px;
	font-size: 12px;
	margin-left: 5px
}

.ds-basics .ds-mc .ds-mc-tm .n-aut {
	background: #C0CCDA;
	color: #fff;
	border-radius: 15px;
	padding: 6px 15px;
	font-size: 12px;
	margin-left: 5px
}

.ds-sta p {
	font-style: normal;
	font-size: 40px;
	font-weight: 500;
	line-height: 70px;
	display: block;
	width: 100%;
	text-align: center;
	color: #58B7FF;
}


.ds-info span {
	margin-right: 5px;
}

.ds-info table tr {
	height: 25px;
	line-height: 25px;
}


</style>