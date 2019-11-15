<template>
  <div>
    <el-breadcrumb class="link-back m-b-md" separator="/">
      <el-breadcrumb-item to="/marketing/friend/list"><i class="el-icon-arrow-left icon-smaller"></i>友商列表</el-breadcrumb-item>
      <el-breadcrumb-item>友商详情</el-breadcrumb-item>
      <el-breadcrumb-item v-if="activeName !== 'detail'">{{detail.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs class="m-b-sm" v-model="activeName" type="card" @tab-click="nexPage">
      <el-tab-pane v-for="(item,index) in navs" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
    <router-view v-if="activeName === 'detail'" :detail="detail" @updateDetail="getDetail"></router-view>
    <router-view v-else></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",
      navs: [
        { name: "基本信息", value: "detail" },
        { name: "收成概况", value: "harvest" },
        { name: "收支明细", value: "spending" },
        { name: "提现记录", value: "withdraw" },
        { name: "加粉列表", value: "fans" },
        { name: "分润明细", value: "profit" }
      ],
      activeName: "detail", //当前导航栏名
      url: "", //url前缀
      // 友商详情
      detail: {}
    };
  },
  created() {
    this.init();
    this.getDetail();
  },
  methods: {
    // 初始化数据
    init() {
      let path = this.$route.path.split("/");
      this.id = this.$route.params.id;
      this.activeName = path.splice(path.length - 2)[0];
      this.url = path.join("/");
    },
    // 点击导航栏
    nexPage() {
      this.$router.push(`${this.url}/${this.activeName}/${this.id}`);
    },
    // 友商详情
    getDetail() {
      this.$store
        .dispatch("get", {
          uri: "friendInfo/detail",
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
        });
    }
  }
};
</script>
