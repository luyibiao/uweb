<template>
  <div class="dis-inline">
    <el-popover
      ref="addpopover"
      placement="bottom"
      v-model="show"
      width="265">
      <el-input
        v-focusUpdate="show"  
        v-model.trim="name"
        @keyup.enter.native="save"
        class="w-sm m-r-sm"></el-input>
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </el-popover>
    <el-button type="text" @click="before"  v-popover:addpopover>+ 添加</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      show: false
    };
  },
  methods: {
    before() {
      if (!this.name) {
        this.$emit("before");
      }
    },
    save() {
      if (this.name) {
        this.$emit("save", this.name);
      }
      this.show = false;
      this.name = "";
    },
    cancel() {
      this.name = "";
      this.show = false;
    }
  },
  directives: {
    focusUpdate: {
      //绑定参数更新时 并且由false->true  input框选为中状态
      update(el, { value, oldValue }) {
        if (value && !oldValue) {
          //绑定的值为true  并且旧值为false则 focus
          el.children[0].focus();
        }
      }
    }
  }
};
</script>
// 添加标签组件
// Events
    name | params | 说明
    before | 无 | 输入标签之前
    save | 标签名 | 保存输入的标签