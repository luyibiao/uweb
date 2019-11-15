<template>
  <div>
    <ul class="uk-search m-b">
      <li class="uk-search-item">
        <div class="uk-search-label">商品名称：</div>
        <div class="uk-search-content w-sm">
          <el-select v-model="search.goodsId" filterable clearable placeholder="全部">
            <el-option v-for="item in goodsList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">创建时间：</div>
        <div class="uk-search-content">
          <el-date-picker
            v-model="createTimeObj"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">卡券号：</div>
        <div class="uk-search-content w-sm">
          <el-input v-model.trim="search.code" :clearable = "true" placeholder="请输入内容"></el-input>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">手机号：</div>
        <div class="uk-search-content w-sm">
          <el-input v-model.trim="search.userPhone" :clearable = "true" placeholder="请输入手机号"></el-input>
        </div>
      </li>

      <li class="uk-search-item">
        <el-button type="primary" @click="updateUrl">筛选</el-button>
      </li>
      <li class="pull-right"><auth perm="shops.coupon.update">
        <el-button type="success" @click="dialog.verify = true; dialog.verifyBut= false">验券</el-button>
      </auth></li>
    </ul>
    <div style="position: relative;">
      <el-tabs type="card" class="m-b-sm" v-model="search.status"  @tab-click="handleTabChange">
        <el-tab-pane label="全部" name="-2"></el-tab-pane>
        <el-tab-pane label="未核销" name="0"></el-tab-pane>
        <el-tab-pane label="已核销" name="1"></el-tab-pane>
        <el-tab-pane label="已过期" name="-1"></el-tab-pane>
      </el-tabs>

    </div>
     <el-table
      v-loading="loading"
      class="m-b ukao-el-table"
      :data="tableData">
      <el-table-column
        prop="code"
        label="券码">
      </el-table-column>
      <el-table-column
        label="卡券状态">
        <template slot-scope="scope">
          <p v-if="scope.row.isPastDue == 1" class="text-muted">已过期</p>
          <p v-else-if="scope.row.status == 1" class="text-success" >已核销</p>
          <p v-else-if="scope.row.status == 0" class="text-danger">未核销</p>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号">
        <template slot-scope="scope">
          <router-link :to="'/shops/order/detail/'+scope.row.orderId" target="_blank" class="text-primary l-h-2x">
            <span>{{scope.row.orderNo }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="核销时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | getDate}}</span>
          <span>{{scope.row.updateBy | getTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsName"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="商品ID">
      </el-table-column>
       <el-table-column
         label="客户">
         <template slot-scope="scope">
           <p>{{scope.row.userName}}</p>
           <p>{{scope.row.userPhone}}</p>
         </template>
       </el-table-column>
       <el-table-column
         prop="updateName"
         label="核销人">
       </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <div class="text-primary" @click="info(scope.row)">查看</div>
        </template>
      </el-table-column>
     </el-table>
    <div class="pull-right">
      <el-pagination 
        :current-page.sync="pagination.current" 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="updateUrl"/>
    </div>

    <!-- 验券 -->
    <el-dialog class="ukao-dialog"
               title="验券"
               :visible.sync="dialog.verify"
               size="small">
      <div class="membership-content p-b-md" style="min-height: 300px;" >
        <div class="p-b-md verify-width">
          <el-input v-model.trim="code" :clearable = "true"  prefix-icon="el-icon-search" style="width: 260px;"  @keyup.enter.native="getDetail" placeholder="请输入券号"></el-input>
          <el-button class="m-l-md" type="primary" @click.native="getDetail">搜索</el-button>
        </div>
        <div class=" m-lg b-a verify-width" v-show="detail.id">
          <el-form>
            <el-form-item label="商品名称：" >
              <div style="margin: 0 30px 0px 90px;">
                {{detail.goodsName}}
              </div>
            </el-form-item>
            <el-form-item label="有效期：" >
              <div class="w-lg">
                <div v-if="detail.timeEnd == -1">永久有效</div>
                <div v-else>
                  <p>{{detail.createTime | getDate}} {{detail.createTime | getTime}}</p>
                  <p style="margin-left: 90px">{{detail.timeEnd | getDate}} 23:59:59</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="券码：" >
              <div class="">
                <span class="m-r-md">{{detail.code}}</span>
                <span v-if="detail.isPastDue" class="text-danger">此卡券已过期</span>
                <span v-else-if="detail.status != 0" class="text-danger">此卡券已核销</span>
                <span v-else="" class="text-success">有效卡券</span>
              </div>
            </el-form-item>
            <div v-if="!detail.isPastDue && detail.status == 0" class=" m-t-sm">
              <div class="text-center"><el-button type="primary" :disabled="dialog.verifyBut" :loading="dialog.verifyBut" @click="verifyFn">验证卡券</el-button></div>
              <div class="text-center text-danger text-xs m-t-sm m-b-lg">卡券验证后不可撤回</div>
            </div>

          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 验券 -->

    <!-- 说明｜备注-->
    <el-dialog class="ukao-dialog"
               title="详情"
               :visible.sync="dialog.visible"
               size="small">
      <div class="membership-content">
        <div class="m-t-sm m-lg">
					<span class="w-sm m-l-sm ">
						备注：
					</span>
          {{dialog.remark}}
        </div>
      </div>
    </el-dialog>
    <!-- 说明｜备注-->
  </div>
</template>
<script>
import consts from "@/utils/consts";
import time from '@/utils/helpers/timeLite'
import msg from '@/utils/msg'

export default {
  data() {
    return {
      loading: false,
      code:'',
      dialog:{
        verify:false,
        visible:false,
        verifyBut: false,
        remark: ''
      },
      detail:{},
      createTimeObj:[],
      goodsList:[],
      search:{
        status: "-2",
        goodsId:'',
        userPhone:'',
        createTimeStart:'',
        createTimeEnd:'',
        code:''
      },
      pagination: {
        current: 1,
        size: consts.PAGE_SIZE,
        total: 0
      },
      tableData: []
    };
  },
  created() {
    this.initParams();
    this.getGoods();
    this.getList();
  },
  watch: {
    $route() {
      this.initParams();
      this.getList();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.search.code = data.code;
        this.search.userPhone = data.userPhone;
        this.search.createTimeStart = data.createTimeStart;
        this.search.createTimeEnd = data.createTimeEnd;
        this.createTimeObj= [];
        this.createTimeObj.push(this.search.createTimeStart);
        this.createTimeObj.push( this.search.createTimeEnd );
        this.search.goodsId = parseInt(data.goodsId) || '';
        this.search.status = data.status || "-2";
      }
    },
    updateUrl() {
      if(this.createTimeObj.length){
        this.search.createTimeStart = this.createTimeObj[0];
        this.search.createTimeEnd = this.createTimeObj[1];
      }

      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.search,
          current:this.pagination.current
        }
      });
    },
    handleTabChange() {
      this.pagination.current = 1;
      this.updateUrl();
    },
    getList() {
      this.loading = true;
      let status = this.search.status == "-2" ? undefined: this.search.status;
      let timeEnd = '';
      if(status == -1){
        timeEnd = '1';
        status = undefined;
      }
      this.$store
        .dispatch("post", {
          uri: "mall/cardCoupon/list",
          data: {
            status: status,
            timeEnd,
            goodsId : this.search.goodsId,
            createTimeStart : this.search.createTimeStart,
            createTimeEnd : this.search.createTimeEnd,
            code : this.search.code,
            userPhone : this.search.userPhone,
            startRow : (this.pagination.current - 1) * this.pagination.size,
            pageSize : this.pagination.size
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.tableData.forEach(function (item) {
            if(item.timeEnd != -1){

              let now = new Date(time.getDate(res.data.timestamp)).getTime()
              let timeEnd  = new Date(item.timeEnd).getTime()
              if(now > timeEnd){
                item.isPastDue = 1;
              }
            }else{
              item.isPastDue = 0;
            }
          });
          this.loading = false;
        });
    },
    getDetail(){
      this.$store
        .dispatch("post", {
          uri: "mall/cardCoupon/detail",
          data: {
            code: this.code
          }
        }).then(res =>{
        this.detail = res.data.data
          if(this.detail.timeEnd != -1){
            let now = new Date(time.getDate(res.data.timestamp)).getTime()
            let timeEnd  = new Date(this.detail.timeEnd).getTime()
            if(now > timeEnd){
              this.detail.isPastDue = 1;
            }
          }else{
            this.detail.isPastDue = 0;
          }


      })
    },
    getGoods(){
      this.$store
        .dispatch("post", {
          uri: "goodsInfo/list",
        }).then(res => {
          this.goodsList = res.data.data.list
      })
    },
    exportXls(id) {
      window.open(consts.BASE_URL + "/export/fcode/list?couponId=" + id);
    },
    verifyFn(){
      this.dialog.verifyBut = true;
      this.$store
        .dispatch("post", {
          uri: "mall/cardCoupon/verify",
          data:{
            id: this.detail.id
          },
          forceResolve:true,
        }).then(res => {
          if(res.data.httpCode === 200){
            msg.success();
            this.dialog.verifyBut = false;
            this.detail ={};
            this.code='';
            this.getList();
          }else{
            this.dialog.verifyBut = false;
            msg.error(res.data.msg);
          }

      })
    },
    info(row){
      this.dialog.visible = true
      this.dialog.detail = row.detail
      this.dialog.remark = row.remark
    }
  }
};
</script>

<style >
  .detail_css{
    width: 60px;
  }

  .el-form-item{
    margin-bottom: 0px;
  }

  .el-form-item__label {
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 90px;
    color: #9c9c9c;
  }

  .verify-width{
    width: 350px;
    margin: auto;
  }
</style>
