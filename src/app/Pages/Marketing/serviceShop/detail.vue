<template>
<div class="box-ft">
  <div>
     <el-breadcrumb separator="/">
        <el-breadcrumb-item to="../single">
          <i class="el-icon-arrow-left icon-smaller"></i>对账单</el-breadcrumb-item>
        <el-breadcrumb-item>账单汇总</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
  <div class="head">
    <p>{{detail.settleDate}}取送服务商汇总账单</p>
  </div>
  <div v-if="notPayAmt">
    <div class="bill_detail bill-w-f">
      <div class="bill_detail-t">
        <div>
          <p>{{notPayTime}}月账单</p>
          <p class="text-danger text-money">￥{{notPayAmt | amtFormat}}</p>
          <p><router-link :to="'/marketing/serviceShop/trade_find'" class="text-primary">查看账单明细</router-link></p>
        </div>
        <div class="ver-position2">
          <p>请您按照与通洗签订的协议将上月款项付给通洗，如已支付，请忽略</p>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="main-head" v-if="detail.dateType===1">
     <span class="text-muted">起始日期：<label class="date">{{detail.settleDate}} 00:00:00</label></span>
     <span class="pull-right text-muted">终止日期：<label class="date">{{detail.settleDate}} 23:59:59</label></span>
    </div>
    <div class="main-head" v-if="detail.dateType>1">
      <span class="text-muted">起始日期：<label class="date">{{detail.settleDate}}-01 00:00:00</label></span>
      <span class="pull-right text-muted">终止日期：<label class="date">{{detail.settleDate}}-{{detail.settleDate | fitDate}} 23:59:59</label></span>
    </div>
    <div class="main-ul">
      <ul>
        <li>
          <div>
            <p>取件</p>
            <p>{{detail.takeAmt | amtFormat}}</p>
            <p class="text-muted">{{detail.takeCnt}}单</p>
          </div>
        </li>
        <li class="c-br">
          <div>
            <p>送件</p>
            <p>{{detail.sendAmt | amtFormat}}</p>
            <p class="text-muted">{{detail.sendCnt}}单</p>
          </div>
        </li>
        <li>
          <div class="m-li">
            <p>本期金额</p>
            <p>{{(detail.sendAmt+detail.takeAmt) | amtFormat}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
import time from '@/utils/helpers/timeLite'
export default {
  data () {
    return {
      notPayAmt:'',
      notPayTime:'',
      detail:{}
    }
  },
  created () {
    this.getDetail();
  },
  methods: {
    getDetail(){
      this.$store.dispatch('post',{
        uri:'expressBill/detail',
        data:{
          id:this.$route.params.id
        }
      }).then(res=>{
        this.detail=res.data.data;
        if (this.detail.dateType == 2) {
          // 月账单，查询上月未付款金额
          let settleDate = this.detail.settleDate;
          let sDate = new Date(settleDate.split('-')[0], settleDate.split('-')[1], 0);
          this.queryNotPayAmt(time.format(time.add(sDate, -1 , 'months'),'YYYY-MM'));
        }
      })
    },
    queryNotPayAmt(settleDate) {
      this.$store.dispatch('post',{
        uri:'expressBill/queryNotPayAmt',
        data:{
          settleDate:settleDate
        }
      }).then(res=>{
        this.notPayAmt = res.data.data.notPayAmt;
        this.notPayTime = res.data.data.notPayTime;
      });
    }
  },
  filters: {
    fitDate(time){
      if(!time){
        return;
      }
      return new Date(time.split('-')[0], time.split('-')[1], 0).getDate()
    }
  }
}
</script>

<style scoped lang="less">
.head{
  margin: 25px 0px; 
  font-size: 14px;
  font-weight: 600;
}
.bill-w-f{
  width: 560px;
}
.bill-w-t{
  width: 300px;
}
.bill_detail{
  // margin: 0px auto 30px;
  padding: 15px 20px;
  background-color: #fff8ca;
  border:1px solid #ffe0ab;
}
.bill-dong{
   width: 300px;
   padding: 15px 20px;
   background-color: #fff8ca;
}
.bill_detail-t{
  width: 100%;
  display: table;
}
.bill_detail-t>div{
  display: table-cell;
}
.bill_detail-t>div:first-child{
  padding-right: 20px;
  border-right: 2px solid #ffe9af;
  overflow: hidden;
  // background-color: pink;
}
.bill_detail-t>div:first-child>p+p{
  margin-top: 10px;
}
.bill_detail-t>div:last-child{
  // width: 72%;
  position: relative;
  p{
    margin-left: 25px;
  }
  .sf-p{
    margin-top: 15px;
  }
  .btn{
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.ver-position1{
  vertical-align: top;
}
.ver-position2{
  vertical-align: middle;
}
.text-money{
  font-size: 22px;
}
.main-head{
  margin: 40px 0px 20px;
  width: 415px;
}
.date{
  color: #000;
  font-weight: 600;
}
.main-ul{
  padding: 10px 0px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  overflow: hidden;
}
.main-ul ul{
  list-style: none;
  overflow: hidden;
}
.main-ul ul li{
  position: relative;
  float: left;
  width: 33%;
  text-align: center;
}
.m-li{
  margin-top: 10px;
}
.main-ul ul li div>p:nth-child(2){
  font-size: 16px;
  font-weight: 600;
}
.c-br{
   border-left: 1px solid #e5e5e5;
   border-right: 1px solid #e5e5e5;
}
</style>
