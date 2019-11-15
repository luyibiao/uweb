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
      <div>
        <p>已启用的项目</p>
        <ul class="sc-item-list clearfix m-t">
          <li v-for="item in itemScList">
            <div class="list-item text-center b-a b-success">
              <img class="thumb-lg" :src="item.src" alt="">
              <p class="lh24">{{item.title}}</p>
              <p class="text-success text-md">已启用</p>
              <p class="lh24 text-xs">序号{{item.num}}</p>
              <!-- <a class="link text-primary" @click="checkItem(item)">查看<i class="el-icon-arrow-right icon-smaller"></i></a> -->
            </div>
          </li>
        </ul>
      </div>
      <div class="m-t">
        <p>未启用的项目</p>
        <ul class="sc-item-list disabled-list clearfix m-t">
          <li v-for="item in itemScList">
            <div class="list-item text-center b-a">
              <img class="thumb-lg" :src="item.src" alt="">
              <p class="lh24">{{item.title}}</p>
              <p class="text-success text-lg">已启用</p>
              <p class="lh24 text-xs">序号{{item.num}}</p>
              <a class="link text-primary"><router-link to="project">查看<i class="el-icon-arrow-right icon-smaller"></i></router-link></a>
            </div>
          </li>
        </ul>
      </div>
  	</div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        itemList: [
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" }
        ],
        itemScList: [
          { src: '/static/img/cabinet/clothes.png', num: '1', title: '洗衣', id: '1' },
          { src: '/static/img/cabinet/clothes.png', num: '1', title: '洗鞋', id: '2' },
          { src: '/static/img/cabinet/clothes.png', num: '1', title: '充值', id: '3' },
          { src: '/static/img/cabinet/clothes.png', num: '1', title: '价目表', id: '4' }
        ]
      }
    },
    // methods: {
    //   checkItem: function(i) {
    //     this.$router.push('project' + '?' + i.id );
    //     this.$emit("scItemId", i.id || '');
    //   }
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
  .sc-item-list li {
    float: left;
    margin-right: 40px;
    margin-bottom: 30px;
  }
  .sc-item-list .list-item {
    box-sizing: border-box;
    width: 180px;
    padding: 15px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
  }
  .sc-item-list .list-item .link {
    position: absolute;
    bottom: 5px;
    right: 10px;
  }
  .lh24 {
    line-height: 24px;
  }
  .sc-item-list.disabled-list .list-item:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  .sc-item-list.disabled-list .list-item:hover:after {
    display: none;
  }
</style>