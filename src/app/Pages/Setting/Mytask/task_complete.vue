<template>
<div class="ukao-pt-md ukao-padder setting_mask_styl" v-loading="loading">
  <v-tab-nav v-bind:tab-nav-list="tabsNavList"
               v-bind:onClick="searchStatus">
    </v-tab-nav>
    <div class="setDeatil">
       <el-row :gutter="20">
        <el-col :lg="6" :md="8" :xs="12" :sm="8"  v-for="item in tableData" :key="item.id" v-show="type===1">
          <div class="grid-content" @click="onGOtask(item)" :class="{'bg-purple':item.grade===3,'bg-purple1':item.grade===2,'bg-purple2':item.grade===1}">
            <div>
              <el-rate v-model="item.grade" disabled :colors="['#619dda', '#F7BA2A', '#ec4040']" :low-threshold="1" :high-threshold="3" disabled-void-icon-class=""></el-rate>
            </div>
            <div class="box-text-btn">
              <div class="text-ft">{{item.name}}</div>
              <span class="box-gobtn">
                <el-button class="gobtn text-primary" size="small">去完成</el-button>
              </span>
            </div>
             <div class="box-text-btn">
              <div class="text-ft coin">奖励：<span style="margin-right:3px;"><label class="text-success">+</label><label class="text-success invite-success">{{item.giveCoin || 0}}</label></span>通洗币</div>
            </div>
          </div>
        </el-col>
         <el-col :lg="6" :md="8" :xs="12" :sm="8" v-for="item in tableDataYes" :key="item.id" v-show="type===2">
          <div class="grid-content"  :class="{'bg-purple':item.grade===3,'bg-purple1':item.grade===2,'bg-purple2':item.grade===1   }">
            <div class="erate-main">
              <el-rate v-model="item.grade" disabled :colors="['#619dda', '#F7BA2A', '#ec4040']" :low-threshold="1" :high-threshold="3" disabled-void-icon-class=""></el-rate>
              <span class="box-gobtn rightspan">
                <img src="/static/img/setting/checkicon.png"/>
                <span class="text-success">已完成</span>
              </span>
            </div>
            <div class="box-text-btn">
              <div class="text-ft">{{item.name}}</div>
              <span class="box-gobtn rightspan" v-if="item.award==0 && item.giveCoin>0"><el-button type="primary" size="small" @click="giveTaskAward(item)">领取奖励</el-button></span>
            </div>
             <div class="box-text-btn">
              <div class="text-ft coin">奖励：<span style="margin-right:3px;"><label class="text-success">+</label><label class="text-success invite-success">{{item.giveCoin || 0}}</label></span>通洗币</div>
              <span class="box-gobtn rightspan text-muted" v-if="item.award==1">已领取</span>
            </div>
          </div>
        </el-col>
      </el-row> 
      <div v-if="type===1 && tableData.length===0" class="no_task">暂无任务</div>
      <div v-if="type===2 && tableDataYes.length===0" class="no_task">暂无任务</div>
    </div>
</div>  
</template>
<script>
import vTabNav from "../../Common/tab_nav.vue";
import auth from '@/utils/auth.js'
import msg from '@/utils/msg'
export default {
  components: {
    vTabNav
  },
  data () {
    return {
      tabsNavList: [{ val: "1", text: "未完成" }, { val: "2", text: "已完成" }],
      tableData:[],
      tableDataYes:[],
      loading:"",
      type:1
    }
  },
  created () {
    this.getList();
  },
  methods: {
    giveTaskAward(item){
      this.$store.dispatch('post',{
        uri:'mercCoinBill/giveTaskAward',
        data:{
          taskRelId:item.id
        }
      }).then(res=>{
        msg.success();
        this.getList();
      })
    },
    searchStatus(item) {
      if(item.val==='2'){
        this.type=2
        this.$router.push({path:this.$route.path})
        this.getList();
        // this.$router.push({ path: "/setting/mytask/yes_complete" });
      }
      else if(item.val==='1'){
        this.type=1
         this.getList();
      }
    },
     getAuth(item){
      let _this=this;
      let obj=auth.getPermList();
      for(var i=0;i<item.length;i++){
        for(let j=0;j<=obj.length;j++){
          if(item[i].permission===obj[j]){
            _this.type===1 ? _this.tableData.push(item[i]): _this.tableDataYes.push(item[i]) 
          }
        }
      }
    },
    getList(){
      this.loading=true;
      this.tableData=[];
      this.tableDataYes=[];
      this.$store.dispatch('post',{
        uri:this.type===1 ? 'taskInfo/list': 'taskMercRel/list'
        // uri:'taskInfo/list'
      }).then(res=>{
         this.loading=false;
         if(res.data.data.list.length!==0){
           this.getAuth(res.data.data.list);
         }
      })
    },
    onGOtask(item){
       this.$router.push({path:'../..'+item.uri})
    },
  }
}
</script>
<style lang="less">
.setting_mask_styl{
  .el-rate__icon {
    font-size: 12px;
    margin-right: 6px;
    color: white;
    transition: .3s;
}
.color_red {
  color: #ff5151;
}

.bg-purple {
  background: #fff1f1;
  &:hover {
    background: #f2f2f2;
  }
}
.bg-purple1 {
  background: #fff9e8;
  &:hover {
    background: #f2f2f2;
  }
}
.bg-purple2 {
  background: #edf5ff;
  &:hover {
    background: #f2f2f2;
  }
}
.grid-content {
  border-radius: 4px;
  cursor: pointer;
  border-radius: 4px;
  margin: 10px 10px 10px 0px;
  // padding: 20px;
  padding: 15px 20px 20px 15px;
  
}
.erate-main{
   position: relative;
}
.box-text-btn{
  position: relative;
  width:100%;
  height:21px;
  margin-top: 15px;
  /* background-color: yellow; */
}
.box-gobtn{
  position: absolute;
  top: 0;
  right: 0;
}
.gobtn{
  border-radius: 41px;
  border: 1px solid #20a0ff;
  /* float: right; */
  background-color: rgba(0, 0, 0, 0);
  &:hover{
    background-color: #20a0ff;
    color: white;
  }
}
.rightspan{
  line-height:30px;
}
.rightspan>img{
  width: 18px;
  vertical-align:middle;
  margin-top: -2px;
  margin-right: 3px;
}
.text-ft{
  // display: block;
line-height: 30px;
font-size: 15px;
margin-left: -5px;
// max-width: px;
// background-color:green;
}
.no_task{
  width:120px;
  margin:200px auto;
  font-size:20px;
}
.el-rate__icon{
  font-size: 13px;
}
.el-button--small{
  border-radius: 20px;
  padding: 9px 7px;
}
.invite-success{
  font-size: 18px;
}
.coin{
  font-size: 13px;
}
}

</style>
