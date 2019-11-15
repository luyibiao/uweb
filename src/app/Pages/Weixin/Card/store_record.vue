<template>
	<div>
		<div class="tip">
			会员储值可提升客户忠诚度、增强会员粘性。可根据需要创建储值规则，并针对不同的储值规则配置不同的储值营销活动，会员储值后客户可在消费时使用余额进行支付。
		</div>
		<div class="m-t">
			<ul class="ukao-tabs-nav clearfix">
				<li class="ukao-tabs-item" @click="routeTo">储值规则</li>
				<li class="ukao-tabs-item is-active">储值记录</li>
			</ul>
		</div>
		<div class="m-t-lg text-center wrapper" style="background:#f3f7ff">
			<el-row>
			  <el-col :span="8">
			  	<div>
			  		<p class="text-lg m-b-xs">￥{{reportRecharge.rechargeAmt | amtFormat}}</p>
			  		<p>累计储值金额</p>
			  	</div>
			  </el-col>
			  <el-col :span="8">
			  	<div>
			  		<p class="text-lg m-b-xs">{{reportRecharge.userCnt}}/{{reportRecharge.rechargeCnt}}</p>
			  		<p>累计储值人次</p>
			  	</div>
			  </el-col>
			  <el-col :span="8">
			  	<div>
			  		<p class="text-lg m-b-xs">￥{{reportRecharge.restAmt | amtFormat}}</p>
			  		<p>储值总余额</p>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="m-t-xl">
			<el-table class="ukao-el-table"
        v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="头像">
		      <template slot-scope="scope">
		        <img class="thumb" :src="scope.row.headimgPath || '/static/img/user/def.png'" alt="">
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="客户">
		      <template slot-scope="scope">
		        <div>{{ scope.row.userName }}</div>
		        <div class="text-primary">{{ scope.row.userPhone }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.tradeTime| getDate}}</div>
		        <div>{{ scope.row.tradeTime| getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="储值金额（元）">
		      <template slot-scope="scope">
		        <div>{{ scope.row.amount| amtFormat }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="营销活动">
		      <template slot-scope="scope">
		        <div v-if="scope.row.giftAmount">赠送金额{{scope.row.giftAmount | amtFormat}}元</div>
            <div v-if="scope.row.coupons">赠送优惠券：</div>
            <div v-for="coupon in parseJson(scope.row.coupons)">{{coupon.name}}（{{coupon.cnt}}张）</div>
		        <div v-if="scope.row.giftPoint">送{{scope.row.giftPoint}}积分</div>
            <div v-if="scope.row.cardId">送会员卡：{{scope.row.cardName}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="储值后金额（元）">
		      <template slot-scope="scope">
		        <div>{{scope.row.balance | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="支付流水号">
		      <template slot-scope="scope">
		        <div class="text-primary">{{scope.row.seq}}</div>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
          :total="tableData.pagination.total" @current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
  import consts from '@/utils/consts'
  import time from '@/utils/helpers/timeLite'

	export default {
		data() {
			return {
        loading: true,
        tableData: {
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0
          }
        },
        reportRecharge: {
          userCnt:0,
          rechargeCnt:0,
          rechargeAmt:0,
          restAmt:0
        }
			}
		},
    created () {
      this.list();
      this.report();
    },
    filters : {
      getDate(value) {
        return time.getDate(value);
      },
      getTime(value) {
        return time.getTime(value);
      }
    },
		methods: {
			routeTo: function() {
				this.$router.push('store_rule');
			},
      parseJson: function(str) {
        return JSON.parse(str);
      },
      handleCurrentChange (val){
        this.list((val-1) * this.tableData.pagination.size)
      },
      report(){
        this.$store.dispatch('post', {
          uri : 'reportRecharge/getTotal'
        }).then((res) =>{
          if (res.data.data) {
            this.reportRecharge = res.data.data;
					}
        })
      },
      list (start) {
        this.loading = true;
        this.$store.dispatch('post', {
          uri : 'userRecharge/list',
          data: {
            startRow: start| 0,
            pageSize: this.tableData.pagination.size
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false;
        })
      }
		}
	}	
</script>

<style scoped>
	.tip {
		max-width: 600px;
		padding: 15px;
		background: #f3f7ff;
		border-radius: 10px;
	}
</style>
