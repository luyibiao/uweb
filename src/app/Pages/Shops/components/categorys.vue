<template>
  <div class="relase-bg">
    <ul class="goods-categorys clearfix">
      <li class="category-item" 
        v-for="(item,index) in list" 
        :class="{'is-active': category === item.id}" 
        :key="index"
        @click="selectCategory(item)">{{item.name}}</li>
      <li class="category-item category-others"
        :class="{'is-active': otherIndex !== -1}"         >
        <span class="icon-other">{{otherIndex !== -1 ? otherList[otherIndex].name : '其他'}}</span>
        <div ref="other" class="others" :style="hideOther?'display:none':''">
          <el-radio-group size="small" v-model="otherIndex" @change="radioChange">
            <el-radio :label="index" v-for="(item,index) in otherList" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      // 主选项
      list: [],
      // 其他选项
      otherList: [],
      // 主选项值
      category: "",
      // 第i 个其他选项
      otherIndex: -1,
      hideOther: false
    };
  },
  created() {
    this.getLists();
  },
  watch: {
    value(n) {
      if (this.category !== n) {
        this.initValue();
      }
    }
  },
  methods: {
    // 获取分类列表
    getLists() {
      this.$store
        .dispatch("post", {
          uri: "categoryInfo/list"
        })
        .then(res => {
          let list = res.data.data.list;
          this.list = list.splice(0, 7);
          this.otherList = list;
          this.initValue();
          this.$emit("loaded");
        });
    },
    initValue() {
      this.category = this.value;
      let data = this.list.filter(item => {
        return item.id === this.value;
      });
      if (!data.length) {
        for (let index = 0; index < this.otherList.length; index++) {
          if (this.otherList[index].id === this.value) {
            this.otherIndex = index;
            return false;
          }
        }
      }
    },
    // 选择主选项
    selectCategory(item) {
      this.category = item.id;
      this.otherIndex = -1;
      this.$emit("input", item.id);
      this.$emit("change", item);
    },
    // 选择其他选项
    radioChange(value) {
      if (value !== -1) {
        this.category = "";
        this.$emit("input", this.otherList[value].id);
        this.$emit("change", this.otherList[value]);
        this.hideOther = true;
        setTimeout(() => {
          this.hideOther = false;
        }, 200);
      }
    }
  }
};
</script>
// 选择商品类别
// Events
//  name|params|description
//  loaded|无|数据加载完成触发