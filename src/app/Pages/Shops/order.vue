<template>
  <div>
    <ul class="uk-search m-b">
      <li class="uk-search-item">
        <div class="uk-search-label w-sm">
          <el-select v-model="search.keysType">
            <el-option
              label="订单编号"
              value="1">
            </el-option>
            <el-option
              label="手机号"
              value="2">
            </el-option>
          </el-select>
        </div>
        <div class="uk-search-content">
          <el-input v-model.trim="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容"></el-input>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">下单日期：</div>
        <div class="uk-search-content">
          <el-date-picker
            v-model="search.createTimeObj"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">订单类目：</div>
        <div class="uk-search-content w-sm">
          <el-select v-model="search.categoryId" filterable clearable placeholder="全部">
            <el-option v-for="item in categoryList"
             :key="item.id"
             :label="item.name"
             :value="item.id">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">物流方式：</div>
        <div class="uk-search-content w-sm">
          <el-select v-model="search.sendMethod" filterable clearable placeholder="全部">
            <el-option
              v-for="item in sendMethodList"
              :key="item.val"
              :label="item.text"
              :value="item.val">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">付款状态：</div>
        <div class="uk-search-content w-sm">
          <el-select v-model="search.payStatus" filterable clearable placeholder="全部">
            <el-option
              v-for="item in paymentList"
              :key="item.val"
              :label="item.text"
              :value="item.val">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <el-button type="primary" @click="searchFn">筛选</el-button>
      </li>
    </ul>

    <el-tabs type="card" class="m-b" v-model="search.statusVal" @tab-click="tabClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane :label="item.text"  :name="item.val" v-for="item in orderStatusList" :key="item.val"></el-tab-pane>
    </el-tabs>

    <table class="ukao-order-table w-full m-b" v-loading="loading">
      <thead>
        <tr>
          <th width="20%">商品</th>
          <th width="5%" class="text-center">数量</th>
          <th width="12%">客户</th>
          <th width="10%">下单时间</th>
          <th width="12%">配送方式</th>
          <th width="8%">订单状态</th>
          <th width="12%">付款状态</th>
          <th width="8%">实付金额</th>
          <th width="15%">操作</th>
        </tr>
      </thead>
      <tbody v-if="tableData && tableData.length > 0">
        <template v-for="item in tableData">
          <tr>
            <td colspan="9"></td>
          </tr>
          <tr class="tr-th">
            <td colspan="9">
              <p>订单号：
              <router-link :to="'/shops/order/detail/'+item.id" class="text-primary l-h-2x">
                <span class="text-primary">{{item.orderNo}}</span>
              </router-link>
                <router-link :to="'/shops/cardCoupon'" target="_blank" class="text-primary l-h-2x">
                  <span v-if="item.mallCard" class="text-success m-l-lg">电子券码：<span>{{item.mallCard}}</span></span>
                </router-link>
              </p>
            </td>
          </tr>
          <!--<tr >
            <td colspan="8"></td>
          </tr>-->
          <tr class="tr-content m-t">
            <td colspan="2" class="goods">
              <div class="goods-item clearfix" v-for="(goods, index) in item.goodsList" :key="index">
                <img class="logo"  :src="goods.path ? goods.path : '/static/img/logo.png'" alt="">
                <div class="content">
                  <p>
                    <!-- <router-link :to="'/shops/goods/detail/'+goods.id" class="text-primary l-h-2x">
                      <span class="text-primary">{{goods.name}}</span>
                    </router-link> -->
                    <span class="text-primary l-h-2x">{{goods.name}}</span><span v-if="goods.coupons" class="m-l-sm text-success">已发券</span>
                    <span class="text-muted pull-right" v-if="goods.cnt">x {{goods.cnt}}</span>
                  </p>
                  <p style="color: #f89f01;text-align: right">￥{{goods.price | amtFormat}}</p>
                </div>
              </div>
            </td>
            <td class="v-top">
              <p class="l-h-2x">
                <img
                  style="vertical-align: middle;width: 14px; margin-right: 2px"
                  :src="item.grade == 1 ? '/static/img/user/crown_blue.png' :
												 item.grade == 2 ? '/static/img/user/crown_yellow.png' :
												  item.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
                  alt=""/>
                <a target="_blank" :href="'/client/list/'+item.userId+'/basic'" class="text-primary">
                  {{item.userName}}
                </a>
              </p>
              <p class="l-h-2x">
                <a target="_blank" :href="'/client/list/'+item.userId+'/basic'" class="text-primary">
                  {{item.userPhone}}
                </a>
              </p>
            </td>
            <td class="v-top">
              <p class="l-h-2x">{{item.createTime | getDate}}</p>
              <p class="l-h-2x">{{item.createTime | getTime}}</p>
            </td>
            <td class="v-top">
              <p class="l-h-2x m-b-xs">{{item.sendMethodText}}</p>
              <p v-if="item.storeName" class="text-muted">
                门店：{{item.storeName || ""}}
              </p>
            </td>
            <td class="v-top">
              <p class="l-h-2x m-b-xs" :class="item.statusText==='已取消' ? 'text-muted' : ''">{{item.statusText}}</p>
              <auth perm="shops.order.update">
                <el-button type="primary" size="small" v-if="item.isEnableExpress" @click="getDelivery(item)">发货</el-button>
              </auth>
            </td>
            <td class="v-top">
              <p class="1-l-h-2x text-success" v-if="item.payStatus === 1">已支付</p>
              <p v-else class="1-l-h-2x text-danger">未支付</p>
              <!-- <p class="l-h-2x">{{item.payStatusText}}</p> -->
              <p v-if="item.payStatus === 1 && item.coupon && item.coupon.code" class="text-muted" >
                礼券：{{item.coupon.code}},{{item.coupon.secret}}
              </p>
            </td>
            <td class="v-top">
              <p class="l-h-2x">{{item.paymentPrice || 0 | amtFormat}}</p>
            </td>
            <td class="v-top">
              <a target="_blank" :href="'/shops/order/detail/'+item.id" class="text-primary">
                查看详情
              </a>
              <auth perm="shops.order.remark">
                <span>-</span>
                <el-button type="text" @click="addRemark(item)">备注</el-button>
              </auth>
            </td>
          </tr>
          <!--<tr>
            <td colspan="9" class="remarks" v-if="item.userRemark || item.remark">
              <p class="sys" v-if="item.userRemark">客户留言：{{item.userRemark || '-'}}</p>
              <p class="sys" v-if="item.remark">管理备注：{{item.remark || '-'}}</p>
            </td>
          </tr>-->
          <tr class="tr-tip"
              v-show="item.userRemark || item.remark">
            <td colspan="12">
							<span class="m-r-lg text-warning light"
                    v-if="item.userRemark" style="font-size:10px;">用户：{{item.userRemark || '-'}}</span>
              <span class="text-danger light"
                    v-if="item.remark" style="font-size:10px;">管理：{{item.remark || '-'}}</span>
            </td>
          </tr>
        </template>
      </tbody>
      <tbody v-if="!tableData || tableData.length == 0 ">
        <tr class="tr-content">
          <td colspan="20" style="text-align: center;">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <div class="text-right">
      <div class="pull-left">
        <auth perm="shops.order.export">
          <el-button size="small" @click="exportOrder">导出</el-button>
        </auth>
      </div>
      <el-pagination 
        :current-page.sync="pagination.current" 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="updateUrl"/>
    </div>

    <!-- 管理备注-->
    <el-dialog class="ukao-dialog"
      title="管理备注" :visible.sync="remarkDialog.visible"  size="small">
      <div>
        <el-form :model="remarkDialog.ruleForm" ref="remarkDialog.ruleForm" label-width="160px">

          <el-form-item
            label="内容" prop="remark" :rules="[
              { min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
            ]">
            <div class="w-lg">
              <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 6}" v-model="remarkDialog.ruleForm.remark" auto-complete="off"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="remarkDialog.visible=false">取消</el-button>
            <el-button type="primary" @click="saveRemark('remarkDialog.ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  <!-- end管理备注-->
    <el-dialog
      class="ukao-dialog"
      title="提示"
      :visible.sync="deliveryGoods.show">
      <delivery 
        @cancel="deliveryGoods.show = false"
        @success="deliverySuccess"
        :goods="deliveryGoods.list" 
        :address="deliveryGoods.address"></delivery>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import dickeyval from '@/utils/dickeyval';
import time from '@/utils/helpers/timeLite';

import delivery from './components/delivery'

export default {
  data: function () {
    return {
      loading: false,
      search: {
        keysType: "1",
        keywords: "",
        createTimeObj: [new Date() - 3600 * 1000 * 24 * 30, new Date()],
        categoryId: "",
        statusVal: "",
        sendMethod: "",
        payStatus:'',
      },
      pickerOptions0: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const date = new Date();
            picker.$emit('pick', [date, date]);
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [date, date]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      sendMethodList: dickeyval.SEND_METHOD,
      paymentList:dickeyval.ORDER_PAY_STATUS,
      categoryList: [],
      orderStatusList: dickeyval.GOODS_ORDER_STATUS,
      tableData: [],
      pagination: {
        current: 1,
        size: consts.PAGE_SIZE,
        total: 0
      },
      remarkDialog:{
        visible: false,
        ruleForm:{
          id:'',
          remark:''
        }
      },
      // 修改物流的商品信息
      deliveryGoods:{
        show:false,
        address:"",
        list:[],
        id:""
      }
    };
  },
  created () {
    this.initParams();
    this.getList()
    this.queryCategoryList();
  },
  watch: {
    '$route'(){
      this.initParams();
      this.getList();
      window.scrollTo(0,0)
    }
  },
  methods: {
    initParams(){
      let data = this.$route.query;
      if (JSON.stringify(this.$route.query) !== "{}") {
        this.pagination.page = parseInt(data.page || 1);
        this.search.categoryId = parseInt(data.categoryId) || "";
        this.search.statusVal = data.statusVal || "";
        this.search.sendMethod = data.sendMethod ? data.sendMethod.toString() : '';
        this.search.createTimeObj = [data.startDate, data.endDate]
      }
    },
    updateUrl (){
      if (!this.search.createTimeObj) this.search.createTimeObj = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: this.pagination.current,
          categoryId: this.search.categoryId,
          statusVal: this.search.statusVal,
          keywords: this.search.keywords,
          sendMethod: this.search.sendMethod,
          payStatus:this.search.payStatus,
          startDate: time.getDate(this.search.createTimeObj[0]),  //下单时间
          endDate: time.getDate(this.search.createTimeObj[1]),  //下单时间
        }
      })
    },
    tabClick(){
      this.search.keywords = "";
      this.search.createTimeObj = [];
      this.search.categoryId = "";
      this.search.sendMethod = "";
      this.pagination.current = 1;
      this.updateUrl();
    },
    getList() {
      this.loading = true
      let data = {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size,
        keywords: this.search.keywords,
        categoryId: this.search.categoryId,
        statusVal: this.search.statusVal != '0' ?  this.search.statusVal : '',
        sendMethod: this.search.sendMethod,
        payStatus:this.search.payStatus,
        startDate: time.getDate(this.search.createTimeObj[0]),  //下单时间
        endDate: time.getDate(this.search.createTimeObj[1]),  //下单时间
        selectMallCard: 1
      }
      this.$store.dispatch("post", {
        uri: "mall/order/list",
        data
      }).then((res) => {
        var list = res.data.data.list || []
        this.pagination.total = res.data.data.total;
        list.forEach(function (item) {
          item.goodsList = item.goodsDesc ? JSON.parse(item.goodsDesc) : []
          item.coupon = item.couponDesc ? JSON.parse(item.couponDesc) : {}
        });
        this.tableData = list;
        this.loading = false;
      });
    },
    queryCategoryList(){
      this.$store.dispatch("post", {
        uri: "categoryInfo/list"
      }).then((res) => {
        this.categoryList = res.data.data.list || []
      });
    },
    searchFn(){
      this.pagination.current = 1;
      this.updateUrl()
    },
    addRemark(item){
      this.remarkDialog.ruleForm.id = item.id || ''
      this.remarkDialog.ruleForm.remark = item.remark || ''
      this.remarkDialog.visible = true
    },
    saveRemark(formName){
      var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('post', {
            uri: 'mall/order/remark',
            data: {
              id: this.remarkDialog.ruleForm.id,
              remark: this.remarkDialog.ruleForm.remark,
            }
          }).then((res) => {
            this.remarkDialog.visible = false
            msg.success();
            this.tableData.forEach(function (item) {
              if(item.id == _this.remarkDialog.ruleForm.id){
                item.remark = _this.remarkDialog.ruleForm.remark
              }
            });
          })
        }else{
          return false
        }
      })
    },
    // 获取需要发货的商品信息
    getDelivery(item){
      this.deliveryGoods.show = true;
      if(item.id !== this.deliveryGoods.id){
        let address = "";
        if(item.sendAddress) address += `${item.sendAddress}，`
        if(item.userName) address += `${item.userName}，`
        if(item.userPhone) address += `${item.userPhone}，`
        this.deliveryGoods.address = address.replace(/\，$/,'。');
        this.deliveryGoods.id = item.id;
        this.getGoodsList(item.id).then(res=>{
          let arr = [];
          res.data.data.list.forEach(item=>{
            if(item.isExpress !== 1) arr.push(item)
          })
          this.deliveryGoods.list = arr;
        })
      }
    },
    // 获取商品列表详情
    getGoodsList(id){
      return this.$store.dispatch("post", {
        uri: "mall/order/goods/list",
        data: {
          orderId: id
        }
      })
    },
    // 发货成功
    deliverySuccess(){
      msg.success("发货成功");
      this.getList();
      this.deliveryGoods.show = false;
      this.deliveryGoods.id = "";
    },
    // 导出
    exportOrder(){
      var params = "categoryId="+(this.search.categoryId ||'');
      params += "&mercId="+(this.search.mercId ||'');
       params += "&statusVal="+(this.search.statusVal != '0' ?  this.search.statusVal : '');
       params += "&sendMethod="+(this.search.sendMethod ||'');
       params += "&payStatus="+(this.search.payStatus ||'');
       params += "&keywords="+(this.search.keywords ||'');
       params += "&startDate="+(time.getDate(this.search.createTimeObj[0]) ||'');
       params += "&endDate="+(time.getDate(this.search.createTimeObj[1]) ||'');
       window.open(consts.BASE_URL +"/export/mall/order/list?" + params)
    }
  },
  components: {
    delivery
  }
}
</script>
<style lang="less" scoped>
.goods {
  padding: 0;
}
.goods-item {
  padding: 8px 5px;
  .logo {
    width: 45px;
    height: 45px;
    display: block;
    float: left;
  }
  .content {
    margin-left: 65px;
    line-height: 1;
  }
  & + & {
    border-top: 1px solid #dee5e7;
  }
}
.remarks {
  background-color: #fffaea;
  .user {
    color: #ffad30;
  }
  .sys {
    color: #bd5351;
  }
}
</style>
