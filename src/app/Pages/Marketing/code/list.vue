<template>
  <div>
    <el-button type="primary"
               @click="$router.push('create')">新建</el-button>
    <el-table class="ukao-el-table m-t"
              :data="tableList"
              v-loading="loading">
      <el-table-column label="收款码">
        <template slot-scope="scope">
          <qrcode slot="content"
                  :value="wxUrl + '/obtain_list?u_code=' + scope.row.code + '&ids=' + scope.row.id"
                  :options="{ size: 110 }"
                  :id="'qrcode'+scope.row.id"></qrcode>
          <p>{{scope.row.name}}</p>
          <a id="downloadLink"></a>
        </template>
      </el-table-column>
      <el-table-column label="优惠">
        <template slot-scope="scope">
          <p>满{{scope.row.fullAmount}}元减{{scope.row.amount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">
          <span v-if="scope.row.tags.length>0 && scope.row.tags">
            <p v-for="item in scope.row.tags">
              {{item.name}}
            </p>
          </span>
          <p v-else>无标签</p>
        </template>
      </el-table-column>
      <el-table-column label="生成时间">
        <template slot-scope="scope">
          <p>{{scope.row.create_time | getDate}}</p>
          <p>{{scope.row.create_time | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="收款码类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type===1">自助收款码</p>
          <span v-else>
            <p>指定金额收款</p>
            <p>{{scope.row.amount}}元</p>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收款情况">
        <template slot-scope="scope">
          <router-link to="record"
                       class="text-primary">收款记录</router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="onOperation(1,scope.row)">删除</el-button><br>
          <el-button type="text"
                     @click="onOperation(2,scope.row)">编辑</el-button><br>
          <el-button type="text"
                     @click="copyUrl(scope.row)">复制链接</el-button><br>
          <!-- <input type="text" readonly :id="'js_url_' + scope.row.id" :value="wxUrl + '/obtain_list?u_code=' + scope.row.code + '&ids=' + scope.row.id"/> -->
          <el-button type="text"
                     @click="downCode(scope.row)">下载收款码</el-button>
          <div ref="ahref" class="copy"></div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="text-right m-t-lg">
      <el-pagination :current-page.sync="pagination.current"
                     :page-size="pagination.size"
                     layout="total, prev, pager, next"
                     :total="pagination.total"
                     @current-change="updateUrl"> </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import qrcode from "@xkeshi/vue-qrcode";
import msg from "@/utils/msg";
export default {
  components: {
    qrcode
  },
  data() {
    return {
      wxUrl: consts.WX_URL,
      loading: false,
      tableList: [],
      tags: [],
      pagination: {
        size: consts.PAGE_SIZE / 2,
        total: 0,
        current: 1
      }
    };
  },
  created() {
    this.init();
    this.getList();
  },
  watch: {
    $route() {
      this.init();
      this.getList();
    }
  },
  methods: {
    editS(item) {
      this.$router.push({ path: "/marketing/code/create?id=" + item.id });
    },
    deleteS(item) {
      let _this = this;
      msg.confirm({
        msg: "确定删除?",
        confirmFn() {
          _this.$store
            .dispatch("post", {
              uri: "cashierCode/delete",
              data: { id: item.id }
            })
            .then(res => {
              msg.success();
              _this.getList();
            });
        }
      });
    },
    onOperation(type, item) {
      let _this = this;
      type === 1 ? _this.deleteS(item) : _this.editS(item);
    },
    copyUrl(item) {
      let obj = this.$refs.ahref;
      let element = document.createElement("input");
      element.setAttribute(
        "value",
        "wxUrl" + "/obtain_list?u_code=" + item.code + "&ids=" + item.id
      );
      element.setAttribute("type", "text");
      obj.appendChild(element);
      element.select();
      document.execCommand("Copy");
      msg.success("复制成功");
      element.className="copy-hidden"
    },
    downCode(item) {
      var qrcode = document.getElementById("qrcode" + item.id);
      console.log(qrcode);
      //构造url 
      var url = qrcode.toDataURL("image/png");
      // 构造a标签并模拟点击
      var downloadLink = document.getElementById("downloadLink");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "二维码.png");
      downloadLink.click();
      msg.success('下载成功')
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
    },

    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "cashierCode/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          let item = res.data.data.list;
          for (let i = 0; i < item.length; i++) {
            item[i].tags = eval(item[i].tags);
          }
          this.tableList = res.data.data.list || [];
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    }
  },
  components: {
    qrcode
  }
};
</script>
<style>
.copy{
  opacity: 0;
}
.copy-hidden{
  display: none;
}
</style>



