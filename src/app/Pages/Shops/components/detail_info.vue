<template>
  <div class="clearfix">
    <div class="pull-left">
      <div class="wx-bg b-a">
        <div class="wx-content">
          <div class="base text-muted text-center">
            <p class="text-md m-b">基本信息区</p>
            <p>固定样式、显示商品主图、价格等信息</p>
          </div>
          <QContent class="text"></QContent>
        </div>
      </div>
      <p class="m-t-md text-center">微信预览界面</p>
    </div>
    <div class="wx-main">
      <el-form label-width="100px"
               ref="form">
        <el-form-item label="商品详情">
          <div class="b-h">
            <Quill v-model="content"
                   ref="myEditor"
                   placeholder="请输入内容"></Quill>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Quill from "@/components/Quill";
import QContent from "@/components/Quill/content";
export default {
  props: {
    detail: ""
  },
  data() {
    return {
      content: ""
    };
  },
  watch: {
    detail(n) {
      if (n) {
        this.content = n;
      }
    }
  },
  methods: {
    getData() {
      return {
        detail: this.content
      };
    }
  },
  components: {
    Quill,
    QContent
  }
};
</script>

<style lang="less" scoped>
.wx-bg {
  width: 350px;
  height: 625px;
  position: relative;
  background: url("/static/img/weixin_public.png") no-repeat center center;
  background-size: 350px 625px;
  .wx-content {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    .base {
      padding: 40px 0;
      background-color: #d8d8d8;
    }
  }
}
.wx-main {
  margin-left: 380px;
  overflow: hidden;
}
.b-h {
  line-height: 1.5;
}
.text {
  background-color: #fff;
  height: 428px;
  overflow: auto;
}
.quill-editor {
  max-width: 800px;
}
</style>

