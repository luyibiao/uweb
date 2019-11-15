<template>
<div class="box-ft">
    <el-row>
      <el-col :lg="24" :md="24" :xl="24">
        <div class="wrap-search">
          <ul>
            <li>
              <el-input placeholder="请输入订单号或运单号" class="w-lg" prefix-icon="el-icon-search" v-model="search.keywords"></el-input>
            </li>
            <li>
              <label>取送服务商：</label>
              <el-select v-model="search.type" clearable class="e-lg">
                <el-option v-for="item in expressTypes" :key="item.val" :value="item.val" :label="item.text"></el-option>
              </el-select>
            </li>
            <li>
              <label>取送模式：</label>
              <el-select v-model="search.mode" clearable class="e-lg">
                <el-option v-for="item in expressModes" :key="item.val" :value="item.val" :label="item.text"></el-option>
              </el-select>
            </li>
            <li>
              <label>收件日期：</label>
                <el-date-picker
                  v-model="addresseeTime"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="ukao-date-picker"
                  @change="takeTimeFn">
                </el-date-picker>
            </li>
            <li>
              <label>签收日期：</label>
                <el-date-picker
                  v-model="signTime"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="ukao-date-picker"
                  @change="singTimeFn">
                </el-date-picker>
            </li>
            <li>
              <el-button type="primary" @click="getList">筛选</el-button>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px;">
      <el-col :lg="24" :md="24" :xl="24">
        <div>
          <el-table v-loading="tableLoading" :data="tableData" class="ukao-el-table">
            <el-table-column label="取送服务商">
              <template slot-scope="scope">
                {{scope.row.type | getValText('EXPRESS_TYPE')}}
              </template>
            </el-table-column>
            <el-table-column label="运单号" prop="expressNo"></el-table-column>
            <el-table-column label="订单号">
              <template slot-scope="scope">
                <router-link :to="'/order/list/detail/'+scope.row.orderId" class="text-primary" target="_blank">{{scope.row.orderNo}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="取送模式">
              <template slot-scope="scope">
                <p>{{scope.row.mode ? scope.row.mode===1 ? '取件' : '送件' :''}}</p>
              </template>
            </el-table-column>
            <el-table-column label="运费总额">
              <template slot-scope="scope">
                {{scope.row.amount | amtFormat}}
              </template>
            </el-table-column>
            <el-table-column label="重量">
              <template slot-scope="scope">
                {{scope.row.weight | kgFormat}}<label v-if="scope.row.weight">kg</label>
              </template>
            </el-table-column>
            <el-table-column label="收件时间">
              <template slot-scope="scope">
                <p>{{scope.row.takeTime | getDate}}</p>
                <p>{{scope.row.takeTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column label="签收时间">
              <template slot-scope="scope">
                <p>{{scope.row.signTime  | getDate}}</p>
                <p>{{scope.row.signTime  | getTime}}</p>
              </template>
            </el-table-column>
          </el-table>
           <div class="pull-right" style="margin-top:20px;">
              <el-pagination :current-page.sync="pagination.current"
                              :page-size="pagination.size"
                              layout="total, prev, pager, next"
                              :total="pagination.total"
                              @current-change="nextPage">
              </el-pagination>
           </div>
        </div>
      </el-col>
    </el-row>
</div>  
</template>
<script>
import keyval from '@/utils/dickeyval' 
import consts from "@/utils/consts";
export default {
  data () {
    return {
      tableLoading:"",
      tableData:[],
      search:{
        // single:'',//运单号，订单号
        keywords:'',//输入框搜索
        type:'',//取送服务商
        mode:'',//取送模式
        startTakeTime:'',//收件开始日期
        endTakeTime:'',//收件结束日期
        startSignTime:'',//签收开始日期
        endSignTime:'',//签收结束日期
      },
      addresseeTime:[],//收件日期字符串
      signTime:[],//签收日期字符串
      // single:keyval.SINGLE,
      expressModes:keyval.EXPRESS_MODE,
      expressTypes:keyval.EXPRESS_TYPE,
      pagination: {
      //分页信息
      size: consts.PAGE_SIZE,
      total: 0,
      current: 1
    },
    }
  },
   watch: {
      $route() {
          // 新建单位触发的修改不请求数据
          this.getList();
          this.initParams();
        }
    },
  created () {
    this.init();
    this.getList();
    this.initParams();
  },
  methods: {
  init(){
    console.log(this.$route.query.id)
    },
  getList(){
    this.tableLoading=true
    this.$store.dispatch('post',{
      uri:'expressInfo/tradeList',
      data:this.search,
      params: {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size
    }
    }).then(res=>{
      this.tableData=res.data.data.list;
      this.tableLoading=false;
      this.pagination.total = res.data.data.total;
    })
  },
  takeTimeFn(){
    if(this.addresseeTime && this.addresseeTime.length>0){
      this.search.startTakeTime=this.$options.filters.getDate(this.addresseeTime[0]);
      this.search.endTakeTime=this.$options.filters.getDate(this.addresseeTime[1]);
    }
    else{
       this.search.startTakeTime="";
       this.search.endTakeTime=""
    }
  },
  singTimeFn(){
    if(this.signTime && this.signTime.length>0){
      this.search.startSignTime=this.$options.filters.getDate(this.signTime[0]);
      this.search.endSignTime=this.$options.filters.getDate(this.signTime[1]);
    }
    else{
      this.search.startSignTime="";
      this.search.endSignTime=""
    }
  },
  getmercList(){
        this.$store.dispatch('post', {
          uri:"mercInfo/list"
        }).then(res=>{
          this.shopList=res.data.data.list || [];
        })
      },
  initParams() {
    this.markNo = this.$route.params.markNo;
    //初始化分页数据
    if (this.$route.query.current) {
      this.pagination.current = parseInt(this.$route.query.current) || 1;
    }
  },
  updateUrl() {
    this.$router.push({
      path: this.$route.path,
      query: {
        current: this.pagination.current
      }
    });
  },
  nextPage() {
    // 新建单位触发的分页修改不执行
        this.updateUrl();
      },
    }
  }
</script>
<style scoped lang="less">

.wrap-search ul{
  list-style: none;
}
.wrap-search ul li{
  float: left;
  margin-right: 40px;
  margin-top: 15px;
}
.e-lg{
  width: 100px;
}
.w-lg{
  width: 200px;
}
.m-t{
  margin-top: 0px !important;
}
</style>

