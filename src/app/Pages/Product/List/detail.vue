<template>
  <div>
    <div>
      <el-breadcrumb class="link-back" separator="/">
        <el-breadcrumb-item to="/product/all"><i class="el-icon-arrow-left icon-smaller"></i>所有衣物</el-breadcrumb-item>
        <el-breadcrumb-item>衣物详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-loading="loading">
      <table  class="order-detail-tb m-t-lg b-a w-full">
        <tr>
          <td class="wrapper b-r" style="width:50%">
            <div class="order-info">
              <p class="detail-title clearfix"><span class="text-md">订单信息</span>
                <a class="text-primary pull-right">打印衣物</a>
              </p>
              <ul class="order-list">
                <li><span class="title">衣物条码：</span>
                  <p class="text">
                    {{orderProductInfo.scanCode}}
                    <span class="mark mark_red text-xs" v-if="orderProductInfo.hasRefund !== 0">{{orderProductInfo.hasRefundText}}</span>
                    <span class="mark mark_green text-xs" v-else-if="orderProductInfo.statusText">
                      {{orderProductInfo.statusText}}
                    </span>
                  </p>
                </li>
                <li><span class="title">绑定条码：</span>
                  <p class="text">
                    {{orderProductInfo.bindCode || '-'}}
                  </p>
                </li>
                <li><span class="title">订单编号：</span>
                  <p class="text">
                    <a target="_blank" :href="'/order/list/detail/'+orderProductInfo.orderId" class="text-primary">
                    {{orderProductInfo.orderNo}}
                    </a>
                    <span class="mark mark_green text-xs" v-if="orderProductInfo.orderStatusText">
                      {{orderProductInfo.orderStatusText}}
                    </span>
                  </p>
                </li>
                <li><span class="title">所属门店：</span><p class="text">{{orderProductInfo.storeName}}</p></li>
                <!--<li><span class="title">上架号：</span><p class="text">-</p></li>-->
                <li><span class="title">门店号：</span><p class="text">{{orderProductInfo.storeMark}}</p></li>
              </ul>
            </div>
          </td>
          <td class="wrapper" >
            <div class="client-info wrapper">
              <p class="detail-title"><span class="text-md">客户信息</span></p>
              <ul class="order-list">
                <li><span class="title">姓名：</span>
                  <p class="text text-primary">
                    <a target="_blank" :href="'/client/list/'+user.info.id+'/basic'" class="text-primary">{{user.info.name || ''}}</a>
                  </p>
                </li>
                <li><span class="title">手机号：</span>
                  <p class="text text-primary">
                    <a target="_blank" :href="'/client/list/'+user.info.id+'/basic'" class="text-primary">{{user.info.phone || ''}}</a>
                  </p>
                </li>
                <li><span class="title">会员卡：</span>
                  <p class="text text-primary">
                    <a target="_blank" :href="'/client/list/'+user.info.id+'/basic'" class="text-primary">{{user.card?user.card.no:''}}</a>
                  </p>
                </li>
                <li><span class="title">会员等级：</span>
                  <p class="text">
                    {{user.card?user.card.info.name:''}}（{{user.card?user.card.info.discount:'' | discountFormat}}折）
                  </p>
                </li>
                <li><span class="title">消费次数：</span><p class="text">{{user.ext.payCnt}}次</p></li>
                <li><span class="title">客户余额：</span><p class="text">{{user.ext.balance | amtFormat}}元</p></li>
              </ul>
            </div>
          </td>
        </tr>
      </table>
      <div class="m-t-lg b-a wrapper">
        <div style="width:50%;">
          <p class="detail-title"><span class="text-md">衣物跟踪</span></p>
          <ul class="track-list" v-if="statusList">
            <li :class="{'text-success': index == 0 }" v-for="(item, index) in statusList" :key="item.id">
              <div class="content">
                <span class="pull-left">{{item.createTime | getDate}} {{item.createTime | getTime}}</span>
                <span class="operator pull-right" v-if="item.createBy == 0">客户</span>
                <span class="operator pull-right" v-if="item.createBy != 0">{{item.createName}}</span>
                <span class="operator pull-right" >{{item.statusDesc}}</span>
                <p class="text">{{item.statusText}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-t-lg m-b text-md text-black">入库衣物清单</div>
        <el-table class="ukao-el-table ukao-tabel-bg"
          :data="productList"
          style="width: 100%">
          <el-table-column label="衣物|条码|绑标" min-width="130px">
            <template slot-scope="scope">
              <p>{{scope.row.productName}}</p>
              <p>{{scope.row.scanCode}}</p>
              <p>{{scope.row.bindCode}}</p>
              <p class="text-danger text-xs" v-if="scope.row.hasRefund !== 0">{{scope.row.hasRefundText}}</p>
              <p class="m-t-xs" v-show="scope.row.tranNum"><span class="line-text">{{scope.row.tranTypeText}}：{{scope.row.tranNum}}</span></p>
            </template>
          </el-table-column>
          <el-table-column label="服务">
            <template slot-scope="scope">
              <p>{{scope.row.serviceName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="颜色">
            <template slot-scope="scope" v-if="scope.row.colorList">
              <p v-for="item in scope.row.colorList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="瑕疵">
            <template slot-scope="scope" v-if="scope.row.flawList">
              <p v-for="item in scope.row.flawList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="预计效果">
            <template slot-scope="scope" v-if="scope.row.effectList">
              <p v-for="item in scope.row.effectList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="品牌">
            <template slot-scope="scope">
              <p>{{scope.row.brandName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="附件">
            <template slot-scope="scope" v-if="scope.row.annexList">
              <p v-for="item in scope.row.annexList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="附件服务">
            <template slot-scope="scope" v-if="scope.row.addServiceList">
               <p v-for="item in scope.row.addServiceList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="原金额x数量">
            <template slot-scope="scope">
              <p :class="{'zhx': scope.row.vipServiceAmt}">{{scope.row.serviceAmt| amtFormat}}x{{scope.row.count/100}}</p>
              <p v-if="scope.row.vipServiceAmt" class="text-danger">{{scope.row.vipServiceAmt| amtFormat}}x{{scope.row.count/100}}</p>
            </template>
          </el-table-column>
          <el-table-column label="折后">
            <template slot-scope="scope">
              <p class="text-success">{{scope.row.saleAmt| amtFormat}}</p>
              <p class="text-muted" style="font-size: 12px">
                {{scope.row.saleTypeText}}<span v-if="scope.row.saleType==1 || scope.row.saleType==2">({{scope.row.discount|discountFormat}}折)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="附加费">
            <template slot-scope="scope">
              <p class="text-success">{{scope.row.addsrvAmt | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope">
              <p :class="scope.row.chgSubtotal!=null?'text-muted':'text-success'">{{scope.row.subtotal| amtFormat}}</p>
              <p class="text-success" v-if="scope.row.chgSubtotal!=null">{{scope.row.chgSubtotal| amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p>{{scope.row.statusText}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <clothingList :orderProId="orderProductInfo.id" class="m-t-lg m-b "/>
      <signList :orderProId="orderProductInfo.id" class="m-t-lg m-b "/>
  </div>
</template>


<script>
  import clothingList from '@/components/ClothingList/index'
  import signList from '@/components/ClothingList/sign'
  export default {
 		data: function() {
 			return {
        loading: false,
        orderProductInfo:{
          id: this.$route.params.id,
        },
        statusList:[],
        user:{
          info:{},
          ext:{}
        },
        productList:[]
      }
    },
    created (){
      var _this = this
      _this.info(function (data) {
        _this.userInfo(data.userId)
      })
    },
    methods: {
      info(fn){
        this.loading = true
        this.$store.dispatch('post', {
          uri : 'orderProductRel/detail',
          data: {
            id: this.orderProductInfo.id
          }
        }).then((res) =>{
          var info = res.data.data.info
          this.statusList = res.data.data.statusList || []
          if(info){
            info.colorList = info.colorDesc ? JSON.parse(info.colorDesc):[]
            info.effectList = info.effectDesc ? JSON.parse(info.effectDesc):[]
            info.flawList = info.flawDesc ? JSON.parse(info.flawDesc):[]
            info.annexList = info.annexDesc ? JSON.parse(info.annexDesc):[]
            info.addServiceList = info.addServiceDesc ? JSON.parse(info.addServiceDesc):[]
          }
          this.orderProductInfo = info
          this.productList.push(info)
          if(typeof (fn) === 'function'){
            fn(this.orderProductInfo)
          }
        })
      },
      userInfo(userId){
        if(!userId) return
        this.$store.dispatch('post', {
          uri : 'userInfo/detail',
          data: {id:userId}
        }).then((res) =>{
          this.user = res.data.data;
          this.loading = false;
        })
      },
    },
    components: {
      clothingList, signList
    }
  }
</script>

<style scoped>
	
  .order-detail-tb tr td {
    vertical-align: top;
  }
  .detail-title {
    line-height: 36px;
  }
  .order-list li {
    overflow: hidden;
    line-height: 26px;
  }
  .order-list li .title {
    float: left;
  }
  .order-list li .text {
    margin-left: 80px;
  }

  .track-list li {
    position: relative;
    padding-left: 20px;
    line-height: 30px;
  }
  .track-list li:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    margin-top: 6px;
    width: 6px;
    height: 6px;
    background: #ededed;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 3;
  }
  .track-list li:first-child:before {
    background: #36c924;
  }
  .track-list li:after {
    content: '';
    position: absolute;
    left: 4px;
    top: 0;
    height: 100%;
    margin-top: 6px;
    border-left: 2px solid #ededed;
    border-radius: 50%;
    z-index: 2;
  }
  .track-list li:last-child:after {
    border: 0;
  }
  .track-list .content {
    overflow: hidden;
  }
  .track-list .content .text {
    margin: 0 180px;
  }
  .track-list .content .operator {
    width: 250px;
  }
  .line-text {
    border: 1px solid #f89f01;
    color: #f89f01;
    display: inline-block;
    padding: 0 10px;
    border-radius: 13px;
  }
  .zhx{
    text-decoration:line-through;
  }
</style>