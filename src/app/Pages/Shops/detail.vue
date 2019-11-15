<template>
  <div>
    <el-breadcrumb separator="/" class="m-b">
      <el-breadcrumb-item :to="{ path: '/shops/order' }"><i class="el-icon-arrow-left icon-smaller"></i>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="loading">
      <ul class="order-progress clearfix b-a m-b">
        <li :style="{'width':`${(100/progress.list.length).toFixed(2)}%`}" class="order-progress-item" v-for="(item , index) in progress.list" :key="index" :class="{'is-done':index <= progress.index }">
          <div class="progress-title">{{item.showText}}</div>
          <div class="status-line">
            <span class="status-logo"></span>
          </div>
          <div class="progress-desc" v-if="item.createTime">
            {{item.createTime | getDate(item.createTime)}}
            {{item.createTime | getTime(item.createTime)}}
          </div>
        </li>
      </ul>
      <div class="b-a main clearfix m-b-lg">
        <div class="wrapper box pull-left b-r">
          <p class="text-md l-h36">订单信息</p>
          <ul class="order-form">
            <li>
              <div class="order-label">
                订单编号：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.orderNo}}
              </div>
            </li>
            <li>
              <div class="order-label">
                下单渠道：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.originText}}
              </div>
            </li>
            <!--<li>-->
              <!--<div class="order-label">-->
                <!--付款方式：-->
              <!--</div>-->
              <!--<div class="order-content">-->
                <!--&nbsp;-->
                <!--<span class="text-muted">{{orderInfo.payStatusText}}</span>-->
              <!--</div>-->
            <!--</li>-->
            <li>
              <div class="order-label">
                客户：
              </div>
              <div class="order-content">
                &nbsp;<a target="_blank" :href="'/client/list/'+orderInfo.userId+'/basic'" class="text-primary">{{orderInfo.userPhone}}</a>
                <a target="_blank" :href="'/client/list/'+orderInfo.userId+'/basic'" class="text-primary">{{orderInfo.userName}}</a>
              </div>
            </li>

            <li>
              <div class="order-label">
                配送方式：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.sendMethodText}}
              </div>
            </li>
            <li>
              <div class="order-label">
                订单状态：
              </div>
              <div class="order-content">
                <span>&nbsp;{{orderInfo.statusText}} </span>
                <el-button v-if="orderInfo.isEnableDestroy"  class="m-l-sm" size="small" @click="setCancel(orderInfo.id)">取消订单</el-button>
              </div>
            </li>
            <li v-if="orderInfo.storeName">
              <div class="order-label">
                自提门店：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.storeName}}
              </div>
            </li>
            <li class="line-dashed m-b m-t"></li>
            <li>
              <div class="order-label">
                收货信息：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.sendAddress}} {{orderInfo.sendPhone}} {{orderInfo.sendName}}
              </div>
            </li>
            <li>
              <div class="order-label">
                客户留言：
              </div>
              <div class="order-content">
                &nbsp;{{orderInfo.userRemark || '-'}}
              </div>
            </li>
          </ul>
        </div>
        <div class="wrapper box pull-left">
          <p class="text-md l-h36">支付状态：{{orderInfo.payStatusText}}</p>
          <p class="text-md l-h36" v-if="orderInfo.payStatus === 1">支付金额：<span class="text-success">￥{{orderInfo.paymentPrice | amtFormat}}</span></p>
          <p v-if="orderInfo.payStatus === 1 && orderInfo.coupon && orderInfo.coupon.code" class="text-muted" >
            礼券：{{orderInfo.coupon.code}},{{orderInfo.coupon.secret}}
          </p>
          <p class="m-b-md text-muted" v-if="orderInfo.expTime">订单过期时间：{{orderInfo.expTime | getDate}} {{orderInfo.expTime | getTime}}</p>
          <p class="m-b-xs m-t-sm">
            <auth perm="shops.order.remark">
              <el-button type="text" @click="openDialog('管理备注','remark',addRemark)">管理备注</el-button>
            </auth>
            <auth perm="shops.order.update">
              <el-button type="primary" @click="openDialog('发货','delivery',getDelivery)" v-if="orderInfo.isEnableExpress">发货</el-button>
              <el-button type="primary" @click="setSigned(orderInfo)" v-if="orderInfo.isEnableSigned">已签收</el-button>
              <el-button type="primary" @click="setFinish(orderInfo)" v-if="orderInfo.isEnableFinish">已完成</el-button>
            </auth>
            <auth perm="shops.order.refund">
              <el-button type="danger" @click="openDialog('退货','returns',getReturnGoods)" v-if="orderInfo.isEnableBackOrder">退货</el-button>
            </auth>
          </p>
          <div class="line-dashed m-b m-t"></div>
          <p class="order-form">
            <div class="order-label">
              管理备注：
            </div>
            <div class="order-content">
              {{orderInfo.remark || '-'}}
            </div>
          </p>
        </div>
      </div>
      <el-table class="ukao-el-table ukao-tabel-bg"
        :data="goodsList">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="shops-item">
              <img :src="scope.row.goodsImg || '/static/img/logo.png'" alt="" class="logo">
              <div class="content">
                <p class="text-primary">{{scope.row.goodsName}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格（元）">
          <template slot-scope="scope">
            {{scope.row.price | amtFormat}}
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            {{scope.row.count }}
          </template>
        </el-table-column>
        <el-table-column label="优惠（元）">
          <template slot-scope="scope">
            -
          </template>
        </el-table-column>
        <el-table-column label="小计（元）">
          <template slot-scope="scope">
            {{scope.row.subtotal | amtFormat}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.statusText}}
          </template>
        </el-table-column>
      </el-table>
      <div class="padder-v b-b text-right">
      <p>订单共{{orderInfo.count}}件商品，总计：<span class="text-danger">￥{{(orderInfo.paymentPrice || 0) | amtFormat}}</span>（含运费￥{{(orderInfo.carriage || 0) | amtFormat}}）</p>
    </div>
    </div>
    <el-dialog class="ukao-dialog"
               :title="dialog.title"
               :visible.sync="dialog.visible">
      <!-- 备注 -->
      <el-form  v-show="dialog.type == 'remark'" 
                :model="ruleForm" 
                ref="ruleForm" 
                label-width="160px">
        <el-form-item
          label="内容" prop="remark" :rules="[
            { min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
          ]">
          <div class="w-lg">
            <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 6}" v-model.trim="ruleForm.remark" auto-complete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialog.visible=false">取消</el-button>
          <el-button type="primary" @click="saveRemark('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
      <!-- 发货 -->
      <delivery v-show="dialog.type == 'delivery'" 
                @cancel="dialog.visible = false"
                @success="deliverySuccess"
                :goods="deliveryGoods.list" 
                :address="deliveryGoods.address"></delivery>
      <!-- 退货 -->
      <returns v-show="dialog.type == 'returns'" 
               :goods="returnGoods"
               :refundablePrice="orderInfo.refundablePrice || 0"
               @success="returnSuccess"
               @cancel="dialog.visible = false"></returns>
    </el-dialog>
  </div>
</template>
<script>
  import delivery from './components/delivery'
  import returns from './components/returns'
  import msg from "@/utils/msg";
export default {
  data() {
    return {
      loading: false,
      progress: {
        index:0,
        list: [],
      },
      orderInfo:{},
      goodsList:[],
      // 弹窗
      dialog:{
        visible:false,
        title:'提示',
        type:'remark'
      },
      // 备注表单
      ruleForm:{
        id:'',
        remark:''
      },
      // 修改物流的商品信息
      deliveryGoods:{
        address:"",
        list:[]
      },
      // 待退款商品
      returnGoods:[]
    };
  },
  created() {
    this.queryInfo()
  },
  methods: {
    queryInfo(){
      this.loading = true;
      this.getDetail(_ =>{
          this.getGoodsList();
          this.loading = false;
      });
      this.getProgress();
    },
    getDetail(fn) {
      this.$store.dispatch("post", {
        uri: "mall/order/detail",
        data: {
          id: this.$route.params.id
        }
      }).then(res => {
         this.orderInfo = res.data.data
          this.orderInfo.coupon = this.orderInfo.couponDesc ? JSON.parse(this.orderInfo.couponDesc) : {}
         if(typeof (fn) === 'function'){
           fn()
         }
      });
    },
    getGoodsList(){
      var _this = this;
      this.$store.dispatch("post", {
        uri: "mall/order/goods/list",
        data: {
          orderId: this.orderInfo.id
        }
      }).then(res => {
          this.goodsList = res.data.data.list || []
          var count = 0;
          this.goodsList.forEach(function (item) {
            count += item.count
            item.msgList = item.msg ? JSON.parse(item.msg) : []
          })
          this.orderInfo.count = count
      });
    },
    // 获取进度
    getProgress() {
      this.$store
        .dispatch("post", {
          uri: "mall/order/progress",
          data: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          this.progress.list = res.data.data || [];
          this.progress.list.forEach((item, index) => {
            if (item.createTime) this.progress.index = index;
          });
        });
    },
    // 开启弹窗
    openDialog(title, type, fn){
      this.dialog.title = title;
      this.dialog.type = type;
      this.dialog.visible = true;
      fn && fn();
    },
    addRemark(){
      this.ruleForm.id = this.orderInfo.id || ''
      this.ruleForm.remark = this.orderInfo.remark || ''
    },
    saveRemark(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('post', {
            uri: 'mall/order/remark',
            data: {
              id: this.ruleForm.id,
              remark: this.ruleForm.remark,
            }
          }).then((res) => {
            this.orderInfo.remark = this.ruleForm.remark
            msg.success();
            this.dialog.visible = false;
          })
        }
      })
    },
    // 获取需要修改物流的商品
    getDelivery(){ 
      let address = "";
      if(this.orderInfo.sendAddress) address += `${this.orderInfo.sendAddress}，`
      if(this.orderInfo.sendName) address += `${this.orderInfo.sendName}，`
      if(this.orderInfo.sendPhone) address += `${this.orderInfo.sendPhone}，`
      this.deliveryGoods.address = address.replace(/\，$/,'。');
      this.deliveryGoods.list = this.goodsList.filter(item=> item.isExpress !== 1);
    },
    // 发货,修改物流成功！
    deliverySuccess(){
      this.queryInfo();
      msg.success("发货成功");
      this.dialog.visible = false;
    },
    // 获取能退款商品
    getReturnGoods(){
      this.returnGoods = this.goodsList.filter(item=>item.statusVal === 3 || item.statusVal === 1);
    },
    // 退款成功
    returnSuccess(){
      this.loading = true;
      this.getDetail(_=>{
        this.getGoodsList();
        this.loading = false;
      })
      msg.success("退款成功");
      this.dialog.visible = false;
    },
    //已签收
    setSigned(orderInfo){
      var _this = this
      if(orderInfo.isEnableSigned){
        this.$store.dispatch("post", {
          uri: "mall/order/signed",
          data: {
            id: orderInfo.id
          }
        })
        .then(res => {
          orderInfo.isEnableSigned = !orderInfo.isEnableSigned;
          msg.success("订单已签收");
          _this.queryInfo()
        });
      }
    },
    //完成
    setFinish(orderInfo){
      var _this = this
      if(orderInfo.isEnableFinish){
        this.$store.dispatch("post", {
          uri: "mall/order/finish",
          data: {
            id: orderInfo.id
          }
        })
        .then(res => {
          orderInfo.isEnableFinish = !orderInfo.isEnableFinish;
          msg.success("订单已完成");
          _this.queryInfo()
        });
      }
    },
    // 取消订单
    setCancel(id){
      msg.confirm({
        msg:'确定取消该订单吗？',
        confirmFn:_=>{
          this.$store.dispatch("post", {
            uri: "mall/order/destroy",
            data: {
              id
            }
          }).then(res=>{
            this.getDetail();
            msg.success("订单取消成功");
          })
        }
      })
      
    }
  },
  components: {
    delivery,
    returns
  }
};
</script>
<style lang="less" scoped>
.main {
  .box {
    height: 100%;
    width: 50%;
    box-sizing: border-box;
  }
}
// 订单进度条样式
.order-progress {
  padding: 10px;
  .order-progress-item {
    float: left;
    text-align: center;
    &:first-of-type .status-line::before,
    &:last-of-type .status-line::after {
      display: none;
    }
    .progress-title {
      margin-bottom: 10px;
    }
    .progress-desc {
      margin-top: 10px;
    }
    .status-line {
      position: relative;
      &::before,
      &::after {
        content: "";
        width: 50%;
        height: 3px;
        position: absolute;
        top: 50%;
        background-color: #cacaca;
        transform: translateY(-50%);
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
    }
    .status-logo {
      position: relative;
      z-index: 1;
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 5px solid #cacaca;
      border-radius: 50%;
      background: #cacaca url(/static/img/ol_icon.png) no-repeat scroll -48px 0;
      background-size: 64px 32px;
    }
    &.is-done {
      .status-line {
        &::before,
        &::after {
          background-color: #00c800;
        }
      }
      .status-logo {
        background-color: #00c800;
        border-color: #00c800;
      }
    }
  }
}
.line-dashed {
  border-top: 1px dashed #dee5e7;
  height: 0;
}
.order-form {
  line-height: 28px;
}
.order-label {
  float: left;
  text-align: right;
  width: 80px;
  padding-right: 20px;
}
.order-content {
  margin-left: 100px;
}
.shops-item {
  .logo {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
  }
  .content {
    margin-left: 65px;
    line-height: 2;
  }
}
</style>
