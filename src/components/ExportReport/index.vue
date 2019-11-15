// 导出表表弹窗
<template>
  <div>
    <el-table :data="list">
      <el-table-column prop="date" label="时间区间" width="180">
        <template slot-scope="scope">
          {{scope.row.startDate + '~' + scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间">
        <template slot-scope="scope">
          {{scope.row.createTime|getDateTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createName"
        label="操作人">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status|getValText('OPERATE_STATUS')}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" v-if="scope.row.status != -1" :loading="!scope.row.status" @click="download(scope.row.id)">下载报表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="text-right">
      <el-pagination :page-size="pagination.size"
                     layout="prev, pager, next"
                     :total="pagination.total"
                     :current-page.sync="pagination.page"
                     @current-change="queryList">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
export default {
  props: {
    bizType: {//业务类型
      type: String
    },
    title: { // 标题
      type: String
    },
    toQuery: {
      type: Boolean
    }
  },
  data() {
    return {
      list: [],
      pagination: {
        size: 5,
        total: 0,
        page: 1
      }
    }
  },
  created() {
    this.queryList();
  },
  watch:{
    'toQuery'() {
      if (this.toQuery) {
        this.queryList();
      }
    }
  },
  methods: {
    queryList(page=1) {
      if (page) {
        this.pagination.page = parseInt(page || 1);
      }
      let startRow = (this.pagination.page - 1) * this.pagination.size;
      let toCheck = false;
      //获取活动方案充值列表
      this.$store.dispatch("post", {
          uri: "reportExport/list",
          data:{
            startRow,
            bizType: this.bizType,
            pageSize: this.pagination.size
          }
        }).then(res => {
          let list = res.data.data.list || [];
          this.list = list;
          this.pagination.total = res.data.data.total || 0;
          list.forEach(function(item) {
            if (item.status == 0) {
              toCheck = true;
            }
            if (item.queryJson) {
              let qj = JSON.parse(item.queryJson);
              if (item.bizType == 'order') {
                item.startDate = qj.startCreateTime;
                item.endDate = qj.endCreateTime;
              }
            }
          });

          if (toCheck) {
            let _this = this;
            setTimeout(function(){_this.queryList(_this.pagination.page)},3000);
          }
        });
    },
    download(id){
      window.open(consts.BASE_URL + "/reportExport/download?id=" + id);
    }
  }
};
</script>

/**  
 参数:
  props : [bizType,title,show]  业务类型|String，弹出框标题| Number，是否显示弹出框 | Number
**/