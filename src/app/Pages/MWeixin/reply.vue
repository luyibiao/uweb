<template>
	<div>
		<div>
			<ul class="ukao-tabs-nav clearfix">
				<li class="ukao-tabs-item" v-for="(item, index) in tabsNavList" v-bind:class="{ 'is-active': active == index }" v-on:click="toggle(index, item.view)" v-text="item.text"></li>
			</ul>
			<div class="m-t">
				<component :is="currentView"></component>
			</div>
		</div>
		<div>
			<div class="u-el-tabs">
				<el-tabs type="border-card">
				  <el-tab-pane>
				    <span slot="label"><i class="el-icon-edit"></i> 文字</span>
				    <el-input type="textarea" class="u-textarea" resize="none"></el-input>
				  </el-tab-pane>
				  <el-tab-pane label="消息中心">
						<span slot="label"><i class="el-icon-picture"></i> 图片</span>
						<el-upload
						  class="u-avatar-uploader"
						  action="https://jsonplaceholder.typicode.com/posts/"
						  :show-file-list="false"
						  :on-success="handleAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="imageUrl" :src="imageUrl" class="u-avatar">
						  <i v-else class="el-icon-plus u-avatar-uploader-icon"></i>
						</el-upload>
				  </el-tab-pane>
				  <el-tab-pane label="角色管理">
				  	<span slot="label"><i class="el-icon-date"></i> 语音</span>
				  </el-tab-pane>
				  <el-tab-pane label="定时任务补偿">
				  	<span slot="label"><i class="el-icon-date"></i> 视频</span>
				  </el-tab-pane>
				</el-tabs>
			</div>
			<div class="m-t">
				<el-button type="primary">保存</el-button>
				<el-button>删除回复</el-button>
			</div>
		</div>
		<div class="m-t">
			<el-button type="primary">添加规则</el-button>
			<div class="m-t">
				<div class="ar-bg-gray wrapper-sm">新规则</div>
				<ul class="auto-reply-keywords b-a">
					<li>
						<div class="u-fm clearfix">
							<div class="fm-label"><span class="text-danger m-r-xs">*</span>规则名</div>
							<div class="fm-content">
								<el-input placeholder="请输入内容"></el-input>
								<p class="text-muted">规则名最多60个字</p>
							</div>
						</div>
					</li>
					<li>
						<el-row>
						  <el-col :span="16">
						  	<div><span class="text-danger m-r-xs">*</span>关键字</div>
						  </el-col>
						  <el-col :span="8">
							  <div class="text-right">
							  	<el-button type="text" class="no-padder">添加关键字</el-button>
						  	</div>
						  </el-col>
						</el-row>
					</li>
					<li>
						<el-row>
						  <el-col :span="16">
						  	<div><span class="m-l-sm">1</span></div>
						  </el-col>
						  <el-col :span="8">
							  <div class="text-right">
							  	<el-button type="text" class="no-padder">已全匹配</el-button>
							  	<i class="el-icon-edit text-muted m-r-sm m-l-sm"></i>
							  	<i class="el-icon-delete text-muted"></i>
						  	</div>
						  </el-col>
						</el-row>
					</li>
					<li>
						<el-row>
						  <el-col :span="16">
						  	<div><span class="text-danger m-r-xs">*</span>回复</div>
						  </el-col>
						  <el-col :span="8">
							  <div class="text-right">
							  	<el-checkbox v-model="checked">回复全部</el-checkbox>
						  	</div>
						  </el-col>
						</el-row>
					</li>
					<li>
						<div class="m-l-sm">
							<i class="el-icon-edit m-r-sm text-muted"></i>
							<i class="el-icon-picture m-r-sm text-muted"></i>
						</div>
					</li>
					<li>
						<el-row>
						  <el-col :span="16">
						  	<div><span class="m-l-sm">恭喜你获得一张优惠券，快去使用吧！</span></div>
						  </el-col>
						  <el-col :span="8">
							  <div class="text-right">
							  	<i class="el-icon-edit text-muted m-r-sm m-l-sm"></i>
							  	<i class="el-icon-delete text-muted"></i>
						  	</div>
						  </el-col>
						</el-row>
					</li>
				</ul>
				<div class="clearfix wrapper-sm ar-bg-gray">
					<div class="pull-right">
						<el-button type="primary">保存</el-button>
						<el-button>删除</el-button>
					</div>
					<p class="m-l-sm text-muted">文字(0)、图片(0)、语音(0)、视频(0)、图文(0)</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {
			firstChild: {
				template: '<div>1</div>' 
			},
			secondChild: {
				template: '<div>secondChild</div>'
			},
			thirdChild: {
				template: '<div>thirdChild</div>'
			}
		},
		data: function() {
			return {
				active: 0,
				currentView: 'firstChild',
				imageUrl: '',
				tabsNavList: [
					{ view: 'firstChild', text: '被添加自动回复' },
					{ view: 'secondChild', text: '消息自动回复' },
					{ view: 'thirdChild', text: '关键词自动回复' }
				],
				checked: ''
			}
		},
		methods: {
			toggle: function(i, v) {
				this.active = i;
				this.currentView = v;
			},
			handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
		}
	}
</script>

<style scoped>
	.auto-reply-keywords li {
		padding: 10px;
		overflow: hidden;
		border-bottom: 1px solid #dee5e7;
	}
	.auto-reply-keywords li:last-child {
		border-bottom: 0;
	}
	.u-fm {
		max-width: 400px;
	}
	.fm-label {
		float: left;
	}
	.fm-content {
		margin-left: 80px;
	}
	.ar-bg-gray {
		background: #f8f8f8;
	}
</style>

