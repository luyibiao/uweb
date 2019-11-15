
<template>
	<div>
		<div v-for="item in vProjectItem">
			<p class="text-center project-item-top">
				<el-breadcrumb class="link-back" separator="/">
				  <el-breadcrumb-item to="fun"><i class="el-icon-arrow-left icon-smaller"></i>功能模块</el-breadcrumb-item>
				  <el-breadcrumb-item>{{item.title}}</el-breadcrumb-item>
				</el-breadcrumb>
				<span v-text="item.title"></span>
			</p>
			<table class="ukao-table b-t" style="width: 100%">
		  	<tbody>
		  		<tr>
		  			<td>是否启用</td>
		  			<td>
		  				<el-switch
							  v-model="item.value"
							  active-color="#13ce66"
							  inactive-color="#dcdcdc"
							  on-text="已启用"
							  off-text="未启用"
							  :width="74">
							</el-switch>
		  			</td>
		  			<td></td>
		  		</tr>
		  		<tr v-if="item.value">
		  			<td class="enabled" colspan="3">
		  				<div class="enabled-tip text-center text-white wrapper">
		  					<p class="title m-b-sm">未启用</p>
		  					<p>若要启用该功能，请在上方点击“启用按钮”启用</p>
		  				</div>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>显示序号</td>
		  			<td><span v-text="item.num"></span></td>
		  			<td class="w-sm"><el-button plain type="info" size="small">修改</el-button></td>
		  		</tr>
		  		<tr v-if="item.id==='1'">
		  			<td>模式</td>
		  			<td><p>{{item.mode}}</p></td>
		  			<td><el-button plain type="info" size="small">修改</el-button></td>
		  		</tr>
		  		<tr v-if="item.id==='1'">
		  			<td>产品</td>
		  			<td>6</td>
		  			<td>
		  				<router-link :to="item.index"><el-button plain type="info" size="small">查看</el-button></router-link>
		  			</td>
		  		</tr>
		  		<tr>
		  			<td>{{item.title}}</td>
		  			<td></td>
		  			<td><el-button size="small">查看</el-button></td>
		  		</tr>
		  	</tbody>
		  </table>
		  <div class="m-t text-muted">
		  	<p>说明：</p>
		  	<p>说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字</p>
		  </div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["vProjectItem", 'shownItem'],
		data: function() {
			return {
				itemList: [
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" },
          { src: "/static/img/cabinet/clothes.png", title: "洗衣" }
        ]
			}
		}
	}
</script>

<style scoped>
	.link-back {
		height: 30px;
		line-height: 30px;
	}
	.project-item-top {
		position: relative;
		line-height: 30px;
		margin-bottom: 15px;
	}
	.project-item-top .link-back {
		position: absolute;
		top: 0;
		left: 0;
	}
	.ukao-table tbody tr td.enabled {
  	padding-left: 0;
  	padding-right: 0;
  }
  .enabled-tip {
  	background-color: #f17a3f;
  	border: 1px solid #c8000d;
  }
  .enabled-tip .title {
  	font-size: 18px;
  }
</style>