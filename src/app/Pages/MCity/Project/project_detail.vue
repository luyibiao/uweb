<template>
	<div class="clearfix">
		<div class="sidebar pull-left">
			<v-project-model :cityId="cityInfo.id" :status="cityInfo.status"></v-project-model>
		</div>
		<div class="main">
			<div class="project-item m-l-lg">
			  <v-project-item v-on:projectModelStatus="getModelStatus" v-bind:id="mercBusiness.id"></v-project-item>
			</div>
		</div>
	</div>
</template>

<script>
	import vProjectItem from './project_item.vue'
	import vProjectModel from './project_model.vue'

	export default {
		components: {
			vProjectModel, vProjectItem
		},
		data: function() {
			return {
				cityInfo:{
					id: this.$route.params.cityId,
          status: ''
				},
				mercBusiness: {
					id: this.$route.params.id,
				},
			}
		},
		created () {
    },
		methods: {
      getModelStatus : function (data) {
        this.cityInfo.status = !this.cityInfo.status;
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