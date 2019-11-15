<template>
  <div>
    <ul class="uk-search">
      <li class="uk-search-item">
        <div class="uk-search-label">收款码类型：</div>
        <el-select class="uk-search-content w"
                   v-model="search.type"
                   placeholder="请输入"
                   @change="onCodeType">
          <el-option v-for="item in params.codeType" :label="item.name" :key="item.label" :value="item.label"> </el-option>
        </el-select>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label"> 收款码标签：</div>
        <el-select class="uk-search-content w"
                   filterable
                   remote
                   :remote-method="remoteSearchLabel"
                   v-model="search.tagId"
                   placeholder="请输入"
                   >
          <el-option v-for="item in params.tags" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </li>
      <li class="uk-search-item">
        <el-button type="primary"
                   @click="onSelect">筛选</el-button>
      </li>
    </ul>
    <el-table class="ukao-el-table m-t"
              :data="tableList"
              v-loading="loading">
      <el-table-column label="客户" prop="userName">
      </el-table-column>
      <el-table-column label="收款时间">
        <template slot-scope="scope">
          <p>{{scope.row.payTime | getDate}}</p>
          <p>{{scope.row.payTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="应付金额（元）">
        <template slot-scope="scope">
          <p>{{scope.row.payablePrice | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column label="实付金额（元）">
        <template slot-scope="scope">
          <p>{{scope.row.paymentPrice | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column label="收款码名称" prop="name">
      </el-table-column>
      <el-table-column label="收款码类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type===1">自助收款码</p>
          <p v-else>指定金额收款</p>
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">
           <p v-for="item in scope.row.tags">
            {{item.name}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link to="/"
                       class="text-primary">订单详情</router-link>
        </template>
      </el-table-column> -->
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
export default {
  data() {
    return {
      loading: false,
      search: {
        type: "",
        tagId: "" 
      },
      tableList: [],
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      params:{
        codeType:[
           {
            label:"",
            name:'全部'
          },
          {
            label:'1',
            name:'自助收款码'
          },
          {
            label:'2',
            name:"指定金额收款"
          },
        ],
        tags:[
          { 
            id:'',
            name:'全部'
          }
        ]
      }
    };
  },
  created() {
    this.init();
    this.getData();
    this.getTags();
  },
  watch: {
    $route() {
      this.init();
      this.getData();
    }
  },
  methods: {
    onSelect(){
      this.getData();
    },
    onCodeType(){
      this.getData();
    },
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) != "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.search.type = data.type || "";
        //this.search.tagId = data.tagId || "";
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          type: this.search.type,
          tagId: this.search.tagId
        }
      });
    },
    searchData() {
      this.pagination.current > 1 ? this.updateUrl() : (this.pagination = 1);
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "cashierOrder/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            type: this.search.type,
            tagId: this.search.tagId+''
          }
        })
        .then(res => {
           let item=res.data.data.list;
          for(let i=0;i<item.length;i++){
             item[i].tags=eval(item[i].tags);
          }
          this.tableList = res.data.data.list || [];
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    getTags(){
       let _this=this
      this.$store.dispatch('post',{
        uri:'cashierTag/list',
      }).then(res=>{
        let item=res.data.data.list ||[];
          item.unshift({name:'全部',val:''})
        this.params.tags=item || [];
      })
    },
    remoteSearchLabel(query) {
      if (query.replace(/\s/g, "")) {
      }
    }
  }
};
</script>
