<template>
  <div class="ukao-sc-layout m-t clearfix">
  	<div class="sidebar text-opacity">
  		<img class="sidebar-bg" src="/static/img/cabinet/sc_bg001.png" alt="">
  		<p class="text-center m-t-sm text-black">智能柜界面预览</p>
  		<div class="content">
  			<p>桐叶粑粑科技 （湖南） 有限公司</p>
  			<div class="body text-center">
  				<p class="text-center text-xl m-b-xl">湘腾城市广场自助洗衣柜</p>
          <el-row :gutter="gutterSpace">
            <el-col :span="spanSpace" v-for="item in itemList" :key="item.id">
              <div class="item">
                <img class="w-full r-3x" :src="item.src" alt="">
                <div class="title">{{item.title}}</div>
              </div>
            </el-col>
          </el-row>
  			</div>
  			<div class="foot m-t-xl text-center">
  				<p class="text-xs">服务热线： 400-995-9500</p>
  				<div class="get-btn m-t">取件</div>
  			</div>
  		</div>
  	</div>
  	<div class="mainbar">
      <div>
        <p class="ukao-tb-title text-center b-b text-black">智柜界面</p>
    		<table class="ukao-table w-full">
          <tbody>
            <tr>
              <td style="width: 20%">智柜名称</td>
              <td>湘腾城市广场自助洗衣柜</td>
              <td class="w-xs"><el-button>修改</el-button></td>
            </tr>
            <tr>
              <td>主页标题</td>
              <td>桐叶粑粑科技（湖南）有限公司</td>
              <td><el-button>修改</el-button></td>
            </tr>
            <tr>
              <td>服务热线</td>
              <td>400-995-9500</td>
              <td><el-button>修改</el-button></td>
            </tr>
          </tbody>  
        </table>
      </div>
      <div class="m-t-xl">
        <p class="ukao-tb-title b-b">主界面背景</p>
        <table class="ukao-table w-full">
          <tbody>
            <tr class="v-top">
              <td style="width: 20%">自定义</td>
              <td>
                <div class="bg-item dis-inline is-active">
                  <img class="thumb-lg v-top" :src="selectedBg" alt="">
                  <span class="ukao-icon-success"></span>
                </div>
              </td>
              <td class="w-xs">
              <!-- 注意：此图片上传仅仅作为功能展示，实际上传不以此为准。 -->
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="handleChange">
                  <el-button>上传</el-button>
                </el-upload>
              </td>
            </tr>
            <tr class="v-top">
              <td style="width: 20%">系统图片</td>
              <td>
                <ul class="bg-list clearfix">
                  <li v-for="item in bgList" :key="item.id" @click="chooseBg(item)">
                    <div class="bg-item" :class="{ 'is-active': item.isActive }">
                      <img class="thumb-lg v-top" :src="item.src" alt="">
                      <span class="ukao-icon-success"></span>
                    </div>
                  </li>
                </ul>
              </td>
              <td></td>
            </tr>
          </tbody>  
        </table>
      </div>
  	</div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        selectedBg: "/static/img/cabinet/clothes.png",
        itemList: [
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" }
        ],
        bgList: [
          { src: "/static/img/cabinet/clothes.png", isActive: true },
          { src: "/static/img/cabinet/sc_bg001.png", isActive: false },
          { src: "/static/img/cabinet/sc_bg001.png", isActive: false }
        ]
      }
    },
    methods: {
      chooseBg: function(i) {
        var _this = this;
        this.bgList.forEach(function(item) {
          if( item !== i ) {
            item.isActive = false;
          }else{
            i.isActive = true;
            _this.selectedBg = i.src || "/static/img/cabinet/clothes.png";
          }  
        })
      },
      handleChange(file, fileList) {
        console.log(file)
        console.log(fileList)
      }
    },
    computed: {
      spanSpace: function() {
        return this.itemList.length > 4 ? 8 : 12;
      },
      gutterSpace: function() {
        return this.itemList.length > 4 ? 16 : 40;
      }
    }
  }
</script>

<style>
	.content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
    bottom: 0;
		margin: 10px;
	}
  .content .body {
    position: absolute;
    top: 50%;
    left: 30px;
    right: 30px;
    transform: translateY(-65%);
  }
  .content .foot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
  }
  .text-opacity {
    color: rgba(255,255,255,.8);
  }
  .item {
    position: relative;
    margin-bottom: 15px;
  }
  .item .title {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
  }
  .get-btn {
    display: inline-block;
    background: #248e16;
    background: -webkit-linear-gradient(#3fdf2c, #248e16); 
    background: -o-linear-gradient(#3fdf2c, #248e16); 
    background: -moz-linear-gradient(#3fdf2c, #248e16); 
    background: linear-gradient(#3fdf2c, #248e16); 
    padding: 20px 10px;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
  }

  .bg-list li {
    float: left;
    margin-right: 30px;
    margin-bottom: 15px;
  }
  .bg-item {
    position: relative;
    padding: 8px;
  }
  .bg-item.is-active .ukao-icon-success {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background: #36c924;
    border-radius: 50%;
  }
  .bg-item.is-active .ukao-icon-success:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    border: 2px solid #fff;
    box-sizing: content-box;
    border-left: 0;
    border-top: 0;
    height: 8px;
    width: 4px;
    transform: rotate(45deg);
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    transform-origin: center;
  }
</style>