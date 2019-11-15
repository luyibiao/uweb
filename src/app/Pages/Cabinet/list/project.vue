<template>
  <div class="ukao-sc-layout clearfix">
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
			<v-project-item v-bind:v-project-item="enabledItems" v-bind:shown-item="itemId"></v-project-item>
		</div>
	</div>
</template>

<script>
	import vProjectItem from './project_item.vue'
	export default {
		components: {
			vProjectItem
		},
		data: function() {
			return {
				itemId: "",
				itemList: [
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" }
        ],
				enabledItems: [
          {
            id: '1', img: "/static/img/weixin/bag.png", title: "洗衣", mode: "9",num: "2", value: true, index: 'product',
          },
          {
            id: '2', img: "/static/img/weixin/bag.png", title: "洗鞋", mode: "9",num: "2", value: true, index: 'product',
          },
          {
            id: '3', img: "/static/img/weixin/bag.png", title: "充值", mode: "9",num: "2", value: true, index: 'product',
          },
          {
            id: '4', img: "/static/img/weixin/bag.png", title: "价目表", mode: "9",num: "2", value: true, index: 'product',
          }
				]
			}
		},
    // mounted: function() {
    //   var _this = this;
    //   this.$on('scItemId', function(val) {
    //     _this.itemId = val
    //     console.log('val is:' + val)
    //     console.log('itemId is:'+ _this.itemId )
    //   })
    // },
    // beforeDestory: function() {
    //   this.$off('scItemId');
    // },
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

<style scoped>
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
</style>