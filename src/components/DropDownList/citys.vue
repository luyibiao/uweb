<template>
  <div class="dis-inline ukao-form" v-if="workInfo.roleId === 1">
    <span class="m-r-sm">所属城市：</span>
    <el-select  class="w-sm" v-model="id" placeholder="请选择" multiple collapse-tags style="min-width: 200px;" @change="change">
      <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["value"],
  data() {
    return {
      id: [],
      cityList: []
    };
  },
  created() {
    this.queryCityList();
    this.id = this.value || [];
  },
  methods: {
    queryCityList() {
      this.$store
        .dispatch("post", {
          uri: "mercCity/queryForSelect"
        })
        .then(res => {
          this.cityList = res.data.data || [];
        });
    },
    change(value) {
      this.$emit("input", value || "");
    },
    clearCities(){
      this.id = [];
      this.$emit("input", "");
    }
  },
  computed: {
    ...mapState(["workInfo"])
  }
};
</script>

/*
  城市下拉列表组件
    props
      属性名|说明
      value|城市id
 */

