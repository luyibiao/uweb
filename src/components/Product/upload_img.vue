<template>
  <div>
    <el-input class="w-md"
              placeholder="请输入关键字"
              v-model.trim="keys">
      <el-button slot="append"
                 @click="searchImgs"
                 icon="el-icon-search"></el-button>
    </el-input>
    <ul class="clearfix m-t-md">
      <li class="pull-left m-r-md usable-img"
          :class="{'selected-img':value && value.path == item.path}"
          v-for="(item,index) in availableImgs"
          :key="item.id"
          @click="selectImg(item)">
        <!-- <img src="/static/img/layout/dashboard.png" alt=""> -->
        <img :src="item.path"
             alt="">
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    // 搜索关键字
    keywords: {
      type: String,
      default: ""
    },
    // 图片对象
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      keys: "",
      path: "",
      availableImgs: [],
      timer: null
    };
  },
  watch: {
    keywords(n, o) {
      if (n) {
        if (this.timer) clearTimeout(this.timer);
        this.setTimer(n);
      }
    }
  },
  methods: {
    setTimer(n) {
      this.timer = setTimeout(_ => {
        this.getAvailableImgs(n);
        this.keys = "";
      }, 800);
    },
    searchImgs() {
      if (this.keys) {
        this.getAvailableImgs(this.keys);
      }
    },
    getAvailableImgs(keywords) {
      this.$store
        .dispatch("get", {
          uri: "attachment/list",
          params: {
            keywords,
            startRow: 0,
            pageSize: 6
          }
        })
        .then(res => {
          this.availableImgs = res.data.data.list;
        });
    },
    selectImg(item) {
      this.path = item.path;
      this.$emit("input", item);
      this.$emit("selected", item);
    }
  }
};
</script>
<style lang="less" scoped>
.usable-img {
  width: 90px;
  height: 90px;
  border: 1px solid transparent;
  cursor: pointer;
  & > img {
    width: 100%;
    height: 100%;
  }
  &:last-child {
    margin-right: 0;
  }
}

.selected-img {
  border: 1px solid #00c800;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border: 14px solid;
    border-color: transparent #00c800 #00c800 transparent;
  }
  &::after {
    content: "\E608";
    font-family: element-icons !important;
    position: absolute;
    right: 0;
    bottom: -12px;
    color: #fff;
    font-size: 12px;
  }
}
</style>
