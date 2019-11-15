<style lang="less" scoped>
.print {
  width: 800px;
  margin: 0 auto;
}
.table-b {
  border-top: 1px solid #4a4a4a;
  border-left: 1px solid #4a4a4a;
}
.content {
  color: #414141;
  height: 52px;
  overflow: hidden;
}
.tr-b {
  border-bottom: 1px solid #4a4a4a;
  border-right: 1px solid #4a4a4a;
}
.th-bg {
  background-color: #cdcdcd;
}
</style>

<template>
  <div class="print">
    <div class="header clearfix" v-if="detail">
      <div class="pull-left">
        <div class="font-bold text-black m-b-sm">
          <span class="text-xl m-r-lg">出厂衣物清单</span>
          <span>共 {{(detail.productCnt + detail.annexCnt) || 0}} 件（衣服{{detail.productCnt  || 0}}件，附件{{detail.annexCnt || 0}}件）</span>
        </div>
        <div>
          <span class="m-r-sm">{{detail.factoryName}}</span>
          <span class="m-r-sm">至</span> 
          <span class="m-r">{{detail.storeName}}</span>
          <span>打印日期：{{time | getDate}}&nbsp;{{time | getTime}}</span>
        </div>
      </div>
      <div class="pull-right">
        <Qrcode class="m-r-sm" :value="detail.code" :options="{ size: 65 }"></Qrcode>
        <barcode :value="detail.code" tag="img" :options="{width:2,height:30,fontSize:14,fontOptions:'bold',textAlign: 'left',}"></barcode>      </div>
    </div>
    <el-row class="table-b">
      <el-col class="tr-b th-bg" :span="5">衣物条码</el-col>
      <el-col class="tr-b th-bg" :span="4">名称</el-col>
      <el-col class="tr-b th-bg" :span="3">服务</el-col>
      <el-col class="tr-b th-bg" :span="5">衣物条码</el-col>
      <el-col class="tr-b th-bg" :span="4">名称</el-col>
      <el-col class="tr-b th-bg" :span="3">服务</el-col>
      <template v-for="(item,index) in list">
        <el-col class="tr-b" :key="index" :span="5">
          <div class="content text-center">
            <barcode :value="item.scanCode" tag="img" :options="{width:1,height:30,fontSize:12,displayValue: false}"></barcode>
          </div>
        </el-col>
        <el-col class="tr-b" :key="index" :span="4">
          <div class="content">
            <div>{{item.productName}}</div>
            <div class="text-xs">{{item.scanCode}}</div>
          </div>
        </el-col>
        <el-col class="tr-b" :key="index" :span="3"><div class="content text-sm">{{item.serviceName}}</div></el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import barcode from "@xkeshi/vue-barcode";
import Qrcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      id: null,
      detail: null,
      list: [],
      time: 0
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getDetail();
    this.getList();
  },
  methods: {
    getDetail() {
      this.$store
        .dispatch("post", {
          uri: "api/orderProductBatchOut/detail",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
          this.time = res.data.timestamp;
        });
    },
    getList() {
      this.$store
        .dispatch("post", {
          uri: "api/orderProductBatchOut/proList",
          data: {
            outId: this.id
          }
        })
        .then(res => {
          this.list = res.data.data || [];
        });
    }
  },
  components: {
    barcode,
    Qrcode
  }
};
</script>
