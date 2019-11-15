<style lang="less" scoped>
  .form-item {
    margin-bottom: 30px;
    .lab {
      margin-bottom: 20px;
      //float: left;
    }
    .inner {
      margin-left: 100px;
    }
    .editor {
      max-width: 800px;
    }
  }
</style>

<template>
  <div v-loading.body="loading"
       element-loading-text="正在保存协议">
    <div class="form-item" text-align="center" style="width: 500px;text-align: center;">
      <p class="lab" >首页背景图  <span style = "margin-left: 30px; color:rgba(165,165,165,1);">建议尺寸为750像素*450像素，大小不超过2M</span></p>
      <div class="form-item">
        <Uploader class="u-avatar-uploader"
                  tip=""
                  ref="upload"
                  :path="image"
                  :changeFn="changeImgPath"
                  :saveSuccessFn="saveSuccessFn"
                  :manual="true" />
      </div>
      <div class="form-item">去<span class="text-primary" ><router-link to="/setting/parameter/protocol">参数设置</router-link></span>填写《服务协议》</div>
      <div class="form-item">
        <el-button type="primary"
                   @click="saveUserProtocol">保存</el-button>
      </div>
    </div>

  </div>
</template>
<script>
  import Uploader from "@/components/Uploader";
  import consts from '@/utils/consts'
  import msg from '@/utils/msg'
  export default {
    props: {
      image: {
        default: "",
        type: [String]
      }
    },
    watch: {
      content(n) {
        this.text = n;
      },
      image(n) {
        this.imgPath = n;
      }
    },
    data() {
      return {
        loading: false, //保存协议loading
        // 编辑内容
        text: "",
        imgPath: ""
      };
    },
    created() {

    },
    methods: {
      // 提交用户协议
      postUserProtocol(imgPath) {
        this.$store
          .dispatch("post", {
            uri: "userProtocol/save",
            data: {
              imgPath,
            }
          })
          .then(res => {
            this.loading = false;
            msg.success("保存成功！");
          });
      },
      // 保存用户协议
      saveUserProtocol() {

        this.loading = true;
        if (this.imgPath) {
          this.$refs.upload.$children[0].submit(); //是则上传图片后保存
        } else {
          this.postUserProtocol(this.image);
        }
      },
      // 图片上传成功回调
      saveSuccessFn(data) {
        this.$emit("update:image", data.data.path);
        this.imgPath = "";
        this.postUserProtocol(data.data.path);
      },
      //更改图片
      changeImgPath(file) {
        this.imgPath = file.url;
        this.$emit("update:image", file.url);
      }
    },
    components: {
      Uploader
    }
  };
</script>
