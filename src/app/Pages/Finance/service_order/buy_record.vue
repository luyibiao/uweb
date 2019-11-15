<template>
<div class="ukao-pt-lg box-ft">
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div class="ul">
        <ul>
          <li>
            <label>订购门店：</label>
            <el-select v-model="storeId">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </li>
          <li>
            <label>创建时间：</label>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li><el-button type="primary" @click="getList">筛选</el-button></li>
        </ul>
      </div>
    </el-col>
  </el-row>
  <el-row style="margin-top:20px;">
    <el-col :lg="24" :md="24" :xl="24">
      <div>
        <el-table class="ukao-el-table  m-t" :data="tableData" v-loading="tableLoading" style="width:100%">
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>
                {{scope.row.createTime | getDate}}
              </span>
              <p>{{scope.row.createTime | getTime}}</p>
            </template>
          </el-table-column>
          <el-table-column label="订购门店" prop="storeName">
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <p>{{scope.row.typeName}}</p>
              <span class="text-muted">{{scope.row.ruleData.name}}（{{scope.row.val}}个月）</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="serviceTypeName">
            <!-- <template slot-scope="scope">
            </template> -->
          </el-table-column>
          <el-table-column label="费用（元）">
            <template slot-scope="scope">
               <el-popover ref="popover1"
                      placement="bottom-start"
                      width="200"
                      trigger="hover">
                      <div class="popver">
                          <p>服务价格：{{scope.row.ruleData.price || 0 | amtFormat}}元</p>
                          <span v-if="scope.row.payMethod!==12">
                            <p v-if="scope.row.activationCode">填写推广码：{{scope.row.activationCode}}</p>
                            <p v-if="scope.row.deductionCoin">通洗币抵扣：{{scope.row.deductionCoin}}.00元</p>
                          </span>
                          <p style="margin-bottom:0px;">实付款：{{scope.row.amount || 0 | amtFormat}}元
                            <span v-if="scope.row.payMethod===12">                            
                                <label>(激活码</label>
                                <label>{{scope.row.activationCode}})</label>                               
                              </span>
                            <span v-else>                           
                                <label>({{ scope.row.payMethod | getValText('PAY_METHOD')}})</label>                      
                            </span>
                          </p>
                      </div>
                      <div class="dis-inline" slot="reference" >
                        <span  v-if="scope.row.payMethod">
                          <span>{{scope.row.amount || 0 | amtFormat}}</span>
                          <i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>
                        </span>
                      </div>
                </el-popover>
            </template>
            <!-- <template slot-scope="scope">
              <div v-if="scope.row.payMethod">
                 <span v-if="scope.row.payMethod===12">
                  <p>激活码</p>
                  <p>{{scope.row.activationCode}}</p>
                  </span>
                <span v-else>
                  <p>{{ scope.row.payMethod | getValText('PAY_METHOD')}}</p>
                  <p>{{scope.row.amount | amtFormat}}</p>
                </span>
              </div>
              <div v-else>未购买</div>
            </template> -->
          </el-table-column>
          <el-table-column label="订购状态">
            <template slot-scope="scope">
               <p :class="{
                  'text-success':scope.row.status === 1,
                  'text-muted':scope.row.status === 2,
                  'text-danger':scope.row.status === 0}">
                    {{status[scope.row.status]}}
              </p>
              <p class="text-muted" v-if="scope.row.status===0">{{selectTime(scope.row)}}前有效</p>
            </template>
          </el-table-column>
          <el-table-column label="有效期至">
            <template slot-scope="scope">
              <p>{{scope.row.expTime}} <label v-if="scope.row.payMethod">00:00</label></p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <router-link class="text-primary" :to="'./order_detail/'+scope.row.seq+'/'+scope.row.status">查看</router-link>
              <span v-show="scope.row.status===0">
                <span style="margin:0px 3px;">|</span>
                <el-button type="text" @click="cancel(scope.row)" >取消</el-button>
              </span>
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
<style scoped>
.ul{
  margin: 0;
  padding: 0;
  list-style: none;
}
.ul li{
   float: left;
}
.ul li+li{
  margin-left: 40px;
}
.popver *{
  margin-bottom: 10px;
}
</style>

<script>
import consts from "@/utils/consts";
import dickeyval from "@/utils/dickeyval";
import timeLite from "@/utils/helpers/timeLite";
import msg from "@/utils/msg";
export default {
  data () {
    return {
      tableData:[],
      payMethodList:dickeyval.PAY_METHOD,
      tableLoading:false,
      pagination: {
      //分页信息
      size: consts.PAGE_SIZE,
      total: 0,
      current: 1
    },  
    timestamp:'',
     status: {
        "0": "待付款",
        "-1": "交易失败",
        "1": "交易成功",
        "2": "订单已关闭"
      },
      canceLoad:false,
      storeList:[],//门店列表
      storeId:"",
      startDate:"",
    }
  },
   created () {
     this.initParams();
     this.getList();
     this.getStoreList();
  },
   watch: {
    $route() {
        // 新建单位触发的修改不请求数据
        this.getList();
        //this.initParams();
      }
    },
  methods: {
    getStoreList(){
       this.$store.dispatch('post',{
        uri:"storeInfo/list",
        data:{}
      }).then(res=>{
         this.storeList=res.data.data.list;
      })
    },
    cancel(item){
       msg.confirm({
        msg: "确定取消此订单",
        confirmFn: _ => {
          this.canceLoad=true
          this.$store
            .dispatch("post", {
              uri: "tradeIncrement/cancel",
              data: {
                id:item.id,
                status:2
              }
            })
            .then(res => {
              this.canceLoad=false
              msg.success();
              this.getList();
            });
        }
      });
    },
     getList(){
       this.tableLoading=true;
      this.$store.dispatch('post',{
        uri:"tradeIncrement/recharge/list",
        data:{
          startDate:this.$options.filters.getDate(this.startDate),
          endDate:this.$options.filters.getDate(this.startDate),
          storeId:this.storeId
        },
        params: {
          startRow: (this.pagination.current - 1) * this.pagination.size,
          pageSize: this.pagination.size
        }
      }).then(res=>{
         this.tableLoading=false;
        let Arr=res.data.data.list;
        for(let i=0;i<Arr.length;i++){
           Arr[i].ruleData=JSON.parse(Arr[i].ruleData)
        }
        this.timestamp=res.data.timestamp;
        // this.timestamp=this.$options.filters.getDate(timeLite.add(res.data.timestamp,3,"days"))
        // this.timestamp=this.$options.filters.getDate(res.data.timestamp);
        this.tableData=Arr;
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
  selectTime(item){
     return this.$options.filters.getDate(timeLite.add(item.createTime,3,"days"))
  }
  }
}
</script>

