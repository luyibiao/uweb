<template>
  <div>
    <el-row>
      <el-col :lg="10"
              :md="10">
        <el-breadcrumb class="link-back"
                       separator="/">
          <el-breadcrumb-item to="/marketing/group/list">
            <i class="el-icon-arrow-left icon-smaller"></i>团体客户列表</el-breadcrumb-item>
          <el-breadcrumb-item>团体客户详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :lg="14"
              :md="14"
              v-if="detailTab=='price'">
        <div class="pull-right">
          <ul class="uk-search">
            <li class="uk-search-item">
              <el-select class="ukao-el-select m-r"
                         v-model="businessId"
                         clearable
                         placeholder="所有经营项目">
                <el-option v-for="item in businessList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.businessId">
                </el-option>
              </el-select>
            </li>
            <li class="uk-search-item">
              <el-input placeholder="请输入内容"
                        v-model="keywords">
                <el-button slot="append"
                           class="el-icon-search"
                           @click="search()"></el-button>
              </el-input>
            </li>
            <li class="uk-search-item">
              <auth perm="setting.copy.read">
                <router-link :to="'/setting/copy'">
                  <el-button>去拷贝价格数据</el-button>
                </router-link>
              </auth>
              <auth perm="marketing.group.price">
                <router-link :to="'/marketing/group/new/'+id">
                  <el-button type="primary">新建产品</el-button>
                </router-link>
              </auth>
            </li>
          </ul>

        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:25px">
      <el-col :lg="24"
              :md="24">
      </el-col>
      <el-tabs v-model="detailTab"
               type="card"
               @tab-click="onTabs">
        <el-tab-pane label="客户列表"
                     name="userList">
          <userList v-bind:id="id"></userList>
        </el-tab-pane>
        <el-tab-pane label="产品价格"
                     name="price">
          <price v-bind:id="id"
                 ref="price"></price>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import userList from "./components/userList";
import price from "./components/price";
export default {
  components: {
    userList,
    price
  },

  data() {
    return {
      detailTab: "userList",
      id: this.$route.params.id,
      keywords: "",
      businessId: "",
      businessList: [],
      name: "",
      flag: true
    };
  },
  created() {
    this.getProductBusiness();
  },
  methods: {
    getProductBusiness() {
      this.$store
        .dispatch("getList", {
          uri: "mercBusiness/list",
          data: {}
        })
        .then(res => {
          this.businessList = res.data.data.list || [];
          this.businessList.unshift({
            name: "所有经营项目",
            id: ""
          });
        });
    },
    search() {
      let str = (this.businessId || "") + "," + this.keywords;
      this.$refs.price.tableData.typeId = '';
      this.$refs.price.getKeywordsAndbuss(str);
    },
    onTabs(tab) {
      if (tab.name === "price" && this.flag) {
        this.$refs.price.getDataFlag(tab.name, this.flag);
        this.flag = false;
      }
    }
  }
};
</script>
<style scoped>
.category {
  border: 1px solid #e5e5e5;
  height: 100px;
}
.category_header {
  background-color: #e5e5e5;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
ul.uk-search {
  margin: -9px;
  padding: 0;
}
.uk-search .uk-search-item {
  margin-bottom: 0;
}
</style>