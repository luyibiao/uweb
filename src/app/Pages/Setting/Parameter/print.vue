
<template>
  <div>
    <el-tabs v-model="printset"
             type="card">
      <el-tab-pane label="小票内容设置"
                   name="printcontent">
        <printContent></printContent>
      </el-tab-pane>
      <el-tab-pane label="合格证设置"
                   name="cercontent">
        <cerContent></cerContent>
      </el-tab-pane>
      <el-tab-pane label="水洗标设置"
                   name="careLabel">
        <careLabel ></careLabel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
import printContent from "./components/print_Content";
import cerContent from "./components/cer_Content";
import careLabel from "./components/care_label.vue"
export default {
  data() {
    return {
      printset: "printcontent",
      printcontenta: "",
      detail:{
        washLabelConfig:''
      }
    };
  },
  components: {
    printContent,
    cerContent,
    careLabel
  }
};
</script>

