<template>
<div>
  <el-row>
    <el-col :lg="5" :md="5">
        <div class="m-b-lg">
          <el-breadcrumb class="link-back"
                         separator="/">
            <el-breadcrumb-item :to="'/marketing/discountCode/list'">
              <i class="el-icon-arrow-left icon-smaller"></i>优惠码</el-breadcrumb-item>
            <el-breadcrumb-item>已领取列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
    </el-col>
  </el-row>
  <el-row style="margin-top:20px;">
    <el-col :lg="24" :md="24">
       <!-- 选项卡-->
      <div>
        <el-tabs v-model="step.active" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabs" :key="item.value" :label="item.label" :name="item.name" :value="item.value"></el-tab-pane>
        </el-tabs>
      </div>

       <div class="code-detail"
           v-show="codeType==='2'">
       <span>通用码：
          <span>{{detail.code}}，库存：{{surplusCnt}}张</span>
        </span>
      </div>
      <div>
        <el-table :data="tableData" width="100%" v-loading="loading" class="ukao-el-table">
          <el-table-column label="优惠码" v-if="nameShow" prop="code">
          </el-table-column>
           <el-table-column label="面额（元）">
            <template slot-scope="scope">
                <div v-if="couponInfo.random === 0">{{ couponInfo.amount | amtFormat }}</div>
                <div v-else>{{ couponInfo.minAmount | amtFormat }} - {{ couponInfo.maxAmount | amtFormat }}</div>
              </template>
          </el-table-column>
           <el-table-column label="创建时间">
             <template slot-scope="scope">
              <span v-if="codeType==='1'">
                   <p>{{couponInfo.createTime | getDate}}</p>
                   <p>{{couponInfo.createTime | getTime}}</p>
                </span>
                <span v-else>
                  <p>{{scope.row.redeemTime | getDate}}</p>
                  <p>{{scope.row.redeemTime | getTime}}</p>
                </span>
              </template>
          </el-table-column>
           <el-table-column label="领取时间">
            <template slot-scope="scope">
                <span v-if="codeType==='1'">
                   <p>{{scope.row.redeemTime | getDate}}</p>
                   <p>{{scope.row.redeemTime | getTime}}</p>
                </span>
                <span v-else>
                   <p>{{couponInfo.createTime | getDate}}</p>
                   <p>{{couponInfo.createTime | getTime}}</p>
                </span>
              </template>
          </el-table-column>
           <el-table-column label="领取人">
           <template slot-scope="scope">
                <p>
                  <router-link target="_blank"
                               :to="'/client/list/'+scope.row.userId+'/basic'"
                               class="text-primary">{{scope.row.userName || ""}}</router-link>
                </p>
                <router-link target="_blank"
                             :to="'/client/list/'+scope.row.userId+'/basic'"
                             class="text-primary">{{scope.row.userPhone || ""}}</router-link>
              </template>
          </el-table-column>
           <el-table-column label="使用时间">
           <template slot-scope="scope">
                <p>{{scope.row.usedTime | getDate}}</p>
                <p>{{scope.row.usedTime | getTime}}</p>
              </template>
          </el-table-column>
           <el-table-column label="订单详情">
           <template slot-scope="scope">
                <router-link :to="'/order/list/detail/'+scope.row.id"
                             class="text-primary"
                             target="_blank"
                             v-if="scope.row.useStatus===1">详情</router-link>
              </template>
          </el-table-column>
           <el-table-column label="状态">
           <template slot-scope="scope">
                <span v-if="scope.row.useStatus===null">未领取</span>
                <span v-else>
                  <p v-if="scope.row.useStatus===0"
                     class="text-danger">未使用</p>
                  <p v-else-if="scope.row.useStatus===1"
                     class="text-success">已使用</p>
                </span>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <el-row style="margin-top:20px;">
    <el-col :lg="24" :md="24">
      <div>
        <el-button @click="onExport">导出全部</el-button>
        <div class="pull-right">
         <el-pagination :current-page.sync="pagination.current"
                           :page-size="pagination.size"
                           layout="total, prev, pager, next"
                           :total="pagination.total"
                           @current-change="updateUrl"> 
                           </el-pagination>
      </div>
      </div>
    </el-col>
  </el-row>
</div>  
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
export default {
  data () {
    return {
      useStatus:this.$route.params.status,
      id:this.$route.params.id,
      codeType:this.$route.params.codeType,
      nameShow: true,
      loading:'',
      tableData:[],
       detail: {},
      couponInfo:{},
      surplusCnt:'',
      cntInfo: {
        ciCnt: 0,
        ciAmount: 0,
        ciRandow: "",
        ciMaxAmount: 0,
        ciMinAmount: 0
      },
       step:{
          active: 'all'
        },
       tabs:[
          {label: '全部', name: 'all', value: ''},
          {label: '已领取(已使用)', name: 'step1', value: '1'},
          {label: '已领取(未使用)', name: 'step2', value: '0'},
        ],
        pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      }
    }
  },
   created() {
    this.init();
    this.setTabne();
    this.getList();
    this.getCodeDetail();
  },
  watch: {
    $route() {
      this.init();
      this.getList();
    },
  },
  methods: {
    getCodeDetail() {
      this.$store
        .dispatch("post", {
          uri: "couponFCode/queryCode",
          data: {
            couponId: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
          this.couponInfo=res.data.couponInfo;
          this.surplusCnt=res.data.surplusCnt;
        });
    },
    onExport(){
      console.log(this.id)
       window.open(
        consts.BASE_URL + "/export/couponFCode/list?couponId=" + this.id+"&useStatus="+this.useStatus
      );
    },
    getList(){
       this.loading = true;
      this.$store
        .dispatch("post", {
          uri:
            this.codeType === "1" ? "couponFCode/list" : "couponUserRel/list",
          data: {
            type: this.codeType === "1" ? "" : 7,
            couponId: this.id,
            useStatus: this.useStatus
          },
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.nameShow=this.codeType==='1' ? true :false
          this.loading = false;
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          // if (this.tableData.length > 0) {
          //   this.selectCnt();
          // }
        });
    },
    //  selectCnt() {
    //   let Arr = this.tableData;
    //   this.cntInfo.ciCnt = Arr[0].ciCnt;
    //   this.cntInfo.ciAmount = Arr[0].ciAmount;
    //   this.cntInfo.ciRandom = Arr[0].ciRandom;
    //   this.cntInfo.ciMaxAmount = Arr[0].ciMaxAmount;
    //   this.cntInfo.ciMinAmount = Arr[0].ciMinAmount;
    // },
    setTabne(){
      let _this=this;
      if(this.useStatus==='1'){
        _this.step.active='step1'
      }
      else if(this.useStatus==='0'){
         _this.step.active='step2'
      }
      //  this.step.active=_this.useStatus==='1' ? 'step1' : 'all'
    },
     handleClick(tab, event) {
       this.useStatus=tab.$attrs.value;
       this.getList();
        this.updateUrl()
      },
       init() {
      let data = this.$route.query;
      if (JSON.stringify(data) != "{}") {
        this.pagination.current = parseInt(data.current) || 1;
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
    }
  }
}
</script>
<style>
.code-detail {
  width: 350px;
  margin: 20px auto;
}

</style>

