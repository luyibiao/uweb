<template>
  <div class="orderall">
    <el-row :gutter="20" style="height:720px;">
      <el-col :span="18" style="height: 100%;">
        <div class="order_de">
          <p class="label"><label>|</label>订单统计</p>
          <el-row :gutter="20" style="margin:10px;">
            <el-col :span="4" >
              <div class="grid-content bg-purple" @click="toTakeOrder(3)">
                <p class="text-vl font-bold l-h color_red">{{data.receivingCnt}}</p>
                <p>上门取件(未取)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toTakeOrder(5)">
                <p class="text-vl font-bold l-h color_blue">{{data.receivedCnt}}</p>
                <p>上门取件(未交)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toSendOrder(38)">
                <p class="text-vl font-bold l-h color_blue">{{data.onStoreCnt}}</p>
                <p>上门送件(在店)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toSendOrder(41)">
                <p class="text-vl font-bold l-h color_blue">{{data.forUserCnt}}</p>
                <p>上门送件(途中)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toBatchIn(1)">
                <p class="text-vl font-bold l-h color_blue">{{data.inWaitingCnt}}</p>
                <p>进厂(未取)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toBatchIn(2)">
                <p class="text-vl font-bold l-h color_blue">{{data.inSendingCnt}}</p>
                <p>进厂(途中)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toBatchOut(1)">
                <p class="text-vl font-bold l-h color_blue">{{data.outWaitingCnt}}</p>
                <p>出厂(未取)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toBatchOut(2)">
                <p class="text-vl font-bold l-h color_blue">{{data.outSendingCnt}}</p>
                <p>出厂(途中)</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toTakeOrder(1)">
                <p class="text-vl font-bold l-h color_red">{{data.createCnt}}</p>
                <p>待接单</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toUnPayOrder">
                <p class="text-vl font-bold l-h color_red">{{data.unpayCnt}}</p>
                <p>未付款</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toOrder(60)">
                <p class="text-vl font-bold l-h color_blue">{{data.cancelCnt}}</p>
                <p>已取消</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="toOrder(61)">
                <p class="text-vl font-bold l-h color_blue">{{data.destroyCnt}}</p>
                <p>已作废</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="noAssign">
                <p class="text-vl font-bold l-h color_red">{{data.noAssignCnt}}</p>
                <p>待指派</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple" @click="overTime">
                <p class="text-vl font-bold l-h color_red">{{data.receivingOverCnt}}</p>
                <p>超时未派</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6" style="height:100%;">
        <el-row>
          <el-col :span="24">
            <div class="service_box">
              <p class="label"><label>|</label>取送服务商</p>
              <div class="service_box_main">
                <div class="bg-purple" @click="orderExpress">
                  <span>未接单<p style="color: #9c9c9c;font-size: 12px">(含超时未接单)</p></span>
                  <span class="color_red">{{express.noOrderCnt}}</span>
                </div>
                <div class="bg-purple" @click="overTimeNoOrderExpress">
                  <span>超时未接单</span>
                  <span class="color_red">{{express.overTimeNoOrderCnt}}</span>
                </div>
                <div class="bg-purple" @click="noTakeExpress">
                  <span>未取件<p style="color: #9c9c9c;font-size: 12px">(含超时未取件)</p></span>
                  <span class="color_blue">{{express.noTakeCnt}}</span>
                </div>
                 <div class="bg-purple" @click="overTimeNoTakeExpress">
                   <span>超时未取件</span>
                   <span class="color_blue">{{express.overTimeNoTakeCnt}}</span>
                 </div>
                <div class="bg-purple" @click="noSendExpress">
                  <span>未送件</span>
                  <span class="color_blue">{{express.noSendCnt}}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {
        receivingCnt:0,
        receivedCnt:0,
        onStoreCnt:0,
        forUserCnt:0,
        createCnt:0,
        unpayCnt:0,
        inWaitingCnt:0,
        inSendingCnt:0,
        outWaitingCnt:0,
        outSendingCnt:0,
        cancelCnt:0,
        destroyCnt:0,
        noAssignCnt:0,
        receivingOverCnt:0
      },
      express: {
        noOrderCnt:0,
        overTimeNoOrderCnt:0,
        noTakeCnt: 0,
        overTimeNoTakeCnt:0,
        noSendCnt: 0,
      }
    }
  },
  created() {
    this.querySurvey();
    this.expressSurvey();
  },
  methods: {
    querySurvey() {
      this.$store.dispatch('post', {
        uri: 'reportOrderStatus/querySurvey'
      }).then((res) => {
        this.data = res.data.data;
      });
    },
    expressSurvey(){
      this.$store.dispatch('post', {
        uri: 'expressInfo/querySurvey'
      }).then((res) => {
        this.express = res.data.data;
      });
    },
    toTakeOrder(statusVal) {
      this.$router.push({
        path: '/order/list/all',
        query: {statusVal:statusVal, takeMode:2}
      });
    },
    toSendOrder(statusVal) {
      this.$router.push({
        path: '/order/list/all',
        query: {statusVal:statusVal, sendMode:2}
      });
    },
    toOrder(statusVal) {
      this.$router.push({
        path: '/order/list/all',
        query: {statusVal}
      });
    },
    noAssign(){
      this.$router.push({
        path: '/order/list/all',
        query: {statusVal:1, takeMode:2, statusList:["noAssignTakeWork"]}
      });
    },
    overTime(){
      this.$router.push({
        path: '/order/list/all',
        query: {statusVal:1, takeMode:2, statusList:["noAssignTakeWork","overtime"]}
      });
    },
    noTakeExpress(){
      this.$router.push({
        path: '/order/express/take',
        query: {expressStatus:'3'}
      });
    },
    overTimeNoTakeExpress(){
      this.$router.push({
        path: '/order/express/take',
        query: {expressStatus:'3',overTime:'1'}
      });
    },
    orderExpress(){
      this.$router.push({
        path: '/order/express/take',
        query: {expressStatus:'1',isTake:'0'}
      });
    },
    overTimeNoOrderExpress(){
      this.$router.push({
        path: '/order/express/take',
        query: {expressStatus:'1',isTake:'0',overTime:'1'}
      });
    },
    noSendExpress(){
      this.$router.push({
        path: '/order/express/send',
        query: {isTake:'0'}
      });
    },
    toUnPayOrder() {
      this.$router.push({
        path: '/order/list/all',
        query: {payStatus: '0'}
      });
    },
    toBatchIn(status) {
      this.$router.push({
        path: '/product/batchIn',
        query: {status}
      });
    },
    toBatchOut(status) {
      this.$router.push({
        path: '/product/batchOut',
        query: {status}
      });
    }
  }
}
</script>

<style lang="less" scoped>
.orderall {
  padding-top: 120px;
}

.color_blue{
  color: #1989fa
}

.color_red{
  color: #ff5151
}

.bg-purple {
  background: #fff;
  &:hover {
    background: #f2f2f2;
  }
}

.grid-content {
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 50px 0;
  text-align: center;
  border-radius: 8px;
  min-height: 36px;
  .l-h {
    font-size: 40px;
  }
}
.order_de{
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  overflow: hidden;
}
.label{
  font-size: 18px;
  font-weight: 600;
  margin: 20px;
  &>label{
    color: #1989f9;
    font-weight: 800;
    margin-right: 10px;
  }
}
.service_box{
  background: #f8f8f8;
  height: 720px;
  overflow: hidden;
  .service_box_main{
    height: 373px;
  }
  .service_box_main>div{
    display: table;
    border-radius: 8px;
    cursor: pointer;
    height: 30%;
    width: 90%;
    margin: 20px auto;
    span{
      display: table-cell;
      vertical-align: middle;
      width: 50%;
      text-align: center;
    }
    &>:first-child{

    }
    &>:last-child{
      font-size: 40px;
      font-weight: 700;
    }
  }
}
</style>
