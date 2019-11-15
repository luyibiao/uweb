<template>
  <div v-loading.body="loading">
    <el-breadcrumb class="link-back m-b-md" separator="/">
      <el-breadcrumb-item to="/worker/list"><i class="el-icon-arrow-left icon-smaller"></i>员工列表</el-breadcrumb-item>
      <el-breadcrumb-item >员工详情</el-breadcrumb-item>
      <el-breadcrumb-item v-if="staffInfo && activeName != 'detail'">{{staffInfo.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- v-if="staffInfo && (staffInfo.roleId == 3 || staffInfo.roleId == 10 || staffInfo.roleId == 11)" -->
    <el-tabs  v-model="activeName" type="card" @tab-click="nexPage">
      <el-tab-pane v-for="(item,index) in navs" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
	  <router-view v-if="activeName === 'detail'" @updateInfo="getInfo" :workerInfo="staffInfo"></router-view>
    <router-view v-else></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navs: [
        { name: "基本信息", value: "detail" },
        { name: "收成概况", value: "harvest" },
        { name: "收支明细", value: "spending" },
        { name: "提现记录", value: "withdraw" },
        { name: "代付记录", value: "instead" }
      ],
      staffInfo: null, //员工信息
      id: "", //员工id
      activeName: "detail", //当前导航栏名
      loading: true, //加载中
    };
  },
  created() {
    this.init();
  },
  methods: {
    nexPage() {
      this.$router.push(`/worker/${this.activeName}/${this.id}`);
    },
    init() {
      this.id = this.$route.params.id;
      this.activeName = this.$route.path.split("/")[2] || "";
      this.getInfo(this.hasCompetence);
    },
    // 获取信息
    getInfo(fn) {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "workerInfo/detail",
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.staffInfo = res.data.data;
          this.loading = false;
          fn && fn();
        });
    },
    hasCompetence() {
      if (this.activeName != "detail" && this.staffInfo.roleId !== 3) {
        this.$router.replace(`/worker/detail/${this.id}`);
        this.activeName = "detail";
      }
    }
  }
};
</script>
