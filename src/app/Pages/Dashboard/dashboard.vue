<template>
	<div class="dash">
		<!--<div class="ds-basics m-b-md">-->
			<!--<div class="clearfix" style="display:inline-block">-->
				<!--<div class="ds-logo pull-left">-->
					<!--<img :src="mercInfo.logoPath||'/static/img/logo.png'" />-->
				<!--</div>-->
				<!--<div class="ds-mc">-->
					<!--<div class="ds-mc-im">-->
						<!--<div class="ds-mc-tm">-->
							<!--<span class="name">{{mercInfo.name}}</span>-->
							<!--&lt;!&ndash;<span class="aut" v-if="mercParam.isAuth">已认证</span>-->
							<!--<span class="n-aut" v-else>未认证</span>&ndash;&gt;-->
						<!--</div>-->
					<!--</div>-->
					<!--<div class="ds-mc-im text-muted">{{mercInfo.symbol}}</div>-->
					<!--<div class="ds-mc-im" v-if="mercParam.mainInfo">{{mercParam.mainInfo}}</div>-->
					<!--<div class="ds-mc-im text-muted" v-else>未设置主体信息</div>-->
				<!--</div>-->
			<!--</div>-->

			<!--右边任务数-->
			<!--<div class="right_task" v-if="taskNum>0">-->
				<!--<div class="right_task-main">-->
					<!--<span class="pull-left">-->
						<!--<img src="/static/img/setting/task_img.png" width="70px;">-->
					<!--</span>-->
					<!--<span>-->
						<!--<div class="right_task-main-content">-->
							<!--<p>您还有 {{taskNum}} 个任务未完成</p>-->
							<!--<el-button class="el-button_task" @click="goMyTask">立即去完成</el-button>-->
						<!--</div>-->
					<!--</span>-->
				<!--</div>-->
			<!--</div>-->
		<!--</div>-->

		<div style="overflow: hidden;">
			<div style="float: left; width: 59%;">
				<div class="ds-sta bd-muted-vice" style="margin: 15px 0px 15px 15px;">
					<el-row>
						<!--<h3 style="text-align: left; margin-left: 24px">经营概况</h3>-->
						<el-col :span="6" v-for="(item, index) in statisticsData.list" :key="index">
							<div class="grid-content bg-purple ft-size">
								<p><span style="font-size: 20px">{{item.symbol}}</span>{{item.cnt}}</p>
								<div class="text-muted subtitle">{{item.text}}</div>
							</div>
						</el-col>
					</el-row>
				</div>

				<div style="margin-left: 15px;width: 100%" v-if="workInfo.cityId > 0">
					<el-row :gutter="15" >
						<el-col :span="12" class="">
							<div class="ds-sta t-left bd-muted-vice">
								<h3 class="text-margin-left">短信预警</h3>
								<div class="grid-content bg-purple ft-size text-margin-left">
									<p :class="statisticsData.availableCnt < 0? 'text-danger t-left' : 'text-primary t-left'" @click="openMessagePush" style="cursor: pointer;"><span style="font-size: 20px"></span>{{statisticsData.availableCnt || 0}}</p>
									<el-button type="primary" class="botton-margin"  @click="openMessage">购买</el-button>
									<div class="text-muted subtitle">剩余短信数量</div>
								</div>
							</div>

						</el-col>
						<el-col :span="12" class="div-width ">
							<div class="bd-muted-vice" style="overflow: hidden;">
								<div class="ds-sta  pull-left ">
									<h3 class="t-left text-margin-left">门店到期提醒</h3>
									<div class="grid-content bg-purple ft-size text-margin-left">
										<p @click="openStore" style="cursor: pointer;"><span style="font-size: 20px"></span>{{statisticsData.adventCnt || 0}}</p>
										<div class="text-muted subtitle">将要过期门店</div>
									</div>
								</div>
								<div class="ds-sta pull-right ">
									<h3>&nbsp</h3>
									<div class="grid-content bg-purple ft-size text-margin-left">
										<p  style="color: #ff5151;cursor: pointer;" @click="openStore"><span style="font-size: 20px"></span>{{statisticsData.expireCnt || 0}}</p>
										<div class="text-muted subtitle">已过期门店</div>
									</div>
									<div></div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>

					<div class="ds-sta wrap-rve bd-muted-vice" style="margin: 15px 0px 15px 15px;text-align:left; height: 120px" v-if="taskNum >0" >
						<el-row style="height: 100%">
							<el-col :span="20">
								<div class="bg-purple ft-size">
									<h3 style="margin-left: 24px">未完成任务</h3>
									<div class="text-muted subtitle" style="font-size: 40px; margin-left: 25px;color: #ff5151;">{{taskNum}}</div>
								</div>
							</el-col>
							<el-col :span="4" >
								<div class="item-abs-colum-center lg-div-right">
									<el-button type="primary"  style="width: 100px"  @click="goMyTask">立即去完成</el-button>
								</div>

							</el-col>
						</el-row>
					</div>

				<div class="ds-sta wrap-rve grid-content bd-muted-vice" style="margin: 15px 0px 15px 15px;text-align:left;"  v-if="workInfo.cityId > 0" >
					<el-row style="height: 100%">
						<el-col :span="20">
							<div class="bg-purple ft-size wrap-rve" style="margin-left: 25px;" >
								<div><h3 style="display: inline-block" class="item-abs-colum-center">通洗币:</h3></div>

								<span class="text-muted" style="font-size: 40px; color: #1989fa;margin-left:50px;cursor: pointer;" @click="goMyCoin(0)">{{coinCnt || 0}}</span>
							</div>
						</el-col>
						<el-col :span="4"  class="">
							<div class="item-abs-colum-center lg-div-right">
								<el-button type="primary"  style="width: 100px"  @click="goMyCoin(1)">赚取更多</el-button>
							</div>

						</el-col>
					</el-row>
				</div>


			</div>

				<div class="ds-info" style="width: 40%;float:right; margin-top:0px" >
					<div class="f-k bd-muted-vice">
						<h3>近期活动</h3>
						 <span class="more text-primary">
            </span>
						<table style="width: 100%">
							<tr v-if="activityList.list.length == 0">
								<td class="list-color-b text-center">暂无记录</td>
							</tr>
							<tr v-if="activityList.list.length != 0" v-for="item in activityList.list">
								<td class="flex-wrap flex-wrap-between" >
									<div>
										<router-link :to="'/stac/notice?id='+item.id"
																 class="list-color-b"
																 target="_blank" v-if="item.accessMode===1">{{item.title}}</router-link>
										<a class="list-color-b" :href="item.content" v-else  target="_blank">{{item.title}}</a>
										<span class="new_news" v-show="newsFlag.includes(item.id)">new</span>
									</div>
									<div><span class="list-color-b" >{{item.releaseTime | getDate}}</span></div>

								</td>
							</tr>
						</table>
						<div class="pagebtn">
							<el-pagination :current-page.sync="activityList.pagination.current"
														 :page-size="activityList.pagination.size"
														 layout="total, prev, pager, next"
														 :total="activityList.pagination.total"
														 @current-change="queryActivity"> </el-pagination>
						</div>
					</div>

					<div class="f-k bd-muted-vice">
						<h3>产品动态</h3>
						 <span class="more text-primary">
            </span>
						<table style="width: 100%">
							<tr v-if="dynamicList.list.length == 0">
								<td class="list-color-b text-center">暂无记录</td>
							</tr>
							<tr v-if="dynamicList.list.length != 0" v-for="item in dynamicList.list">
								<td class="flex-wrap flex-wrap-between">
									<div>
										<router-link :to="'/stac/notice?id='+item.id"
																 class="list-color-b"
																 target="_blank" v-if="item.accessMode===1">{{item.title}}</router-link>
										<a class="list-color-b" :href="item.content" v-if="item.accessMode == 2" target="_blank">{{item.title}}</a>
										<span class="new_news" v-show="newsFlag.includes(item.id)">new</span>
									</div>
									<div><span class="list-color-b">{{item.releaseTime | getDate}}</span></div>
								</td>
							</tr>
						</table>
						<div class="pagebtn">
							<el-pagination :current-page.sync="dynamicList.pagination.current"
														 :page-size="dynamicList.pagination.size"
														 layout="total, prev, pager, next"
														 :total="dynamicList.pagination.total"
														 @current-change="queryDynamic"> </el-pagination>
						</div>
					</div>
				</div>
		</div>



	</div>
</template>
<script>
import auth from '@/utils/auth'
import router from '@/router'
import consts from "@/utils/consts";
import calculation from '@/utils/helpers/calculation'
import time from '@/utils/helpers/timeLite'
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";

export default {
  components: {ElCol, ElRow}, data() {
		return {
			taskNum:'',
			mercInfo: auth.getMercInfo(),
			workInfo: auth.getWorkInfo(),
			mercParam: {},
			// tableData: {
      //   size: consts.PAGE_SIZE,
      //   total: 0,
      //   page: 1,
			// 	list: [],
      //   activity:2, //近期活动
      //   dynamic:1,  //产品动态
			// 	activityList:[],
			// 	dynamicList:[]
			// },
			activityList:{
				list:[],
				activity:2, //近期活动
				pagination: {
					size: consts.PAGE_SIZE,
					total: 0,
				 	current: 1
				}
			},
			dynamicList:{
				list:[],
				dynamic:1,  //产品动态
				pagination: {
					size: consts.PAGE_SIZE,
					total: 0,
				 	current: 1
				}
			},
			coinCnt:'',
			statisticsData: {
				list: [],
        availableCnt:0,
        adventCnt:0,
        expireCnt:0
      },
			newsFlag:[],
		}
	},
	created() {
		this.queryNuwFlag();
		this.dashboard();
		this.queryActivity();
		this.queryCoin();
		// 相同请求异常-延迟查询
    let _this = this;
    setTimeout(()=> {
      _this.queryDynamic();
    },1500);
		this.getMercParam();
    if (auth.hasPerm('setting.mytask.read')) {
      this.getTaskNum();
    }
	},
	
	methods: {
		queryNuwFlag(){
			this.$store.dispatch('post',{
				uri:"notice/queryNuwFlag",
				data:{
					limitNumber:2
				}
			}).then(res=>{
				this.newsFlag=res.data.data;
			})
		},
		queryCoin(){
		  this.$store.dispatch("get",{
		    uri:"mercCoinBill/queryCoin"
			}).then(res =>{
			  this.coinCnt = res.data.data;
			})
		},
		goMyTask(){
			this.$router.push({path:'/setting/mytask'})
		},
		goMyCoin(key){
		  this.$router.push({path: key == 0 ? '/finance/income/coin': '/setting/account/invite'})
		},
		getAuth(item){
		  let _this=this;
		  let obj=auth.getPermList();
		  for(let i=0;i<item.length;i++){
			for(let j=0;j<=obj.length;j++){
			  if(item[i].permission===obj[j]){
				 _this.taskNum++;
			  }
			}
		  }
		},
		getTaskNum(){
			this.$store.dispatch('post',{
				uri:'taskInfo/list',
			}).then(res=>{
				if(res.data.data.list.length!==0){
					this.getAuth(res.data.data.list);
				}
			})
		},
		dashboard(){
      this.$store.dispatch('post', {
        uri: 'dashboard/index',
        data: {}
      }).then((res) => {
         const data = res.data.data
				 this.statisticsData.list.push({cnt: data.msgCnt, text: '未读消息', symbol:''})
				 this.statisticsData.list.push({cnt: data.orderCnt, text: '昨日订单', symbol:''})
				 this.statisticsData.list.push({cnt: calculation.accDiv(data.tradeTotal, 100), text: '昨日交易金额', symbol:'￥'})
				 this.statisticsData.list.push({cnt: calculation.accDiv(data.rechargeTotal, 100), text: '昨日充值金额', symbol:'￥'})
				 this.statisticsData.availableCnt = data.availableCnt;
				 this.statisticsData.adventCnt = data.adventCnt;
				 this.statisticsData.expireCnt = data.expireCnt;
      })
    },
		getMercParam(){
      this.$store.dispatch('post', {
        uri: 'mercParam/detail',
      }).then((res) => {
				this.mercParam = res.data.data;
      })
		},
    queryActivity(){
			let _this=this
			_this.activityList.list.length = 0
			_this.$store.dispatch('post', {
				 uri: 'notice/list',
				 data:{
					 category:_this.activityList.activity
				 },
				 params: {
            startRow: (this.activityList.pagination.current - 1) * this.activityList.pagination.size,
            pageSize: this.activityList.pagination.size
        }
			 }).then(res=>{
					 this.activityList.pagination.total = res.data.data.total;
					 let item=res.data.data.list;
					//  this.news.actFinshFlag=1;
					// for(let i=0;i<item.length;i++){
					// 	item[i].show=true;
					// }
					  this.activityList.list=res.data.data.list;
			 })
		},
		queryDynamic(){
			let _this=this
			_this.dynamicList.list.length = 0
			_this.$store.dispatch('post', {
				 uri: 'notice/list',
				 data:{
					 category:_this.dynamicList.dynamic
				 },
				params: {
            startRow: (this.dynamicList.pagination.current - 1) * this.dynamicList.pagination.size,
            pageSize: this.dynamicList.pagination.size
        }
			 }).then(res=>{
				 let item=res.data.data.list || [];
					_this.dynamicList.list=item || [];
					this.dynamicList.pagination.total = res.data.data.total;
			 })
		},
		openMessage(){
      this.$router.push({
        path: '/marketing/message/recharge',
      });
		},
		openMessagePush(){
      this.$router.push({
        path: '/marketing/message/push',
      });
		},
		openStore(){
      this.$router.push({
        path: '/store/list',
      });
		}
		
	}
}
</script>
<style scoped lang="less">
.dash{
	font-size: 12px;
}
.dash .ds-basics {
	position: relative;
	width: 100%;
}

.list-color-b{
	color:#324057;
}

.ds-basics .ds-logo {
	width: 85px;
	border-radius: 5px;
	overflow: hidden;
}

.ds-logo img {
	vertical-align: middle;
	width: 85px;
	height: 85px;
}

.wrap-rve{
	position: relative;
}

.item-abs-colum-center{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}

.flex-wrap{
	display: flex;
}
.flex-wrap-between{
	justify-content:space-between;
	align-items: center;
}


.right_task{
	position: absolute;
	top: 50%;
	right: 0;
	transform: translate(0%,-50%);
	display:inline-block;
	// height:80px;
	padding: 15px 0px;
	width:450px;
	background-color:#ff6602;
	border-radius: 10px;
	.right_task-main{
		width: 340px;
		margin: 0 auto;
		.right_task-main-content{
			text-align: center;
			color: white;
			font-size: 14px;
			.el-button_task{
				background-color: white;
				color: #ff6602;
				border: none;
				margin-top: 10px;
				&:hover{
					opacity: .5;
				}
			}
		}
	}
}

.ds-mc{
	margin-left:110px;
}
.ds-basics .ds-mc-im {
	line-height: 25px;
}

.ds-basics .ds-mc .ds-mc-tm .name {
	font-size: 18px;
	color: #1F2D3D
}

.ds-basics .ds-mc .ds-mc-tm .aut {
	background: #F7BA2A;
	color: #fff;
	border-radius: 15px;
	padding: 6px 15px;
	font-size: 12px;
	margin-left: 5px
}

.ds-basics .ds-mc .ds-mc-tm .n-aut {
	background: #C0CCDA;
	color: #fff;
	border-radius: 15px;
	padding: 6px 15px;
	font-size: 12px;
	margin-left: 5px
}

.dash .ds-sta {
	background: white;
	width: 100%;
	text-align: center;
	padding: 33px 0 28px;
	box-sizing: border-box;
}

.dash .t-left{
	text-align:left;
}
.div-width>div>div{
	width: 50% !important;
}



.dash .text-margin-left{
	margin-left: 25px;
}
.dash .botton-margin{
	float: right;
	margin-right: 20px;
	margin-top: -60px;
}

.ds-sta p {
	font-style: normal;
	font-size: 40px;
	font-weight: 500;
	line-height: 60px;
	display: block;
	width: 100%;
	text-align: center;
	color: #1989fa;
}

.ds-sta .subtitle {
	font-size: 12px;
	color: #324057;
	display: block;
}

.dash .ds-info {
	margin-top: 25px;
	width: 100%;
}

.ds-info .f-k {
	padding: 15px;
	margin: 15px;
	height: 330px;
	position: relative;
	background-color: white;
	box-sizing: border-box;
}

.ds-info span {
	margin-right: 5px;
}

.f-k .more {
	position: absolute;
	right: 20px;
	top: 20px;
}

.ds-info table tr {
	height: 25px;
	line-height: 25px;
}

.ds-info .f-left {
	float: left;
	width: 46%;
}


.ds-info .f-right {
	float: right;
	width: 46%;
}
.pagebtn{
	position: absolute;
	bottom: 10px;
	right: 10px;
}
.text-black:hover{
	color:#20a0ff
}

.ds-sta .text-danger{
	color: #FF4949 !important;
}

.new_news{
	// -webkit-text-size-adjust:none;
	display: inline-block;
	background-color: red;
	color: white;
	width: 32px;
	font-size: 10px;
	-webkit-transform : scale(0.70,0.70) ;
  //  font-size:5px;
	text-align: center;
	border-radius: 8px;
	line-height: 19px;
}

.bd-muted-vice{
	border: 1px solid #dee5e7;
	border-radius:4px;
}

	a:hover{
		color: #1989fa;
	}

	.lg-div-right{
		right: 50px;
	}
</style>