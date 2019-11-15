微信首页经营项目

<style lang="less" scoped>
.business-box {
  margin: 0 -1px -1px 0;
  background-color: #fff;
}
.bg-body{
  background-color: #efeff4;

}
.business-item {
  background-color: #fff;
  margin: 0 1px 1px 0;
}
.business-logo {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
}
.business-text{
  padding: 0 8px;
}
.business-name,
.business-tips {
  overflow: hidden;
}
.business-name {
  height: 20px;
  line-height: 20px;
}
.business-tips {
  height: 18px;
  line-height: 18px;
  font-size: 12px;
}
.business-right {
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 20px;
  color: #bdbdbd;
  margin-top: -10px;
}
.type1,
.type2 {
  width: 100%;
  overflow: hidden;
}
.type1 {
  .business-item {
    padding: 8px 0;
  }
  .business-text {
    text-align: center;
  }
}
.type2 {
  .business-item {
    position: relative;
    padding: 8px 10px;
  }
  .business-logo {
    float: left;
  }
  .business-text {
    margin-left: 70px;
    padding-right: 15px;
  }
}
</style>

<template>
  <div :class="type == 1 ? 'type1' : 'type2'">
    <el-row class="business-box">
      <el-col :span="type == 1 ? 8: 24"
              v-for="item in list"
              :key="item.id"
              class="bg-body">
        <div class="business-item clearfix">
          <img class="business-logo"
               :src="item.imgPath">
          <div class="business-text">
            <p class="business-name">{{item.showName ? item.name : ""}}</p>
            <p class="business-tips text-muted">{{item.showSubtitle ? item.subtitle : ""}}</p>
          </div>
          <i v-if="type == 2"
             class="business-right el-icon-arrow-right"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    // 经营项目列表
    list: {
      default: _ => [],
      type: Array
    },
    type: {
      default: 1,
      type: [String, Number]
    }
  }
};
</script>