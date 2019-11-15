<template>
<div>
  <p class="heas" v-if="enableData.length>0">已启用的功能</p>
  <div>
    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :xl="6" style="margin-top:20px" v-for="item in enableData" :key="item.id">
        <div class="public-content content">
          <div class="img">
            <img :src="`/static/img/setting/cash/${item.iconcls}.png`" width="60px">
            <p>{{item.name}}</p>
          </div>
          <div class="switch-btn">
            <el-switch
              v-model="item.flag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              @change="optionFlag(item)">
            </el-switch>
          </div>        
        </div>
      </el-col>
    </el-row>
  </div>

   <div v-if="disableData.length>0">
     <p class="heas1">未启用的功能</p>
     <el-row :gutter="20">
      <el-col :lg="6" :md="8" :xl="6" style="margin-top:20px" v-for="item in disableData" :key="item.id">
        <div class="aa">
          <div class="public-content content1">
            <div class="img">
              <img :src="`/static/img/setting/cash/${item.iconcls}.png`" width="60px">
              <p>{{item.name}}</p>
            </div>
            <div class="switch-btn">
              <el-switch
                v-model="item.flag"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开启"
                inactive-text="关闭"
                @change="optionFlag(item)">
              </el-switch>
            </div>        
          </div>
        </div>
      </el-col>
     </el-row>
   </div>
</div>  
</template>
<script>
import msg from "@/utils/msg";
export default {
  data () {
    return {
      value2:'',
      enableData:[],
      disableData:[],
    }
  },
  created () {
    this.getList();
  },
  methods: {
    optionFlag(item){
      this.$store.dispatch('post',{
        uri:item.flag ? 'wkPermission/cashRegister/enable' :'wkPermission/cashRegister/disable',
        data:{
          permissionId:item.id
        }
      }).then(res=>{
          msg.success();
          this.getList();
      })
    },
    getList(){
      this.$store.dispatch('post',{
        uri:'wkPermission/queryCashRegisterParam'
      }).then(res=>{
        let Arr=res.data.data;
        if(Arr.length>0){
          for(let i=0;i<Arr.length;i++){
            Arr[i].flag=Arr[i].flag>0 ? true :false;
          }
          this.enableData=Arr.filter(function(item){
            // console.log(item)
            return item.flag;
        })
          this.disableData=Arr.filter(function(item){
            return !item.flag;
          })
          console.log(this.disableData)
        }
        // console.log(this.enableData)s
      })
    }
  } 
}
</script>

<style scoped>
.heas{
  margin: 16px 0px -10px;
}
.heas1{
  margin: 30px 0px -10px;
}
.public-content{
  display: flex;
  width: 100%;
  /* padding: 5px; */
  box-sizing: border-box;
  /* background-color: red; */
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-sizing: border-box;
}
.content{
  background: #f8f8f8;
}
.content:hover{
  background: #f2f2f2;
}
.content1{
  background: #f2f2f2;
}
.aa{
  position: relative;
}
.content1::after{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.content1:hover::after{
  display: none;
}
.img{
  min-height: 62px;
  text-align: center;
}
</style>
