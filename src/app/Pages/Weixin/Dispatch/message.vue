<template>
<div class="m-t-xl">
  <div class="clearfix m-b-sm">
    <p class="message m-b-md">
       不提供服务的区域（取送区域未画的范围），客户在微信公众号下单时会提示以下您编辑的文案
    </p>
  </div>
  <div class="form-item">
    <div class="inner">
      <Quill class="m-b-md editor" v-model="text"></Quill>
      <div>
        <auth perm="weixin.dispatch.message.update">
          <el-button type="primary" @click="onSave" size="small" :loading="loading">保存</el-button>
        </auth>
      </div>
    </div>
  </div>
</div>  
</template>
<script>
import Quill from "@/components/Quill";
import msg from "@/utils/msg";
export default {
  components: {
    Quill
  },
  data () {
    return {
      loading:false,
      text:''  
    }
  },
  created() {
      this.getUserProtocol();
    },
  methods: {
    onSave(){
      this.loading=true
      this.$store.dispatch('post',{
        uri:'regionAssignTip/save',
        data:{
         text: this.text
        }
      }).then(res=>{
        msg.success();
        this.loading=false
      })
    },
    getUserProtocol() {
        return this.$store
          .dispatch("get", {
            uri: "regionAssignTip/detail"
          })
          .then(res => {
            this.text = res.data.data.text || '';
          });
      }
  }
}
</script>

<style lang="less" scoped>
.message {
  background-color: #f2f7ff;
  border-radius: 8px;
  line-height: 24px;
  padding: 15px 20px;
  max-width: 760px;
}
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

