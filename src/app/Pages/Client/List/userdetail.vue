<template>
  <div>
    <div class="client-box clearfix v-middle m-t-lg">
      <img class="img pull-left"
           :src="dataInfo.info.headimgPath || '/static/img/user/def.png'"
           alt="">
      <div class="v-middle content">
        <p>
          <img
            style="vertical-align: middle;width: 14px"
            :src="dataInfo.info.grade == 1 ? '/static/img/user/crown_blue.png' :
												 dataInfo.info.grade == 2 ? '/static/img/user/crown_yellow.png' :
												  dataInfo.info.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
            alt=""/>
          <span class="text-black m-r-xl">{{dataInfo.info.name}}</span>
          <auth perm="client.list.all.update">
            <a class="text-primary"
               @click="showDialog">修改</a>
          </auth>
        </p>
        <p class="text-muted">
          <span>微信呢称：</span>
          <span>{{dataInfo.info.wxNickname}}</span>
        </p>
        <p>
          <span class="icon-svg icon-svg-weixin" v-if="dataInfo.info.subscribe == 1"></span>
          <span class="icon-svg icon-svg-wx-bind" v-if="dataInfo.info.wxId!=-1"></span>
          <span class="icon-svg icon-svg-wx-run" v-if="dataInfo.info.subscribe == -1"></span>
          <span class="icon-svg icon-svg-mobile2" v-if="dataInfo.info.phone && dataInfo.info.verifyPhone != 1"></span>
          <span class="icon-svg icon-svg-android" v-if="dataInfo.info.verifyAndriod == 1"></span>
          <span class="icon-svg icon-svg-iphone" v-if="dataInfo.info.verifyIos == 1"></span>
          <span class="icon-svg icon-svg-mobile1" v-if="dataInfo.info.verifyPhone == 1"></span>
          <span class="icon-svg icon-svg-wxApp" v-if="dataInfo.info.wxAppId != -1"></span>
          <a class="text-primary" v-if="dataInfo.info.wxId != -1" @click="unBindWx">解绑微信</a>
          <a class="text-primary" v-if="dataInfo.info.wxAppId != -1" @click="unBindWxAppId">解绑小程序</a>
        </p>
      </div>
    </div>
    <el-dialog class="ukao-dialog"
               title="修改名字"
               :visible.sync="visible"
               size="small">
      <el-form :model="formData"
               ref="editForm"
               label-width="120px">
              <el-form-item label="姓名" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                <el-input v-model="formData.name" :maxlength="32" style="max-width:300px;"></el-input>
              </el-form-item>
              <el-form-item>
            <el-button @click="visible=false">取消</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import msg from '@/utils/msg'
import storagelite from '@/utils/helpers/storageLite'
export default {
  props: ["id","currentKey","obj"],
  data() {
    return {
      formData: {
        name: ""
      },
      dataInfo: {
        info: {
          wxId:-1,
          wxAppId:-1
        },
        ext: {},
        card: {
          info: {}
        },
        group: {}
      },
      visible: false,
      formData: {
        name: ""
      }
    };
  },
  created() {
    this.detail();
  },
  methods: {
     submitForm(){
        let _this = this;
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            let formData = {...this.formData};
            this.$store.dispatch('post', {
              uri: 'userInfo/update',
              data: {...formData,id:this.id}
            }).then((res)=>{
              _this.visible = false;
              msg.success();
              this.detail();
            })
          }
        });
      },
    detail() {
      // console.log(JSON.stringify(this.praentData),'nnnn')
      if (!this.id) {
        msg.error("无效的id");
        return;
      }
       if(this.currentKey!=='1'){
         this.dataInfo.info= storagelite.sessionGet("USERDETAIL");
         return;
       }
      this.$store
        .dispatch("post", {
          uri: "userInfo/detail",
          data: { id: this.id }
        })
        .then(res => {
          this.dataInfo = res.data.data;   
          storagelite.sessionSet("USERDETAIL",this.dataInfo.info)      
        });
    },
    unBindWx() {
      let _this=this
      msg.confirm({
        msg: "解绑后用户需在微信端重新验证手机, 是否继续?",
        confirmFn: _ => {
          _this.$store
            .dispatch("post", {
              uri: "userInfo/unBindWx",
              data: { id: this.id }
            })
            .then(res => {
              msg.success();
              _this.dataInfo.info.wxId = -1;
            });
        }
      });
    },
    unBindWxAppId(){
      msg.confirm({
        msg:'解绑后用户需在小程序端重新验证手机, 是否继续?',
        confirmFn:_=>{
          this.$store.dispatch('post',{
            uri:'userInfo/unBindWxAppId',
            data:{id:this.dataInfo.info.id}
          }).then(res=>{
            msg.success();
            this.dataInfo.info.wxAppId = -1;
          })
        }
      });
    },
    showDialog() {
      this.visible=true;
      this.formData.name=this.dataInfo.info.name
    }
  }
};
</script>
<style>
.client-box .img {
		width: 100px;
		height: auto;
		border-radius: 6px;
	}
	.client-box .content {
		margin-left: 110px;
	}
</style>


