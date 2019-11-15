<template>
	<div v-loading="loading">
		<div class="wap-bg b-a">
			<div class="wap-content">
				<div class="head">
					<p class="top-text">{{mercInfo.name}}</p>
					<div class="main-text bg-white clearfix">
						<span class="dis-inline m-l-sm">
							<span>{{cityInfo.name}}</span>
							<i class="el-icon-caret-bottom text-smaller icon-smaller"></i>
						</span>
						<p class="title">{{mercInfo.name}}</p>
						<span class="pull-right m-r-sm">联系我们</span>
					</div>
				</div>
				<div class="body">
					<!-- 轮播图-->
					<div v-loading="carouselLoading" v-show="cityInfo.isClientAdveVal">
						<el-carousel trigger="click" height="142px">
							<el-carousel-item v-for="item in carouselItems" :key="item.id">
								<img class="carousel-img" v-bind:src="item.img" alt="">
							</el-carousel-item>
						</el-carousel>
					</div>

					<div class="padder m-t-sm project-item-container">
						<el-row :gutter="12">
							<el-col class="m-b-xs" :span="8" v-for="item in enabledItems"  :key="item.id">
								<div class="project-container">
									<img class="project-img" v-bind:src="item.imgPath" v-bind:alt="item.name">
									<div class="content">
										<p v-text="item.name" v-show="item.showName"></p>
										<p class="text-muted text-xs m-t-xs"><span v-show="item.showSubtitle" v-text="item.subtitle"></span></p>
									</div>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="foot text-center">
					<div class="sc">附近的智能洗衣柜</div>
				</div>
			</div>
		</div>
</div>
</template>

<script>
	import auth from '@/utils/auth'
	import msg from '@/utils/msg'

	export default {
		props: ["cityId", "status"],
		data: function() {
			return {
				carouselLoading: true,
				loading: true,
				projectModelStatus: true,
				cityInfo:{
					id: '',
					name: '',
					isClientAdveVal: true
				},
				mercInfo: {
					name: ''
				},
				enabledItems: [],	//已启用的项目
				carouselItems: []	//滑块
			}
		},
		created () {
			this.init()
    },
		watch : {		//监听选择改变
      'cityId': function (val) {
        this.cityInfo.id = val;
        this.init();
      },
      'status': function (val) {
        this.projectModelStatus = val;
        this.init();
      }
		},
		mounted(){
//			var _this = this;
//			this.$on('projectModelStatus',function(val){
//				_this.projectModelStatus = val;//接值
//				_this.init()
//			})
		},
		methods: {
		  init (){
				var _this = this
			  if(_this.cityId) {
					_this.cityInfo.id = _this.cityId
					_this.mercInfo = auth.getMercInfo()
					_this.initCity(function () {
						_this.queryClientAdve()
						_this.businessList()
						_this.setBackToTitle(_this.cityInfo.name)
	        })

	      }else{
			    //msg.error()
				}
			},
			initCity (fn){
				this.$store.dispatch('post', {
					uri : 'mercCity/detail',
					data: {
						id: this.cityInfo.id
					}
				}).then((res) =>{
				  this.cityInfo = res.data.data
					this.cityInfo.isClientAdveVal = this.cityInfo.isClientAdve ? true : false
				  if(typeof (fn) === 'function'){
						fn()
					}
        })
			},
			setBackToTitle (title){
				this.$emit("backToTitle", title || '')
			},
			businessList (){
				this.$store.dispatch('post', {
					uri : 'mercBusiness/list',
					data: {
						cityId: this.cityInfo.id
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					this.screenList (list)
					this.loading = false
        })
			},
			queryClientAdve (){				//轮播图
				this.$store.dispatch('post', {
					uri : 'clientAdve/list',
					data: {
						cityId: this.cityInfo.id
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					this.carouselItems = list
					this.carouselLoading = false
        })
			},
			screenList (list){			//数据拆分
				var _this = this
				if(list){
					var enabledList = [], disabledList = []
					list.forEach(function (item) {
						if(item.status == 1){
							enabledList.push(item)
						}else if(item.status == 0){
							disabledList.push(item)
						}
					})
					_this.enabledItems = enabledList
				}
			}
		}
	}
</script>

<style scoped>
	.sidebar {
		width: 400px;
	}
	.wap-bg {
		width: 350px;
		height: 625px;
		position: relative;
		background: url('/static/img/weixin/wap_bg.png') no-repeat center center;
		background-size: 350px 625px;
	}
	.main {
		margin-left: 440px;
		height: 400px;
	}
	.wap-bg .wap-content {
		position: absolute;
		top: 18px;
		left: 0;
		right: 0;
	}
	.head .top-text {
		line-height: 42px;
		text-align: center;
		font-size: 16px;
		color: rgba(255,255,255,.8);
	}
	.head .main-text {
		line-height: 36px;
		position: relative;
	}
	.head .main-text .text-smaller {
		font-size: 12px;
	}
	.main-text .title {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.project-item-container {
		height: 292px;
		overflow: hidden;
	}
	.el-carousel__item .carousel-img {
		display: block;
    width: 100%;
    height: auto;
    margin: 0;
  }
	.project-container {
		position: relative;
	}
  .project-container .project-img {
  	width: 100%;
  	height: auto;
  }
  .project-container .content {
  	position: absolute;
  	bottom: 5px;
  	left: 0;
  	right: 0;
  	text-align: center;
  }
  .foot .sc {
  	display: inline-block;
  	background-color: #36c924;
  	padding: 5px 20px;
  	border-radius: 20px;
  	color: #fff;
  	font-size: 14px;
  }

</style>