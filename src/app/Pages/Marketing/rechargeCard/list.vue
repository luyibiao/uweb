<template>
	<div>
		<auth perm="marketing.recharge.update">
			<div class="text-right">
				<el-button @click="$router.push('add')" type="primary" >批量制作充值卡</el-button>
			</div>
		</auth>
		<el-tabs v-model="tabName" type="card" @tab-click="tabChange">
			<el-tab-pane label="全部" name="0"></el-tab-pane>
			<el-tab-pane label="正有效" name="2"></el-tab-pane>
			<el-tab-pane label="未生效" name="1"></el-tab-pane>
			<el-tab-pane label="已失效" name="-1"></el-tab-pane>
		</el-tabs>
		<el-table class="ukao-el-table m-t"
			:data="tableData"
			style="width: 100%">
			<el-table-column
				label="制作时间"
			>
				<template slot-scope="scope">
					<div>{{ scope.row.createTime | getDate }}</div>
					<div>{{ scope.row.createTime | getTime }}</div>
				</template>
			</el-table-column>
			<el-table-column
				label="生效时间 | 失效时间"
			>
				<template slot-scope="scope">
            <div>{{ scope.row.timeStart | getDate }}</div>
            <div>{{ scope.row.timeEnd | getDate }}</div>
				</template>
			</el-table-column>
			<el-table-column
				label="库存">
				<template slot-scope="scope">
					<router-link :to="'detail/'+scope.row.id" class="text-primary">{{scope.row.cnt-scope.row.redeemCnt}}</router-link>
				</template>
			</el-table-column>
			<el-table-column
				label="批次">
				<template slot-scope="scope">
					<router-link :to="'detail/'+scope.row.id" class="text-primary">{{scope.row.id}}</router-link>
				</template>
			</el-table-column>
			<el-table-column
				label="面值（元）"
			>
				<template slot-scope="scope">
					{{scope.row.faceValue | amtFormat}}
				</template>
			</el-table-column>
			<el-table-column
				label="总数量 | 已兑换"
			>
				<template slot-scope="scope">
					<router-link :to="'detail/'+scope.row.id" class="text-primary">
						{{scope.row.cnt}}
						<span class="text-black">/</span>
						{{scope.row.redeemCnt}}
					</router-link>
				</template>
			</el-table-column>
			<el-table-column
				label="总金额 | 已兑换金额"
			>
				<template slot-scope="scope">
					<router-link :to="'detail/'+scope.row.id" class="text-primary">
						{{ scope.row.faceValue | totalAmount(scope.row.cnt) | amtFormat}}
						<span class="text-black">/</span>
						{{ scope.row.faceValue | totalAmount(scope.row.redeemCnt) | amtFormat}}
					</router-link>
				</template>
			</el-table-column>
			<el-table-column
				prop="limit"
				label="领取限制">
				<template slot-scope="scope">
					<p v-if="scope.row.useNumLimit">每人{{scope.row.useNumLimit}}次</p>
					<p v-else>不限</p>
				</template>
			</el-table-column>
			<el-table-column
				label="状态">
				<template slot-scope="scope">
					<!-- {{ scope.row.timeStart | dateStatus(scope.row.timeEnd)}} -->
					<p v-show="dateStatus(scope.row.timeStart,scope.row.timeEnd)==='0'" class="text-muted">未生效</p>
					<p v-show="dateStatus(scope.row.timeStart,scope.row.timeEnd)==='1'" class="text-danger">已失效</p>
					<p v-show="dateStatus(scope.row.timeStart,scope.row.timeEnd)==='2'" class="text-success">正有效</p>
				</template>
			</el-table-column>
			<el-table-column
				width="80"
				label="备注">
				<template slot-scope="scope">
					<el-button type="text" @click="showRemark(scope.row.detail)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="text-right m-t-sm">
	  	<el-pagination 
				:current-page.sync="pagination.current" 
				:page-size="pagination.size" 
				layout="total, prev, pager, next" 
				:total="pagination.total" 
				@current-change="updateUrl">
			</el-pagination>
	  </div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
import timeLite from "@/utils/helpers/timeLite";
export default {
  data() {
    return {
      loading: false,
      tabName: "0",
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE20,
        total: 0,
        current: 1
      },
      tableData: []
    };
  },
  created() {
    this.init();
    this.getData();
  },
  watch: {
    $route() {
      this.init();
      this.getData();
      window.scrollTo(0, 0);
    }
  },
  methods: {
		dateStatus(start,end){
			 const timestamp = +new Date();
      if (timestamp < start) {
        return "0";
      }
      if (timestamp > timeLite.add(end, 1, "days")) {
        return "1";
      }
      return "2";
		},
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.tabName = data.status || "0";
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          status: this.tabName
        }
      });
    },
    tabChange() {
      this.pagination.current > 1
        ? (this.pagination.current = 1)
        : this.updateUrl();
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "rechargeCard/batch/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size || 0,
            pageSize: this.pagination.size,
            dateStatus: this.tabName === "0" ? "" : this.tabName || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    showRemark(data) {
      this.$msgbox({
        title: "备注",
        message: data || "无",
        confirmButtonText: "关闭",
        callback: _ => {}
      });
    }
  },
  filters: {
    // 时间状态
    // dateStatus(start, end) {
    //   const timestamp = +new Date();
    //   if (timestamp < start) {
    //     return "0";
    //   }
    //   if (timestamp > timeLite.add(end, 1, "days")) {
    //     return "已失效";
    //   }
    //   return "正有效";
    // },
    totalAmount(x, y) {
      return calculation.accMul(x, y);
    }
  }
};
</script>