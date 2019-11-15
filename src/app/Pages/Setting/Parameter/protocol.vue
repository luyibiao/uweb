<style lang="less" scoped>
  .form-item {
    margin-bottom: 30px;
    .lab {
      width: 100px;
      float: left;
    }
    .inner {
      margin-left: 0px;
    }
    .editor {
      max-width: 800px;
    }
  }
  .text-md {
    font-size: 21px;
  }
  .font-bold {
    font-weight: 700;
  }
</style>

<template>
  <div v-loading.body="loading"
       element-loading-text="正在保存协议">
    <div class="form-item">
    </div>
    <div class="clearfix m-b-sm">
      <p class="pull-left text-black text-md font-bold" style="line-height:36px;">服务协议设置</p>
    </div>
    <div class="form-item">
      <div class="inner">
        <Quill class="m-b-md editor"
               v-model="text"></Quill>
        <auth perm="setting.parameter.protocol">
          <el-button type="primary"
                   @click="postUserProtocol">保存</el-button>
        </auth>
      </div>
    </div>
  </div>
</template>
<script>
  import Quill from "@/components/Quill";
  import msg from "@/utils/msg";
  export default {
    data() {
      return {
        loading: false, //保存协议loading
        // 编辑内容
        text: "",
      };
    },
    created() {
      this.getUserProtocol();
    },
    methods: {
      // 提交用户协议
      postUserProtocol() {
        this.$store
          .dispatch("post", {
            uri: "userProtocol/save",
            data: {
              text: this.text
            }
          })
          .then(res => {
            this.loading = false;
            msg.success("保存成功！");
          });
      },
      getUserProtocol() {
        return this.$store
          .dispatch("get", {
            uri: "userProtocol/detail"
          })
          .then(res => {
            this.text = res.data.data.text || '';
          });
      }

    },
    components: {
      Quill
    }
  };
</script>
