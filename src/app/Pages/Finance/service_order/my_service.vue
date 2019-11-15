<template>
<div class="ukao-pt-lg">
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
       <el-tabs type="card" @tab-click="handleClick" v-model="tabName">
        <el-tab-pane name="allService" label="所有服务">
          <!-- <allService></allService> -->
        </el-tab-pane>
        <el-tab-pane name="soonService" label="即将到期">
          <!-- <soonService></soonService> -->
        </el-tab-pane>
        <el-tab-pane name="alreadyService" label="已过期">
          <!-- <alreadyService></alreadyService> -->
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div>
        <el-table  class="ukao-el-table" :data="tableData" v-loading="tableLoading">
          <el-table-column label="服务名称" prop="name">
          </el-table-column>
          <!-- <el-table-column label="服务类型" prop="serviceTypeName">
          </el-table-column> -->
          <el-table-column label="订购门店" prop="storeName"></el-table-column>
          <el-table-column label="到期时间" v-if="chargeMode && chargeMode>1">
            <template slot-scope="scope">
              <p>{{scope.row.val}} 00:00</p>
            </template>
          </el-table-column>
          <el-table-column label="服务状态">
            <template slot-scope="scope">
              <p :class="{'text-success':selectTime(scope.row.val,timestamp)==='生效中','text-danger':selectTime(scope.row.val,timestamp)==='已过期'}">
                {{selectTime(scope.row.val,timestamp)}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="text-primary" type="text" v-if="selectTime(scope.row.val,timestamp)==='生效中'" @click="option(scope.row)">续费</el-button>
              <el-button class="text-primary" type="text" v-else-if="selectTime(scope.row.val,timestamp)==='已过期'" @click="option(scope.row)">立即订购</el-button>
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
import consts from "@/utils/consts";
export default {
  data () {
    return {
      tabName:"allService",
      tableData:[],
      tableLoading:false,
      pagination: {
      //分页信息
      size: consts.PAGE_SIZE,
      total: 0,
      current: 1
    },
    timestamp:'',
    chargeMode:'',
    advent:"",
    expire:""
    }
  },
   created () {
     this.initParams();
     this.getList();
  },
   watch: {
    $route() {
        // 新建单位触发的修改不请求数据
        this.getList();
        //this.initParams();
      }
    },
  methods: {
    option(item){
      this.$router.push({path:"/finance/service_order/service_market",query:{id:item.store_id}})
    },
    getList(){
      this.tableLoading=true;
      this.$store.dispatch('post',{
        uri:"mercService/list",
        data:{
          incType:2,
          advent:this.tabName==='soonService' ? 1 :'',
          expire:this.tabName==='alreadyService' ? 1 : ''
        },
        params: {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size
      }
      }).then(res=>{
        this.tableLoading=false;
        this.chargeMode=res.data.chargeMode;
        let Arr=res.data.data.list;
        this.pagination.total = res.data.data.total;
        this.timestamp=res.data.timestamp;
        this.tableData=Arr;
      })
    },
    handleClick(){
      this.getList();
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
  selectTime(endTime,startTime){
    return Date.parse(new Date(endTime))-Date.parse(new Date(this.$options.filters.getDate(startTime)))>0 ? '生效中' : '已过期'
  }
  },
}
</script>
