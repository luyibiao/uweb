<template>
<div>
  <p class="m-t m-b text-black text-md font-bold">零散充值设置</p>
  <div class="b-t b-b">
    <div class="pull-left" style="margin-top:7px;">零散金额充值
      <div class="text-muted text-xs">关闭后，所有客户将不能在微信，收银机上进行零散充值</div>
    </div>
  <div class="text-center padder-v">
    <auth perm="setting.parameter.recharge">
      <el-switch
        v-model="otherRecharge"
        active-color="#13ce66" inactive-color="#ff4949"
        active-text="允许" inactive-text="不允许"
        @change="setStatus">
      </el-switch>
      <template slot="noPerm">
        <el-switch
          v-model="otherRecharge"
          active-color="#13ce66" inactive-color="#ff4949"
          active-text="允许" inactive-text="不允许" disabled>
        </el-switch>
      </template>
    </auth>
  </div>
  </div>
</div>  
</template>
<script>
import msg from "@/utils/msg";
export default {
  data () {
    return {
      id:'',
      otherRecharge:'',
    }
  },
  created () {
    this.getCityParam();
  },
  methods: {
     getCityParam() {
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.id=res.data.data.id;
          this.otherRecharge=res.data.data.otherRecharge===1 ? true:false;
        });
    },
    setStatus(){
      let otherRecharge=this.otherRecharge===true ? 1:0;
     this.$store.dispatch('post',{
       uri:'mercCityParam/update',
       data:{
         id:this.id,
         otherRecharge:otherRecharge,
       }
     }).then(res=>{
         msg.success();
       })
    }
  }
}
</script>

