<template>
<div class="box-ft">
  <div class="ul clearfix">
    <ul>
      <li v-for="(item,index) in tabNavList" :key="item.val" @click="toggle(item,index)" :class="{'childe-act':active==index}"><a :class="{'is-active':active==index}">{{item.text}}</a></li>
    </ul>
  </div>
  <div class="m-t">
    <el-date-picker
      v-model="startTime"
      type="month"
      placeholder="选择月"
      v-if="showFlag"
      format="yyyy-MM"
      :clearable=false>
    </el-date-picker>
    <el-date-picker
      v-model="startTime"
      type="year"
      placeholder="选择年"
      v-if="!showFlag"
      format="yyyy"
      :clearable=false>
    </el-date-picker>
    <el-button type="primary" class="m-le" @click="getList">筛选</el-button>
  </div>
  <el-table class="ukao-el-table m-t" :data="tableData" v-loading="tableLoading">
    <el-table-column label="取送服务商">
      <template slot-scope="scope">
        {{scope.row.type | getValText('EXPRESS_TYPE')}}
      </template>
    </el-table-column>
    <el-table-column label="结算日期" prop="sttleDate">
      <!-- <template slot-scope="scope"></template> -->
    </el-table-column>
    <el-table-column label="数量">
      <template slot-scope="scope">
        {{scope.row.takeCnt+scope.row.sendCnt}}
      </template>
    </el-table-column>
    <el-table-column label="总计金额（元）">
      <template slot-scope="scope">
        {{scope.row.sumAmt | amtFormat}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <router-link :to="'./detail/'+scope.row.id" class="text-primary">详情</router-link>
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
</template>
<script>
import consts from "@/utils/consts";
import time from '@/utils/helpers/timeLite'
export default {
  data () {
    return {
      active:0,
      showFlag:true,
      tableLoading:'',
      tabNavList:[
        {'val':'1','text':'日汇总'},
        {'val':'2','text':'月汇总'},
      ],
      startTime:new Date(),
      timeFormat:"YYYY-MM",
      tableData:[],
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
    // this.init();
    this.getList();
    this.initParams();
  },
  methods: {
    toggle(item,index){
      this.active=index;
      if(item.val==='1'){
        this.showFlag=true;
        this.timeFormat="YYYY-MM";
      }
      else if(item.val==='2'){
        this.showFlag=false
        this.timeFormat="YYYY";
      }
      this.getList();
    },
    getList(){
      this.tableLoading=true
      // if(this.active===0 && this.startTime){
      //    this.startTime=time.format(this.startTime,'YYYY-MM');
      // }
      // if(this.active===1 && this.startTime){
      //   this.startTime=time.format(this.startTime,'YYYY');
      // }
      this.$store.dispatch('post',{
        uri:'expressBill/list',
        data:{
          dateType:this.active+1,
          settleDate:this.startTime ? this.startTime.format(this.timeFormat):new Date().format(this.timeFormat),
        },
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
.bill-w-f{
  width: 560px;
}
.bill-w-t{
  width: 300px;
}
.bill_detail{
  margin: 0px auto 30px;
  padding: 15px 20px;
  background-color: #fff8ca;
  border:1px solid #ffe0ab;
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
.ul ul{
  list-style: none;
}
.ul li{
  float: left;
}
.ul li a{
  display: inline-block;
  padding:5px 10px;
  border: 1px solid #dcdcdc;
}
.ul li:first-child a{
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.ul li:last-child a{
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.ul li+li a{
  margin-left: -1px;
}
.ul li a.is-active{
  border-color: #20a0ff;
  color: #20a0ff;
}
.ul li.childe-act+li a{
  border-left-color: #20a0ff;
}
.m-le{
  margin-left: 10px;
}
</style>
