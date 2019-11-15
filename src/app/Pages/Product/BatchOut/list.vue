<template>
  <div>
    <div class="m-b-md">
		  <ul class="uk-search">
        <li class="uk-search-item">
          <storeSelecte v-model="tableData.storeId"></storeSelecte>
        </li>
        <li class="uk-search-item">
          <citySelecte v-model="tableData.cityId"></citySelecte>
        </li>
        <li class="uk-search-item">
          <div class="uk-search-label">
            批次完成：
          </div>
          <el-select class="uk-search-content w-sm" v-model="tableData.isFinish" clearable placeholder="全部">
            <el-option
              v-for="item in finishList"
              :key="item.index"
              :label="item.text"
              :value="item.val">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="date.create"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </li>
        <li class="uk-search-item">
          <div class="uk-search-label">
            批次号：
          </div>
          <el-input class="uk-search-content w" placeholder="请输入厂袋号"
              prefix-icon="el-icon-search"
              v-model="tableData.keywords" @keyup.enter.native="updateUrl(1)">
          </el-input>
        </li>
        <li class="uk-search-item">
          <el-button type="primary" @click="updateUrl(1)">筛选</el-button>
        </li>
      </ul>
    </div>

    <!-- 选项卡-->
    <div>
      <el-tabs v-model="step.active" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="item.index" :label="item.label" :name="item.name" ></el-tab-pane>
      </el-tabs>
    </div>

    <div >
      <table class="or-table ukao-order-table ukao-v-loading w-full" v-loading="loading">
        <thead>
          <tr>
            <th>批次号</th>
            <th>衣物数 | 附件数 | 门店确认</th>
            <th>工厂</th>
            <th>物流人员</th>
            <th>门店</th>
            <th>状态</th>
            <th>批次</th>
            <th>操作</th>
          </tr>
        </thead>
        <tr class="tr-content" v-if="!tableData.list || tableData.list.length == 0">
            <td colspan="11" style="text-align: center">暂无数据</td>
        </tr>
        <tbody>
          <template v-for="(item, index) in tableData.list">
            <tr class="table-content-border-bottom">
              <td>
                <div>{{item.code}}</div>
                <div><qrcode  :value="item.code"  v-if="item.code"  :options="{ size: 65 }"></qrcode></div>
              </td>
              <td>
                <div>{{item.productCnt || 0}} / {{item.annexCnt || 0}}</div>
                <div class="text-muted">确认:{{item.storeConfirmCnt || 0}}</div>
              </td>
              <td>
                <div>{{item.factoryName || '-'}}</div>
                <div class="text-muted">
                  {{item.factoryWorkTime | getDate}} {{item.factoryWorkTime | getTime}}
                </div>
              </td>
              <td>
                <div>{{item.logisticsWorkName || '-'}}</div>
                <div>{{item.logisticsWorkPhone}}</div>
                <div class="text-muted">
                  {{item.logisticsWorkTime | getDate}} {{item.logisticsWorkTime | getTime}}
                </div>
              </td>
              <td>
                <div>{{item.storeName}}</div>
                <div class="text-muted">
                    {{item.storeWorkTime | getDate}} {{item.storeWorkTime | getTime}}
                </div>
              </td>
              <td>
                <div>{{item.statusText}}</div>
              </td>
              <td>
                <div>{{item.finishText}}</div>
              </td>
              <td>
                <a class="text-primary" target="_blank" :href="'/product/batchOut/detail/'+item.id">详情</a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="m-t-sm clearfix">
        <el-pagination class="pull-right"
          :page-size="tableData.pagination.size"
          layout="total, prev, pager, next"
          :total="tableData.pagination.total"
          :current-page.sync = "tableData.pagination.page"
               @current-change="handleCurrentChange" >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
 	import msg from '@/utils/msg'
 	import time from '@/utils/helpers/timeLite'
 	import dickeyval from '@/utils/dickeyval'
  import Qrcode from '@xkeshi/vue-qrcode'
	import citySelecte from '@/components/DropDownList/city'
	import storeSelecte from '@/components/DropDownList/store'
  export default {
    components: {
      qrcode: Qrcode,storeSelecte,citySelecte
    },
    data() {
      return {
        loading: true,
        tableData: {
          keywords : '',
          pageStart: 0,
          workId:'',
          factoryId:'',
          storeId:'',
          cityId:'',
          isFinish:'',
          status:'',
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0,
            page:1
          }
        },
        tabs:[
          {label:'全部', name:'all', value:''},
          {label:'待物流人员接收', name:'step1', value:1},
          {label:'送往门店途中', name:'step2', value:2},
          {label:'到达门店', name:'step3', value:3}
        ],
        step:{
          active: 'all'
        },
        workList:[{id:'1',name:'张三'},{id:'2',name:'李四'}],
        factoryList:[{id:'1',name:'张三'},{id:'2',name:'李四'}],
        finishList:[],
        pickerOptions0: {
          shortcuts: [{
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
        date:{
          create:[new Date() - 3600 * 1000 * 24 * 30, new Date()]
        }
      };
    },
    watch: {
      '$route'(){
        this.initParams();
        this.list();
      }
    },
    created () {
			this.initParams();
			this.list();
      this.finishList = dickeyval.BATCH_FINISH_STATUS
//      this.queryWork()
//      this. queryFactory()
    },
    methods: {
      // 更新url
			updateUrl(page = 1){
        if(!this.date.create) this.date.create = [];
				this.$router.push({
					path: this.$route.path,
					query:{
						page: page,
            startDate: time.getDate(this.date.create[0]),
            endDate: time.getDate(this.date.create[1]),
						workId: this.tableData.workId ,
            factoryId: this.tableData.factoryId,
            storeId: this.tableData.storeId ,
            cityId: this.tableData.cityId ,
            status: this.tableData.status || '',
            isFinish: this.tableData.isFinish,
            keywords: this.tableData.keywords || ''
					}
				})
      },
			// 初始化参数
			initParams(){
				let data = this.$route.query;
				if(JSON.stringify(data) !== '{}'){
          this.date.create = [data.startDate,data.endDate];
          this.tableData.isFinish = data.isFinish || ''; //批次完成
          this.tableData.keywords = data.keywords || ''; //袋号
          this.tableData.factoryId = data.factoryId ; //工厂id
          this.tableData.storeId = parseInt(data.storeId) || ""; //门店
          this.tableData.cityId = parseInt(data.cityId) || ""; //城市id
          this.tableData.status = data.status || ''; //状态
          this.tableData.pagination.page = parseInt(data.page|| 1);
          this.tabs.forEach(item=>{
            if(item.value == this.tableData.status){
              this.step.active = item.name;
              return false
            }
          })
        }
         
			},
      list(page){
        this.loading = true;
      	if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri : 'orderProductBatchOut/list',
          data: {
            startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            workId: this.tableData.workId,
            factoryId: this.tableData.factoryId,
            storeId: this.tableData.storeId,
            status: this.tableData.status || '',
            isFinish: this.tableData.isFinish,
            keywords: this.tableData.keywords || '',
            startDate: time.getDate(this.date.create[0]),
            endDate: time.getDate(this.date.create[1])
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false
        })
      },
      // queryWork(){
      //   this.$store.dispatch('post', {
      //     uri:'',
      //     data:{

      //     }
      //   }).then((res) =>{
      //     this.workList = res.data.data
      //   })
      // },
      // queryFactory(){
      //   this.$store.dispatch('post', {
      //     uri:'',
      //     data:{

      //     }
      //   }).then((res) =>{
      //     this.factoryList = res.data.data
      //   })
      // },
      handleCurrentChange (val){
   			 this.updateUrl(val)
   		},
      handleClick(tab, event) {
        this.tabs.forEach((item)=> {
          if(item.name === tab.name){
            this.tableData.status = item.value
            return false
          }
        })
   			this.updateUrl()
      }
    }
  };
</script>