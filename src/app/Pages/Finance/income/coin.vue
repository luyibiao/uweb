<template>
<div class="ukao-pt-lg income_coin box-ft">
   <el-row>
     <el-col :lg="24" :md="24" :xl="24">
       <div class="coin_head">
         <span><p>我的通洗币：<label class="text-blue" style="font-size: 30px">{{coinNum || 0}}</label></p></span>
         <span>
           <a class="text-primary" href="http://help.twash.cn/archives/1051" target="_blank">什么是通洗币?</a>
           <a class="text-primary" href="http://help.twash.cn/archives/1057" target="_blank">如何获取通洗币?</a>
         </span>
         <span v-if="taskNum>0">
           <p><el-button type="primary" style="margin-right: 20px;" @click="$router.push({path:'/setting/mytask'})">赚取更多</el-button></p>
         </span>
       </div>
     </el-col>
   </el-row>

   <el-row style="margin-top:20px;">
     <el-col :lg="24" :md="24" :xl="24">
       <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane name="all" label="全部记录">
        </el-tab-pane>
          <el-tab-pane name="get" label="获取记录">
        </el-tab-pane>
          <el-tab-pane name="use" label="使用记录">
        </el-tab-pane>
          <el-tab-pane name="expire" label="过期记录">
        </el-tab-pane>
      </el-tabs>
      <div class="e-table">
        <el-table :data="tableData" class="ukao-el-table" v-loading="tableloading" style="width:100%">
          <el-table-column label="领取时间">
            <template slot-scope="scope">
              <p>{{scope.row.createTime | getDate}}</p>
              <p>{{scope.row.createTime |getTime}}</p>
            </template>
          </el-table-column>
          <el-table-column label="详细说明" width="500">
            <template slot-scope="scope">
              <p>{{scope.row.bizType | getValText('DEFINE')}}<span v-if="scope.row.bizType===3  && scope.row.extData">{{scope.row.extData.name}}</span><span v-if="(scope.row.bizType===-1 || scope.row.bizType===1 || scope.row.bizType===2) && scope.row.extData">({{scope.row.extData.cnt}}个月)</span></p>
            </template>
          </el-table-column>
          <el-table-column label="收入|支出">
             <template slot-scope="scope">
              <p :class="{'text-success':scope.row.type===1,'text-danger':scope.row.type===2}"><span v-if="scope.row.type===1">+</span>{{scope.row.coin}}</p>
            </template>
          </el-table-column>
          <el-table-column label="备注">
           <template slot-scope="scope">
            <p v-if="scope.row.tradeSeq">流水号：{{scope.row.tradeSeq}}</p>
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
import auth from "@/utils/auth";
export default {
  data () {
    return {
      activeName:'all',
      tableData:[],
      tableloading:'',
      coinNum:'',
      pagination: {
      //分页信息
      size: consts.PAGE_SIZE,
      total: 0,
      current: 1
    },
     searchKeys: {
        type:'',
        notBizType:'',
        bizType:''
      },
    taskNum:0,
    }
  },
   created () {
     this.getTaskNum();
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
    getList(){
      this.tableloading=true;
      this.$store.dispatch('post',{
        uri:'mercCoinBill/list',
        data:this.searchKeys,
        params: {
          startRow: (this.pagination.current - 1) * this.pagination.size,
          pageSize: this.pagination.size
        }
      }).then(res=>{
        let Arr=res.data.data.list
         for(let i=0;i<Arr.length;i++){
            if(Arr[i].extData){
              Arr[i].extData=JSON.parse(Arr[i].extData);
            }
          }
        this.tableData=Arr;
        this.coinNum=res.data.coinNum;
        this.tableloading=false
        this.pagination.total = res.data.data.total;
      })
    },
    getAuth(item){
      let _this=this;
      let num = 0;
      let obj=auth.getPermList();
      for(var i=0;i<item.length;i++){
        for(let j=0;j<=obj.length;j++){
          if(item[i].permission===obj[j]){
             num++;
          }
        }
      }
      return num;
    },
    getTaskNum(){
      this.$store.dispatch('post',{
        uri:'taskInfo/list',
      }).then(res=>{
        if(res.data.data.list.length!==0){
           this.taskNum= this.getAuth(res.data.data.list);
         }
      })
    },
    handleClick(){
       if(this.activeName==='all'){
        this.searchKeys.type="";
        this.searchKeys.notBizType="";
        this.searchKeys.bizType=""
      }
      else if(this.activeName==='get'){
        this.searchKeys.type=1;
        this.searchKeys.notBizType="";
        this.searchKeys.bizType=""
      }
      else if(this.activeName==='use'){
        this.searchKeys.type=2;
        this.searchKeys.notBizType=-2;
        this.searchKeys.bizType="";
      }
      else if(this.activeName==='expire'){
        this.searchKeys.type="";
        this.searchKeys.notBizType="";
        this.searchKeys.bizType=-2;
      }
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
  }  
}
</script>

<style lang="less">
.income_coin{
  .coin_head{
  margin: 0 auto;
  width: 100%;
  display: table;
  border: 1px solid #e5e5e5;
  padding: 30px 0px;
}
  .text-blue{
    color: #1989fa
  }
.coin_head span{
  display: table-cell;
}
.coin_head>span:nth-child(1){
  font-size: 16px;
  font-weight: 600;
}
.coin_head span:nth-child(1) p{
  margin-left: 20px;
}
.coin_head a+a{
  margin-left: 30px;
}
.coin_head span:nth-child(3){
  text-align: right;
}
.e-table{
  margin-top: 20px;
}
.el-tabs__nav-wrap{
  margin-bottom: 0px;
}
}
</style>
