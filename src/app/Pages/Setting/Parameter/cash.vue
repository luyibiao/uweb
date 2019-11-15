<template>
  <div>
    <el-tabs v-model="cashset"
             type="card">
      <el-tab-pane label="通洗智店功能控制"
                   name="cashControl">
        <cashControl></cashControl>
      </el-tab-pane>
      <el-tab-pane label="副屏轮播图"
                   name="cashAdve">
        <cashAdve></cashAdve>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import msg from "@/utils/msg";
  import calculation from "@/utils/helpers/calculation";
  import cashControl from "./components/cash_control";
  import cashAdve from "./components/cash_advel";
  export default {
    data() {
      return {
        cashset: "cashControl",
      };
    },
    methods: {},
    components: {
      cashControl,
      cashAdve
    }
  };
</script>