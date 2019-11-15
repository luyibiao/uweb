<template>
  <div class="dis-inline ukao-form">
    <span class="m-r-sm">所属门店：</span>
    <el-select  class="w-sm" v-model="id" clearable filterable placeholder="请选择" @change="change">
      <el-option label="全部" value=""></el-option>
      <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      id: "",
      storeList: []
    };
  },
  created() {
    this.queryStoreList();
    this.id = this.value || "";
  },
  methods: {
    queryStoreList() {
      this.$store
        .dispatch("post", {
          uri: "storeInfo/list"
        })
        .then(res => {
          this.storeList = res.data.data.list || [];
        });
    },
    change(value) {
      this.$emit("input", value || "");
    }
  }
};
</script>

/*
  门店下拉列表组件
    props
      属性名|说明
      value|门店id
 */

