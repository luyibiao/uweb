<template xmlns="http://www.w3.org/1999/html">
	<div>
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item to="/finance/check/summary"><i class="el-icon-arrow-left icon-smaller"></i>对账单</el-breadcrumb-item>
		  <el-breadcrumb-item>账单汇总</el-breadcrumb-item>
		</el-breadcrumb>
		<p class="text-black m-t">{{Dates.chinaDate}}汇总账单</p>
		<div class="m-t-xl">
			<p><span class="text-muted m-l-lg">起始日期：</span>{{Dates.staticDate}} &nbsp;&nbsp;&nbsp;<span class="text-muted m-l-lg">终止日期：</span>{{Dates.endDate}}</p>
			<div class="wrapper b-t b-b m-t">
				<el-row :gutter="20">
				  <el-col :span="6" class="b-r">
				  	<div class="text-center">
				  		<p>上期余额</p>
				  		<p class="text-black text-xl m-t-xs">{{money.previousBalance | amtFormat}}</p>
				  	</div>
				  </el-col>
				  <el-col :span="6" class="b-r">
				  	<div class="text-center">
				  		<p>本期收入</p>
				  		<p class="text-black text-xl m-t-xs">{{money.income | amtFormat}}</p>
				  	</div>
				  </el-col>
				  <el-col :span="6" class="b-r">
				  	<div class="text-center">
				  		<p>本期支出</p>
				  		<p class="text-black text-xl m-t-xs">{{money.spend | amtFormat}}</p>
				  	</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="text-center">
				  		<p>本期余额</p>
				  		<p class="text-black text-xl m-t-xs">{{money.balance | amtFormat}}</p>
				  	</div>
				  </el-col>
				</el-row>
			</div>
			<div class="m-t-lg">
				<el-row :gutter="40">
				  <el-col :span="12">
				  	<p class="title">本期收入</p>
				  	<ul class="content" >
				  		<li class="b-b">业务类型<span class="pull-right">收入金额</span></li>
				  		<li class="b-b" v-for="item in tableData" v-if="item.amount>0">
                <p>{{item.tradeTypeText}}	<span class="pull-right" >{{item.amount | amtFormat}}</span></p>
							</li>
				  		<li class="b-b">合计收入
								<span class="pull-right  text-success" >{{money.income | amtFormat}}</span>
							</li>
				  	</ul>
				  </el-col>
				  <el-col :span="12">
				  	<p class="title">本期支出</p>
				  	<ul class="content">
				  		<li class="b-b">业务类型<span class="pull-right">支出金额</span></li>
							<li class="b-b" v-if="money.fee>0"><p>手续费<span class="pull-right">-{{money.fee | amtFormat}}</span></p></li>
				  		<li class="b-b" v-for="item in tableData" v-if="item.amount<0">
				  			<p>{{item.tradeTypeText}}<span class="pull-right">{{item.amount| amtFormat}}</span></p>
				  		</li>
				  		<li class="b-b">合计支出<span class="pull-right text-danger">-{{money.spend | amtFormat}}</span></li>
				  	</ul>
				  </el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>

  import consts from "@/utils/consts";
  import msg from "@/utils/msg"

	export default {
		data: function() {
			return {
       // loading: false,
        tableData: [],
        money:{
          balance:0,
          previousBalance:0,
          spend:0,
          income:0,
					fee:0,
        },
        income:0,
        debit:0,
				Dates:{
          chinaDate:'',
					staticDate:'',
					endDate:'',
				},
      };
		},
    created() {
      this.initPramas();
      this.list();
      this.queryBalance();
    },
    methods: {
      list() {
        this.$store
          .dispatch("post", {
            uri: "tradeBillSumDetail/list",
            data: {
              settleDate: this.$route.params.settleDate,
            }
          })
          .then(res => {
            this.tableData = res.data.data;
            /*for(var imet in this.tableData){
              let arr = this.tableData[imet];
              if(arr.trade_type=='0201'){
                this.income=arr.amount;
              }
              if(arr.trade_type=='0202'){
                this.debit=arr.amount;
              }
						}*/
          });
      },
      initPramas() {
        var parameterDate =this.$route.params.settleDate;
        var oldTime = (new Date(parameterDate)).getTime();
        var formatTime = "YYYY年MM月";
        if(parameterDate.length>7){
          formatTime = "YYYY年MM月DD日";
          this.Dates.staticDate = parameterDate+" 00:00:00";
          this.Dates.endDate = parameterDate+" 23:59:59";
				}else{
          this.Dates.staticDate = parameterDate+"-01 00:00:00";
          let dateArr = parameterDate.split("-");
          let lastDate =  new Date(dateArr[0],dateArr[1],0).getDate();
          this.Dates.endDate = parameterDate+"-"+lastDate+" 23:59:59";
				}
        this.Dates.chinaDate = new Date(oldTime).format(formatTime);

      },
      queryBalance(){
        let queryDate = "";
        if(document.getElementById('queryTime')){
          queryDate = document.getElementById('queryTime').getElementsByTagName("input")[0].value;
        }
        this.$store.dispatch('post', {
          uri: 'tradeBillSum/queryDetail',
          data: {
            settleDate : this.$route.params.settleDate,
          }
        }).then((res) => {
          let moneyList = res.data.data;
            this.money.previousBalance =moneyList?moneyList.previousBalance:0;
            this.money.balance = moneyList?moneyList.balance:0;
            this.money.spend  = moneyList?moneyList.spend:0;
            this.money.income = moneyList?moneyList.income:0;
            this.money.fee = moneyList?moneyList.fee:0;
           })
        },
      }
    }

</script>

<style scoped>
	.title {
		background: #f8f8f8;
		padding: 10px 15px;
	}
	.content li {
		padding: 10px 15px;
	}
</style>