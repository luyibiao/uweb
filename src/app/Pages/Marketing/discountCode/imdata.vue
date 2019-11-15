<template>
	<div>
		<!-- <div class="text-right">
			<el-button type="primary" @click="$router.push('create')">
				<i class="el-icon-plus m-r-xs"></i>新建批量导入
			</el-button>
		</div> -->
		<div class="m-t">
			<el-table class="ukao-el-table"
				v-loading="loading"
		    style="width: 100%"
        :data="tableData">
        <el-table-column
					prop="name"
		      label="优惠码名称">
		    </el-table-column>
         <el-table-column
					prop="mercName"
		      label="商户名称">
		    </el-table-column>
		    <el-table-column
		      label="导入时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.createTime | getDate }}</div>
		        <div>{{ scope.row.createTime | getTime }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="预计导入数">
          <template slot-scope="scope">
            <p>{{scope.row.successCnt+scope.row.errorCnt}}</p>
          </template>
		    </el-table-column>
				<el-table-column
		      label="成功数">
		      <template slot-scope="scope">
		        <div class="text-success">{{scope.row.successCnt}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
		      label="失败数">
		      <template slot-scope="scope">
		        <div class="text-danger">{{scope.row.errorCnt}}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					prop="createName"
		      label="导入者">
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <router-link :to="'/marketing/discountCode/imdetail/'+scope.row.id" class="text-primary">详情</router-link>
						<!--<el-button type="primary" v-show="scope.row.errorCnt > 0" size="mini" @click="download(scope.row.id)">下载失败数据</el-button>-->
						<!-- <el-button type="text">详情</el-button> -->
		      </template>
		    </el-table-column>
		  </el-table>
			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="pagination.size"
					:current-page.sync="pagination.current"
		      layout="total, prev, pager, next"
					@current-change="updateUrl"
		      :total="pagination.total">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";

export default {
  data: function() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      }
    };
  },
  created() {
    this.initPramas();
    this.list();
  },
  watch: {
    $route() {
      this.initPramas();
      this.list();
    }
  },
  methods: {
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "impCouponCodeBatch/list",
          data: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    initPramas() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
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
    },
		download(id) {
    	window.open(consts.BASE_URL+'/import/userBatch/failed/download?batchId='+id);
  	}
  }
};
</script>