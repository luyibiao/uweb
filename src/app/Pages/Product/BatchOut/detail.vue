<style lang="less" scoped>
  .breadcrumb{
    position: relative;
    height: 30px;
  }
  .print{
    position: absolute;
    right: 0;
    top: 0;
    color: #20a0ff;
  }
</style>

<template>
  <div>
    <div class="breadcrumb">
      <el-breadcrumb class="link-back" separator="/">
        <el-breadcrumb-item to="/product/batchOut"><i class="el-icon-arrow-left icon-smaller"></i>出厂批次</el-breadcrumb-item>
        <el-breadcrumb-item><div class="text-muted">详情</div> </el-breadcrumb-item>
      </el-breadcrumb>
      <a class="print" target="_blank" :href="'/print/'+batchInfo.id">打印出厂详单</a>
    </div>
    <div class="m-t-md">
      <table class="or-table ukao-order-table ukao-v-loading w-full" >
        <thead>
           <tr>
             <th>批次号</th>
             <th>衣物数 | 附件数 | 门店确认</th>
             <th>工厂</th>
             <th>物流人员</th>
             <th>门店</th>
             <th>状态</th>
           </tr>
        </thead>
        <tbody>
        <tr class="border-1x tr-content">
          <td>
            <div>{{batchInfo.code}}</div>
            <div><qrcode :value="batchInfo.code" v-if="batchInfo.code" :options="{ size: 65 }"></qrcode></div>
          </td>
          <td>
            <div>{{batchInfo.productCnt || 0}} / {{batchInfo.annexCnt || 0}}</div>
            <div class="text-muted">{{batchInfo.storeConfirmCnt || 0}}确认</div>
          </td>
          <td>
            <div>{{batchInfo.factoryName || '-'}}</div>
            <div class="text-muted">
              {{batchInfo.factoryWorkTime | getDate}} {{batchInfo.factoryWorkTime | getTime}}
            </div>
          </td>
          <td>
            <div>{{batchInfo.logisticsWorkName || '-'}}</div>
            <div>{{batchInfo.logisticsWorkPhone}}</div>
            <div class="text-muted">
              {{batchInfo.logisticsWorkTime | getDate}} {{batchInfo.logisticsWorkTime | getTime}}
            </div>
          </td>
          <td>
            <div>{{batchInfo.storeName}}</div>
            <div class="text-muted">
                {{batchInfo.storeWorkTime | getDate}} {{batchInfo.storeWorkTime | getTime}}
            </div>
          </td>
          <td>
            <div>{{batchInfo.statusText}}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="m-t-lg">
      <div class="m-xs">共有{{ tableData.list.length || 0}}条记录。</div>
      <table class="or-table ukao-order-table ukao-v-loading w-full" v-loading="loading">
        <thead>
           <tr>
             <th>衣物名称</th>
             <th>订单编号 | 衣物条码</th>
             <th>入库时间</th>
             <th>用户</th>
             <th>工厂</th>
             <th>门店</th>
           </tr>
        </thead>
        <tr class="tr-content" v-if="!tableData.list || tableData.list.length == 0">
            <td colspan="7" style="text-align: center">暂无数据</td>
        </tr>
        <tbody>
          <template v-for="(item, index) in tableData.list">
            <tr class="table-content-border-bottom">
              <td>
                <div>{{item.productName}}</div>
                <div>
                  <a target="_blank" :href="'/product/detail/'+item.pid" class="text-primary">
                    {{item.pScanCode}}
                  </a>
                  <span >
                    <qrcode class="qrcode" :value="item.pScanCode"  v-if="item.pScanCode"  :options="{ size: 45 }"></qrcode>
                  </span>
                </div>
              </td>
              <td>
                <div>
                  <a class="text-primary" target="_blank" :href="'/order/list/detail/'+item.orderId">{{item.orderNo}}</a>
                </div>
                <div>
                  <a class="text-primary" target="_blank" :href="'/product/detail/'+item.orderProId">{{item.scanCode}}</a>
                  <span >
                    <qrcode class="qrcode" :value="item.scanCode"  v-if="item.scanCode"  :options="{ size: 45 }"></qrcode>
                  </span>
                </div>
              </td>
              <td>
                <div>
                    {{item.createTime | getDate}}
                </div>
                <div>
                    {{item.createTime | getTime}}
                </div>
              </td>
              <td>
                <div>
                  <img
                    style="vertical-align: middle;width: 14px; margin-right: 1px"
                    :src="item.grade == 1 ? '/static/img/user/crown_blue.png' :
											item.grade == 2 ? '/static/img/user/crown_yellow.png' :
											item.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
                    alt=""/>
                  <a class="text-primary" target="_blank" :href="'/client/list/'+item.userId+'/basic'">
                  {{item.userName || '-'}}
                  </a>
                </div>
                <div>
                  <a class="text-primary" target="_blank" :href="'/client/list/'+item.userId+'/basic'">
                  {{item.userPhone}}
                  </a>
                </div>
              </td>
              <td>
                 <div>{{item.factoryStatusText|| '-'}}</div>
                 <div class="text-muted" v-if="item.factoryStatus===2">{{item.factoryLoseTime | getDate}} {{item.factoryLoseTime | getTime}}</div>
               </td>
              <td>
                <div>{{item.storeStatusText|| '-'}}</div>
                <div class="text-muted" v-if="item.storeStatus===2">{{item.storeLoseTime | getDate}} {{item.storeLoseTime | getTime}}</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
 	import msg from '@/utils/msg'
 	import time from '@/utils/helpers/timeLite'
  import Qrcode from '@xkeshi/vue-qrcode'

  export default {
    components: {
      qrcode: Qrcode
    },
    data() {
      return {
        loading: true,
        batchInfo:{
          id: this.$route.params.id
        },
        tableData:{
          list:[]
        }
      }
    },
    created () {
      var _this = this
      _this.info(function () {
        _this.proList()
      })
    },
    methods: {
      info(fn){
        this.$store.dispatch('post', {
          uri : 'orderProductBatchOut/detail',
          data: {
            id: this.batchInfo.id
          }
        }).then((res) =>{
          this.batchInfo = res.data.data
          if(typeof (fn) === 'function'){
            fn()
          }
        })
      },
      proList(){
        this.$store.dispatch('post', {
          uri : 'orderProductBatchOut/proList',
          data: {
            outId: this.batchInfo.id
          }
        }).then((res) =>{
          this.tableData.list = res.data.data || []
          this.loading = false
        })
      }
    }
  }
</script>