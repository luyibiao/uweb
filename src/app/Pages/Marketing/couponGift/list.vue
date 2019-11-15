<template>
  <div>
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
          <th>礼包批次</th>
          <th>制作时间</th>
          <th>礼包总数 | 已兑换</th>
          <th>券总数量</th>
          <th>优惠券礼包名称</th>
          <th>券面额</th>
          <th>总金额 | 已兑换金额</th>
          <th>使用规则</th>
          <th>有效期</th>
          <th>状态</th>
          <th>备注|说明</th>
        </tr>
        </thead>
        <tr class="tr-content" v-if="!tableData.list || tableData.list.length == 0">
          <td colspan="11" style="text-align: center">暂无数据</td>
        </tr>
        <tbody>
        <template v-for="(item, index) in tableData.list">
          <tr class="table-content-border-bottom">
            <td>
              <div><router-link class="text-primary" :to="'/marketing/couponGift/detail?packageId='+item.id">{{item.id}}</router-link></div>
            </td>
            <td>
              <div>{{item.createTime | getDate}}
                  <p>{{item.createTime | getTime}}</p>
              </div>
            </td>
            <td>
              <div><router-link class="text-primary" :to="'/marketing/couponGift/detail?packageId='+item.id">{{item.cnt}}</router-link> /
              <router-link class="text-primary" :to="'/marketing/couponGift/detail?packageId='+item.id+'&status=2'">{{item.convertCount || 0 }}</router-link> </div>
            </td>
            <td>
              <div><router-link class="text-primary" :to="'/marketing/couponGift/detail?packageId='+item.id">{{item.couponCnt * item.cnt }}</router-link></div>
            </td>
             <td>
              <div>{{item.name}}</div>
            </td>
            <td>
              <div>{{item.amount | amtFormat}}</div>
              <div class="text-muted" >满 {{item.fullAmount | amtFormat }} 元可用</div>
            </td>
            <td>
              <div>{{item.amount * item.cnt * item.couponCnt | amtFormat}}  / {{item.amount * item.convertCount  || 0  | amtFormat}} </div>
            </td>
            <td>
              <div>{{item.ruleName}}</div> 
              <p v-if="item.useBalance!==1" class="text-muted">不能与余额同时使用</p>
            </td>
            <td>
              <div v-if="item.dateType === 1 ">
                  {{item.timeStart | getDate}} 至 <p>{{item.timeEnd | getDate}}</p>
              </div>
              <div v-else> 兑换后 {{item.term}} 天后失效</div>
            </td>
            <td>
              <div v-if="item.status == -1">已过期</div>
              <div v-if="item.status == 0">未生效</div>
              <div class="text-success" v-if="item.status == 1">正有效</div>
            </td>
            <td>
              <div class="text-primary" @click="info(item)">详情</div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="m-t-sm clearfix">
        <div class="pull-left">
          <auth perm="marketing.couponGift.export">
            <el-button size="small" @click="exportXls">导出</el-button>
          </auth>
        </div>
        <el-pagination class="pull-right"
                       :page-size="tableData.pagination.size"
                       layout="total, prev, pager, next"
                       :total="tableData.pagination.total"
                       :current-page.sync = "tableData.pagination.page"
                       @current-change="handleCurrentChange" >
        </el-pagination>
      </div>
    </div>
    <!-- 说明｜备注-->
    <el-dialog class="ukao-dialog"
               title="详情"
               :visible.sync="dialog.visible"
               size="small">
      <div class="membership-content">

        <div class="m-t-sm">
          <span class="w-sm m-l-sm">使用说明：</span>
          {{dialog.detail}}
				</div>

        <div class="m-t-sm m-lg">
					<span class="w-sm m-l-sm ">
						备注：
					</span>
          {{dialog.remark}}
				</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
  import msg from '@/utils/msg'
  import time from '@/utils/helpers/timeLite'
  import dickeyval from '@/utils/dickeyval'
  import Qrcode from '@xkeshi/vue-qrcode'
  import Barcode from '@xkeshi/vue-barcode'
  import citySelecte from '@/components/DropDownList/city'
  import storeSelecte from '@/components/DropDownList/store'
  export default {
    components: {
      qrcode: Qrcode, barcode: Barcode,
      citySelecte,
      storeSelecte
    },
    data() {
      return {
        loading: true,
        tableData: {
          keywords : '',
          workId:'',
          factoryId:'',
          status:'',
          isFinish:'',
          storeId:'',
          cityId:'',
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0,
            page:1
          }
        },
        tabs:[
          {label: '全部', name: 'all', value: ''},
          {label: '未生效', name: 'step1', value: '0'},
          {label: '正有效', name: 'step2', value: '1'},
          {label: '已过期', name: 'step3', value: '-1'}
        ],
        step:{
          active: 'all'
        },
        workList:[{id:'1',name:'张三'},{id:'2',name:'李四'}],
        factoryList:[{id:'1',name:'张三'},{id:'2',name:'李四'}],
        finishList:[],
        dialog:{
          visible: false,
          detail: '',
          remark: ''
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
        this.$router.push({
          path: this.$route.path,
          query:{
            page: page,
            status: this.tableData.status || '',

          }
        })
      },
      // 初始化参数
      initParams(){
      },
      list(page){
        this.loading = true
        if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri : 'giftPackageInfo/list',
          data: {
            startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
            status: this.tableData.status || '',
            pageSize: this.tableData.pagination.size,
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false
        })
      },
      handleCurrentChange (val){
        this.updateUrl(val)
      },
      handleClick(tab, event) {
        this.tabs.forEach(item=>{
          if(item.name === tab.name){
            this.tableData.status = item.value
            return false
          }
        })
        this.updateUrl()
      },
      exportXls(){
        window.open(consts.BASE_URL +"/export/GiftPackageInfo/list?status="+ this.tableData.status);
      },
      info(row){
        this.dialog.visible = true
        this.dialog.detail = row.detail
        this.dialog.remark = row.remark
      }
    }

  };
</script>