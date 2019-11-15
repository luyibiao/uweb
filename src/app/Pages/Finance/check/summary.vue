<template>
	<div>
		<div>
			<div class="">
				<ul class="ukao-tabs-nav clearfix">
					<li class="ukao-tabs-item" v-for="(item, index) in tabsNavList" v-bind:class="{ 'is-active': active == index }" v-on:click="toggle(index, item.view)" v-text="item.text"></li>
				</ul>
			</div>
			<div class="m-t">
				<el-date-picker v-show="showFlag" v-model="queryTime" id="queryTime" type="month" :clearable=false placeholder="选择月" format="yyyy-MM" ></el-date-picker>
				<el-date-picker v-show="!showFlag" v-model="queryTime" id ="queryTime" align="center" type="year" :clearable=false placeholder="选择年" format="yyyy"></el-date-picker>
				<div class="dis-inline m-b-sm"><button type="button" class="el-button el-button--primary" @click="list()"><!----><!----><span>查询</span></button></div>
			</div>

			<el-table class="ukao-el-table m-t"
								:data="tableData.list"
								style="width: 100%">
				<el-table-column
					label="结算日期">
					<template slot-scope="scope">
						<div>{{ scope.row.settleDate }}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="收入（元）">
					<template slot-scope="scope">
						<div class="text-success" v-if="scope.row.income >0" >+{{ scope.row.income | amtFormat }}</div>
						<div class="text-success" v-else>0</div>
						<div class="text-muted">{{ scope.row.incomeCnt }}笔</div>
					</template>
				</el-table-column>
				<el-table-column
					label="支出（元）">
					<template slot-scope="scope">
						<div class="text-danger" v-if="scope.row.spend >0" >-{{ scope.row.spend | amtFormat }}</div>
						<div class="text-danger" v-else>0</div>
						<div class="text-muted">{{ scope.row.spendCnt }}笔</div>
					</template>
				</el-table-column>
				<el-table-column
					label="余额"
					prop="remain">
					<template slot-scope="scope">
						<div >{{ scope.row.balance | amtFormat }}</div>
					</template>
				</el-table-column>
				<el-table-column
					label="操作">
					<template slot-scope="scope">
						<router-link :to="`/finance/check/summary/${scope.row.settleDate}`" class="text-primary">详情</router-link>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
  import consts from "@/utils/consts";
  import time from "@/utils/helpers/timeLite";
  import msg from "@/utils/msg";
  import vTabNav from '../../Common/tab_nav.vue';

  export default {
    data: function () {
      return {
        showFlag:true,
        active:'',
        currentView: 'firstChild',
        tabsNavList: [
          {view: 'firstChild', text: '日汇总'},
          {view: 'secondChild', text: '月汇总'}
        ],
        tableData: {
          list: [],
          date:'',
        },
        queryTime:new Date(),
				timeFormat:"YYYY-MM",
      }
    },
    created () {
      this.list();
    },
    methods: {
      list() {
        this.$store.dispatch('post', {
          uri: 'tradeBillSum/list',
          data: {
            dateType:this.active+1,
            settleDate:this.queryTime?this.queryTime.format(this.timeFormat):new Date().format(this.timeFormat),
          }
        }).then((res) => {
          this.tableData.list = res.data.data|| [];
        })
      },
      toggle: function (i, v) {
        this.active = i;
        if(v=="firstChild"){
          this.showFlag = true;
          this.timeFormat="YYYY-MM";
          this.list();
				}else{
          this.showFlag = false;
          this.timeFormat="YYYY";
          this.list();
				}
      }
    }

  }
</script>

<style scoped>
	.ukao-tabs-item {
		float: left;
		padding: 5px 10px;
		border: 1px solid #dcdcdc;
		margin-right: -1px;
	}
	.ukao-tabs-item:hover {
		color: #20a0ff;
	}
	.ukao-tabs-item.is-active {
		border-color: #20a0ff;
		color: #20a0ff;
	}
	.ukao-tabs-item.is-active + .ukao-tabs-item {
		border-left-color: #20a0ff;
	}
</style>