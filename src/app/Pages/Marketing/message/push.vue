<style lang="less" scoped>
.ft-size{
  font-size: 12px;
}
.message {
  background-color: #f2f7ff;
  border-radius: 8px;
  line-height: 24px;
  padding: 15px 20px;
}
.data {
  width: 20%;
  height: 62px;
  border-right: 1px solid #dee5e7;
  margin-right: -1px;
}
.data:last-of-type {
  line-height: 62px;
  border-right: none;
}

.color_blue {
  color: #1989fa;
}
.setDeatil > p {
  margin-top: 30px;
  margin-bottom: 20px;
}
.color_red {
  color: #ff5151;
}

.bg-purple {
  background: #f8f8f8;
  &:hover {
    background: #f2f2f2;
  }
}
.grid-content {
  border-radius: 4px;
  cursor: pointer;
  border-radius: 4px;
  margin: 10px;
  padding: 20px;
}
.grid-content > :first-child {
  font-size: 15px;
}
.grid-content .messageModal{
  position: relative;
  display: inline-block;
  width: 100%;
  margin-top: 10px;
  font-size: 2px
}
.grid-content .messageModal .wx{
  position: absolute;
  left:20px;
  top:-5px;
}
.grid-content .messageModal .short{
  position: absolute;
  right:30px;
   top:-5px;
}
.grid-content .messageModal img{
  width: 18px;
  vertical-align:middle;
  margin-right: 3px;
  margin-top:-2px;
}
</style>

<template>
  <div>
    <p class=" message m-b-md">
      消息推送功能可以让您通过短信给买家推送交易和物流相关的提醒消息,以提升买家的购物体验，获得更高的订单转化率和复购率。
    </p>
    <div>
      <p class="m-b-sm">
        <span class="text-dark text-md">今日实时</span>
        <span class="text-muted">（更新时间：{{ timestamp | getDate }} {{ timestamp | getTime }}）</span>
        <el-button type="text"
                   size="mini"
                   class="m-l-sm"
                   @click="refresh">刷新</el-button>
      </p>
      <ul class="clearfix b-t b-b padder-v w-full ft-size"
          v-loading="loading">
        <li class="pull-left text-center data">
          <p class="text-primary text-vl">{{detail.totalCnt || 0}}</p>
          <p>总发送条数</p>
        </li>
        <li class="pull-left text-center data">
          <p class="text-vl">{{detail.successCnt || 0}}</p>
          <p>成功到达量</p>
        </li>
        <li class="pull-left text-center data">
          <p class="text-vl">{{detail.chargingCnt || 0}}</p>
          <p>计费数量</p>
        </li>
        <li class="pull-left text-center data">
          <p class="text-primary text-vl" :class="{'text-danger':detail.availableCnt<0}">{{detail.availableCnt || 0}}</p>
          <p>剩余短信</p>
        </li>
        <li class="pull-left text-center data">
          <el-button type="primary"
                     @click="$router.push('/marketing/message/recharge')">购买短信</el-button>
        </li>
      </ul>
    </div>

    <!--提醒设置-->
    <div class="setDeatil">
      <p>
        <strong>消息提醒设置</strong>
      </p>
       <el-row :gutter="20">
        <el-col :lg="6" :md="6" v-for="item in pushList" :key="item.id">
          <div class="grid-content bg-purple" @click="onPushSet(item.id)">
            <p>
              <strong>{{item.name}}</strong>
            </p>
           <span class="messageModal text-muted">
             <span class="wx">
                <span v-if="getType(item.conf)[0]==='0'">
                  <img src="/static/img/marketing/unchecked.png"/>
                短信
             </span>
                <span v-else-if="getType(item.conf)[0]==='1'">
                  <img src="/static/img/marketing/checked.png"/>
                短信
                </span>
            </span> 
            <span class="short">
               <span  v-if="getType(item.conf)[1]==='1'">
             <img src="/static/img/marketing/checked.png" />微信模板消息
             </span>
            <span v-else-if="getType(item.conf)[1]==='0'">
             <img src="/static/img/marketing/unchecked.png" />微信模板消息
             </span>
           </span>
            </span>
          </div>
        </el-col>
      </el-row> 
     
    </div>
  </div>
</template>

<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      loading: true, //加载中
      detail: {},
      timestamp: 0,
      throttle: 0,
      pushList:[],
      modalVisible:''
    };
  },
  created() {
    this.getData();
    this.getPushList();
  },
  methods: {
    onPushSet(id){
     this.$router.push({path:'/marketing/message/detail/'+id},)
    },
    getPushList(){
      this.$store.dispatch('post',{
        uri:'pushMsgConf/list'
      }).then(res=>{
        this.pushList=res.data.data || [];
      });
    },
     getType(item) {
      return item ? item.split('') : "0";
    },
    getData() {
      //获取数据
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "sms/query/count"
        })
        .then(res => {
          this.detail = res.data.data;
          this.timestamp = res.data.timestamp;
          this.loading = false;
        });
    },
    refresh() {
      let d = new Date().getTime();
      if (d - this.throttle < 1000) {
        msg.warning("操作过于频繁", 1000);
      } else {
        this.throttle = d;
        this.getData();
      }
    }
  }
};
</script>

