<template>
  <div>
    <el-breadcrumb class="link-back m-b-md" separator="/">
      <el-breadcrumb-item to="/plant/list"><i class="el-icon-arrow-left icon-smaller"></i>工厂列表</el-breadcrumb-item>
      <el-breadcrumb-item v-if="name">{{name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-radio-group v-model="menuName" @change="change">
      <auth perm="plant.update">
        <el-radio-button label="info">工厂详情</el-radio-button>
        <el-radio-button label="statistics">员工操作统计</el-radio-button>
        <el-radio-button label="station">工位设置</el-radio-button>
        <template slot="noPerm">
          <el-radio-button label="info">工厂详情</el-radio-button>
          <el-radio-button label="statistics">员工操作统计</el-radio-button>
        </template>
      </auth>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      default: ""
    },
    menu: {
      default: ""
    }
  },
  watch: {
    menu(n) {
      this.menuName = n;
    }
  },
  created() {
    this.menuName = this.menu;
  },
  data() {
    return {
      menuName: ""
    };
  },
  methods: {
    change(value) {
      this.$router.push(`/plant/${value}/${this.$route.params.id}`);
    }
  }
};
</script>
