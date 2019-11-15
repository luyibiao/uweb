<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'6'"></v-list-tab-nav>
		</div>

		<div class="m-t-lg"
		     v-loading="loading">
			<el-table class="ukao-el-table"
			          :data="tableData.list"
			          tooltip-effect="dark"
			          style="width: 100%">
				<el-table-column label="获赠时间">
					<template slot-scope="scope">
						<div>{{ scope.row.createTime | getDate}} </div>
						<div>{{ scope.row.createTime | getTime}}</div>
					</template>
				</el-table-column>
				<el-table-column label="优惠券名称">
					<template slot-scope="scope">
						<div>{{ scope.row.name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="券面值（元）">
					<template slot-scope="scope">
						<div>{{ scope.row.amount | amtFormat }}</div>
						<div class="text-muted">满{{scope.row.fullAmount| amtFormat}}元可用</div>
						<!--<div class="text-muted">每人{{scope.row.perUserNum}}张</div>-->
					</template>
				</el-table-column>
				<el-table-column label="使用规则">
					<template slot-scope="scope">
						<div>{{ scope.row.couponRuleName }}</div>
						<div v-if="scope.row.useBalance != 1">不能与余额同时使用</div>
					</template>
				</el-table-column>
				<el-table-column label="到期时间">
					<template slot-scope="scope">
						<div>{{ scope.row.timeEnd | getDate}}</div>
					</template>
				</el-table-column>
				<el-table-column label="使用时间">
					<template slot-scope="scope">
						<div>{{ scope.row.usedTime | getDate }}</div>
						<div>{{ scope.row.usedTime | getTime }}</div>
					</template>
				</el-table-column>
				<el-table-column label="订单">
					<template slot-scope="scope">
						<a v-if="scope.row.orderId"
						   target="_blank"
						   :href="'/order/list/detail/'+scope.row.orderId"
						   class="text-primary">
							详情
						</a>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<p v-if="dateStatus(scope.row)===-2" class="text-danger">已过期</p>
						<p v-else-if="dateStatus(scope.row)===-1" class="text-danger">已作废</p>
						<p v-else-if="dateStatus(scope.row)===0" class="text-muted">未使用</p>
						<p v-else-if="dateStatus(scope.row)===1" class="text-success">已使用</p>
						<p v-else-if="dateStatus(scope.row)===2" class="text-muted">已失效</p>
					</template>
				</el-table-column>
				<el-table-column label="说明 | 标签">
					<template slot-scope="scope">
						<div>
							<el-popover ref="popover1"
							            placement="bottom"
							            width="200"
							            trigger="hover">
								<div v-if="scope.row.detail || scope.row.tagLis">
									<p>{{scope.row.detail}}</p>
									<p v-if="scope.row.tagList">
										<el-tag type="primary"
										        :key="tag"
										        v-for="tag in scope.row.tagList">{{tag.name}}</el-tag>
									</p>
								</div>
								<div class="text-muted text-center"
								     v-else>
									暂无内容
								</div>
							</el-popover>
							<a v-popover:popover1
							   class="text-primary">查看</a>
							<auth perm="client.list.all.coupon">
								<span v-if="scope.row.useStatus ===0&& scope.row.isValid !==0">-
									<el-button type="text"
														 class="text-danger"
														 @click="deleteUs(scope.row)">作废</el-button>
								</span>
							</auth>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination class="pull-right"
			               :page-size="tableData.pagination.size"
			               layout="total, prev, pager, next"
			               :total="tableData.pagination.total"
			               @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import base from "@/utils/helpers/base";
import time from "@/utils/helpers/timeLite";
import vListTop from "@/app/Pages/Client/List/listtop";
import vListTabNav from "@/app/Pages/Client/List/listtabnav";
import msg from "@/utils/msg";
export default {
  components: {
    vListTop,
    vListTabNav
  },
  data: function() {
    return {
      loading: true,
      tableData: {
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0
        },
        userId: this.$route.params.id
      }
    };
  },
  created() {
    this.list();
  },
  methods: {
    dateStatus(item) {

      if (item.status === 1 &&item.useStatus === 1) {
        return 1; //已使用
			}
      if (item.status === 1 &&item.shareStatus === 1) {
        return 2; //已分享
      }
			if (item.status === 0) {
        return -1; //已作废
			}
			if (item.isValid !== 1) {
        return -2; //已过期
			}

			if (item.status === 1 && item.useStatus === 0) {
			 	return 0; //未使用
			}
    },
    deleteUs(item) {
      let _this = this;
      msg.confirm({
        msg: "确认作废?",
        confirmFn: _ => {
          _this.$store
            .dispatch("post", {
              uri: "couponUserRel/delete",
              data: { id: item.id }
            })
            .then(res => {
              msg.success();
              _this.list();
            });
        }
      });
    },
    list(start) {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "couponUserRel/couponList",
          data: {
            startRow: start | 0,
            userId: this.tableData.userId || 0,
            pageSize: this.tableData.pagination.size
          }
        })
        .then(res => {
          const list = res.data.data.list || [];
          list.forEach(function(item) {
            item.tagList = item.tagNames ? eval(item.tagNames) : [];
          });
          this.tableData.pagination.total = res.data.data.total || 0;
          this.tableData.list = list;
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.list((val - 1) * this.tableData.pagination.size);
    }
  }
};
</script>