<template>
<div>
  <div class="text-right">
    <el-button type="primary">添加</el-button>
    <el-button>同步更新</el-button>
  </div>
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
        <el-breadcrumb class="link-back" separator="/">
          <el-breadcrumb-item to="fun"><i class="el-icon-arrow-left icon-smaller"></i>功能模块</el-breadcrumb-item>
          <el-breadcrumb-item to="project">洗衣</el-breadcrumb-item>
          <el-breadcrumb-item>服务产品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <p class="text-muted m-t">最多可添加12个产品，已添加9个。</p>
      <el-table class="ukao-el-table m-t"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="图标">
          <template slot-scope="scope">
            <img class="thumb m-r-sm" :src="scope.row.src.img1" alt="">
            <img class="thumb" :src="scope.row.src.img2" alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="价格">
          <template slot-scope="scope">
            <div>{{ scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="序号">
          <template slot-scope="scope">
            <a class="text-primary">{{ scope.row.num }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.state === '1'">已同步</div>
            <div v-if="scope.row.state === '2'" class="text-muted">未同步</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span class="m-r-sm"><el-button type="primary" size="small">编辑</el-button></span>
            <span><el-button type="danger" size="small">删除</el-button></span>
          </template>
        </el-table-column>
      </el-table>
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
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" }
        ],
        tableData: [
          {
            src: {
              img1: '/static/img/cabinet/clothes.png',
              img2: '/static/img/cabinet/clothes.png'
            },
            name: '西服',
            price: '￥38.80',
            num: '1',
            state: '1',
          },
          {
            src: {
              img1: '/static/img/cabinet/clothes.png',
              img2: '/static/img/cabinet/clothes.png'
            },
            name: '裙装',
            price: '￥38.80',
            num: '2',
            state: '2',
          }
        ]
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