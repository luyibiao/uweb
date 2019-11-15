<style>
@media only screen and (min-width: 0px) and (max-width: 640px) {
  .ukao-img{
    width: 0px;
    display: none;
  }
  .box{
    width: 92%;
  }
  .box-content{
   width:100%;
  }
}
@media only screen and (min-width: 640px) and (max-width: 1024px) {
  .ukao-img{
    width: 800px;
    margin-left: -400px;
  }
  .box{
    width: 800px;
  }
   .box-content{
   width:  724px;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1366px) {
  .ukao-img{
    width: 950px;
    margin-left: -475px
  }
  .box{
    width: 950px;
  }
  .box-content{
   width:  828px;
  }
}
@media only screen and (min-width: 1366px) and (max-width: 1600px) {
  .ukao-img{
    width: 1200px;
    margin-left: -600px;
  }
  .box{
    width: 1200px;
  }
  .box-content{
   width:  1074px;
  }
}
@media only screen and (min-width: 1600px) and (max-width: 1920px) {
  .ukao-img{
    width: 1400px;
    margin-left: -700px;
  }
  .box{
    width: 1400px;
  }
  .box-content{
    width: 1274px;
  }
}
@media screen and (min-width: 1920px){  
  .ukao-img{
    width: 1600px;
    margin-left: -800px;
  }
  .box{
    width: 1600px;
  }
  .box-content{
    width: 1474px;
  }
}  
 
.box{
    position: relative;
    margin: 60px auto 0px;
    z-index: 100;
}
.box-content-content{
  margin: 10px 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.box-content-content .subtitle{
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 16px;
}
.box-content-content-main{
  margin-bottom: 20px;
}
.box-content-content-main img{
  max-width: 98%;
  max-height: 98%;
}
.box-content-fotter{
  font-size: 17px;
  margin-bottom: 90px;
}
.ukao-img{
  position: fixed;
  top: 0;
  left: 50%;
  height: 200px;
  z-index: 0;
}
.ukao-code-parent{
  position: relative;
  width: 100%;
  height: 200px;
}
.ukao-code{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 104px;
    padding: 10px;
    border: 1px solid #e5e5e5;
}
.ukao-code img{
  width: 102px;
  height: 102px;
}
.ukao-code .ukao-img-content{
  display: block;
  margin-top: 10px;
  text-align: center;
}
</style>

<template>
<div>
  <div class="box">
    <div class="box-content">
      <div class="box-contnet-title">
        <h2 v-html="contentF.title"></h2>
      </div>
      <div class="box-content-content">
        <div class="subtitle text-muted">
          {{contentF.releaseTime}} <a href=" https://www.twash.cn/" class="text-primary" target="_blank">通洗</a>
        </div>
        <div class="box-content-content-main" v-html="contentF.content">
        </div>
      </div>
      <div class="box-content-fotter pull-right">
        <p class="text-muted">通洗团队</p>
      </div>
    </div>
  </div> 
  <div class="ukao-img">
    <div class="ukao-code-parent">
      <div class="ukao-code">
      <img src="/static/img/stac/weixin.jpg">
        <span class="ukao-img-content">
          <p>微信扫一扫</p>
          <p>关注【通洗】</p>
        </span>
    </div>
    </div>
  </div>
</div>  
</template>
<script>
import time from "@/utils/helpers/timeLite";
export default {
  data () {
    return {
      id:this.$route.query.id,
      contentF:{
        title:'',
        releaseTime:'',
        content:''
      }
    }
  },
  created () {
    this.getDetail();
  },
  methods:{
     getDetail(){
    this.$store.dispatch('post',{
      uri:'notice/detail',
      data:{
        id:this.id
      }
    }).then(res=>{
      let item=res.data.data;
      this.contentF.title=item.title;
      this.contentF.content=item.content;
      this.contentF.releaseTime=time.getDate(item.releaseTime)
    })
  }
  }
 
}
</script>
