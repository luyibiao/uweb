<template>
	<div class="ukao-mt-lg box_uk">
		<div v-loading="loading" class="bd">
			<el-button style="position: absolute;right: 50px; top: 20px;" @click="onSyncExtend" v-if="dataInfo.code">{{btn.refresh}}</el-button>
			<div  class="back-to-nav" style="text-align: center;margin: 20px 10px 10px -20px;">
				<span class="text-md" style=" font-size: 14px;" >{{dataInfo.name}}</span>
			</div>
			<div class="sc-graph">
				<div v-if="groupBox.length == 0">
					<div class="text-muted text-xl wrapper-lg">还未添加智柜，请联系管理员。</div>
				</div>

				<template v-for="(group, index) in groupBox">
					<div class="v-item" v-if="group.type == 4">
						<el-row :gutter="6">
							<template v-for="(boxList, index1) in group.column">
								<template v-if="boxList.length == 4">
									<el-col :span="24">
										<div v-for="(box, index2) in boxList" @click="toOpenBox(box.code)" :key="index2" :class="box.color + ' com_item'" style="cursor:pointer;line-height:29px">{{box.code}}</div>
									</el-col>
								</template>
								<template v-else>
									<el-col :span="8" v-for="(box, index2) in boxList" :key="index2">
										<div :class="box.color + ((group.columnStyle && (group.flag || index1 < 1)) ?group.columnStyle:'')" style="cursor:pointer;" @click="toOpenBox(box.code)">{{box.code}}</div>
									</el-col>
								</template>
							</template>
						</el-row>
					</div>
					<div :class="group.type != 3?'h-item':'v-item'" v-else-if="group.type != 1">
						<el-row :gutter="6">
							<el-col :span="12" v-for="(boxList, index1) in group.column" :key="index1">
								<div v-for="(box, index2) in boxList" :key="index2" :class="box.color">{{box.code}}</div>
							</el-col>
						</el-row>
					</div>
					<div class="h-item" v-else-if="group.type == 1">
						<el-row :gutter="6">
							<el-col :span="12" v-for="(boxList, index1) in group.column" :key="index1">
								<template v-for="(box, index2) in boxList">
									<div :class="box.color">{{box.code}}</div>
									<template v-if="index1 == 0 && index2 == 0">
										<div class="item sc-box-large text-white">
											<div>屏</div>
											<div>幕</div>
										</div>
									</template>
								</template>
							</el-col>
						</el-row>
					</div>
				</template>

				<!-- 组合柜-->
				<!--<div class="v-item" >
					<el-row :gutter="6" >
						<el-col :span="24">
							<div class="item bg-success com_item" >51</div>
							<div class="item bg-success com_item" >52</div>
							<div class="item bg-success com_item" >53</div>
							<div class="item bg-success com_item" >54</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success m-t-none" >55</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success m-t-none" >56</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success m-t-none" >57</div>
						</el-col>

					</el-row>
				</div>-->

				<!--<div class="v-item" >-->
					<!--<el-row :gutter="6" >-->
						<!--<el-col :span="8">-->
							<!--<div class="item bg-success m-b-none">22</div>-->
						<!--</el-col>-->
						<!--<el-col :span="8">-->
							<!--<div class="item bg-success m-b-none">23</div>-->
						<!--</el-col>-->
						<!--<el-col :span="8">-->
							<!--<div class="item bg-success m-b-none">24</div>-->
						<!--</el-col>-->
						<!--<el-col :span="24">-->
							<!--<div class="item bg-success com_item" >25</div>-->
							<!--<div class="item bg-success com_item" >26</div>-->
							<!--<div class="item bg-success com_item" >27</div>-->
							<!--<div class="item bg-success com_item" >28</div>-->
						<!--</el-col>-->
					<!--</el-row>-->
				<!--</div>-->

			<!--	<div class="v-item">
					<el-row :gutter="6">
						<el-col :span="8">
							<div class="item bg-success m-b-none">40</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success m-b-none">41</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success m-b-none">42</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success" >43</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success" >44</div>
						</el-col>
						<el-col :span="8">
							<div class="item bg-success" >45</div>
						</el-col>
					</el-row>
				</div>-->

				<!--<div class="v-item">-->
					<!--<el-row :gutter="6">-->
						<!--<el-col :span="24">-->
							<!--<div class="item bg-success com_item" >29</div>-->
							<!--<div class="item bg-success com_item" >30</div>-->
							<!--<div class="item bg-success com_item" >31</div>-->
							<!--<div class="item bg-success com_item" >32</div>-->
							<!--<div class="item bg-success com_item" >33</div>-->
							<!--<div class="item bg-success com_item" >34</div>-->
							<!--<div class="item bg-success com_item" >35</div>-->
							<!--<div class="item bg-success com_item" >36</div>-->
						<!--</el-col>-->
					<!--</el-row>-->
				<!--</div>-->
				<!-- 组合柜-->

				<!--<div class="h-item">-->
					<!--<el-row :gutter="6">-->
						<!--<el-col :span="12">-->
							<!--<div class="item bg-success">01</div>-->
							<!--<div class="item bg-success">02</div>-->
							<!--<div class="item bg-warning">03</div>-->
							<!--<div class="item bg-success">04</div>-->
							<!--<div class="item bg-danger">05</div>-->
							<!--<div class="item bg-success">06</div>-->
						<!--</el-col>-->
						<!--<el-col :span="12">-->
							<!--<div class="item bg-success">07</div>-->
							<!--<div class="item bg-success">08</div>-->
							<!--<div class="item bg-warning">09</div>-->
							<!--<div class="item bg-success">10</div>-->
							<!--<div class="item bg-danger">11</div>-->
							<!--<div class="item bg-success">12</div>-->
						<!--</el-col>-->
					<!--</el-row>-->
				<!--</div>-->

				<!--<div class="h-item">-->
					<!--<el-row :gutter="6">-->
						<!--<el-col :span="12">-->
							<!--<div class="item bg-success">13</div>-->
							<!--<div class="item sc-box-large text-white">-->
								<!--<div>屏</div>-->
								<!--<div>幕</div>-->
							<!--</div>-->
							<!--<div class="item bg-danger">14</div>-->
							<!--<div class="item bg-success">15</div>-->
						<!--</el-col>-->
						<!--<el-col :span="12">-->
							<!--<div class="item bg-success">16</div>-->
							<!--<div class="item bg-success">17</div>-->
							<!--<div class="item bg-warning">18</div>-->
							<!--<div class="item bg-success">19</div>-->
							<!--<div class="item bg-danger">20</div>-->
							<!--<div class="item bg-success">21</div>-->
						<!--</el-col>-->
					<!--</el-row>-->
				<!--</div>-->

				<!--<div class="v-item">-->
					<!--<el-row :gutter="6">-->
					  <!--<el-col :span="12">-->
					  	<!--<div class="item bg-success">22</div>-->
	            <!--<div class="item bg-success">23</div>-->
					  <!--</el-col>-->
					  <!--<el-col :span="12">-->
					  	<!--<div class="item bg-success">24</div>-->
	            <!--<div class="item bg-success">25</div>-->
					  <!--</el-col>-->
					<!--</el-row>-->
				<!--</div>-->

			</div>
		</div>
		<div class="text-center m-t-xxl b-t wrapper-lg bd top_box" v-loading="loading">
			<div class="state text-left">
				<div v-if="dataInfo.runningState == -1" class="text text-danger">运行异常</div>
				<div v-if="dataInfo.runningState == 0" class="text text-success">重启中</div>
				<div v-if="dataInfo.runningState == 1" class="text text-success">运行正常</div>
				<p class="text text-danger">满箱率：{{dataInfo.rate}}%</p>
				<p class="tip text-muted" v-if="dataInfo.remindRate==0">未设置满箱提醒值</p>
				<p class="tip text-muted" v-if="dataInfo.remindRate">提醒值：{{dataInfo.remindRate}}%</p>
			</div>
			<div class="graph">
				<el-row :gutter="30">
				  <el-col :span="6">
				  	<div class="item text-center">
				  		<div class="box bg-warning">
				  			<span>{{dataInfo.send}}</span>
				  		</div>
				  		<p class="m-t-xs">下单</p>
				  	</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="item text-center">
				  		<div class="box bg-info">
				  			<span>{{dataInfo.back}}</span>
				  		</div>
				  		<p class="m-t-xs">回柜</p>
				  	</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="item text-center">
				  		<div class="box bg-success">
				  			<span>{{dataInfo.hempty}}/{{dataInfo.sempty}}</span>
				  		</div>
				  		<p class="m-t-xs">横/竖空箱</p>
				  	</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="item text-center">
				  		<div class="box bg-danger">
				  			<span>{{dataInfo.danger}}</span>
				  		</div>
				  		<p class="m-t-xs">异常</p>
				  	</div>
				  </el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'

	export default {
	  data:function () {
			return {
				loading: true,
				dataInfo:{},
				groupBox: [],
				btn:{
					refresh:"更新"
				}
			}
    },
		created () {
	    let _this = this
			this.detail(function () {
				_this.getBoxList(function () {
					_this.loading = false
        })
      })
    },
		methods: {
			detail(fn){
				this.$store.dispatch('post', {
					uri : 'cupboardInfo/detail',
					data: {id:this.$route.params.id}
				}).then((res) =>{
					this.dataInfo = res.data.data;
					if(typeof (fn) ==='function'){
					  fn()
					}
				})
			},
			toOpenBox(boxCode) {
        let _this = this;
        msg.confirm({
          msg:'确定开'+boxCode+'号箱?',
          confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'cupboardInfo/remoteOpen',
              data: {cupboardCode:_this.dataInfo.code, boxCode:boxCode}
            }).then((res)=>{
              msg.success();
            })
          }
        })
			},
			getBoxList(fn){
				this.$store.dispatch('post', {
					uri : 'cupboardInfo/boxGroup',
					data: {id: this.dataInfo.id}
				}).then((res) =>{
					let list = res.data.data || []
					this.groupTypeList(list)
					if(typeof (fn) ==='function'){
					  fn()
					}
				})
			},
			groupTypeList(list){
				var _this = this

				list.forEach(function (group) {
				  let boxList = group.boxList;
          group.column = [];
          boxList.forEach(function(box) {
            box.color = _this.getBizStatueCss(box.bizStatus);
					});
          if (group.type == 1) {
            group.column = [boxList.slice(0,3), boxList.slice(3)];
					} else if (group.type == 2) {
            group.column = [boxList.slice(0,6), boxList.slice(6)];
					} else if (group.type == 3) {
            group.column = [boxList.slice(0,2), boxList.slice(2)];
					} else if (group.type == 4) {
            let box = boxList[0];
            let combox1 = [];
            let combox2 = [];
            if (box.type == 1) {
              combox1 = boxList.slice(0,4);
              combox2 = boxList.slice(4);
						} else {
              combox1 = boxList.slice(0,3);
              combox2 = boxList.slice(3);
						}
            group.flag = true;
						if (combox1.length == 3) {
              group.columnStyle = ' m-b-none';
						}
						if (combox2.length == 3 && combox1.length == 4) {
              group.columnStyle = ' m-t-none';
						}
						if(combox1.length == 3 && combox2.length == 3){
              group.flag = false;
						}
            group.column = [combox1, combox2]
					}
				});
				this.groupBox = list;

			},

			getBizStatueCss(bizState){
			  let color = '';
			  switch (bizState){
					case 0 : color = 'item bg-success'; break;
					case 1 : color = 'item bg-warning'; break;
					case 2 : color = 'item bg-info'; break;
					default: color = 'item bg-success'; break;
				}
				return color;
			},
			onSyncExtend(){
				let _this = this
				_this.btn.refresh = "更新中..."
				_this.loading = true
				this.detail(function () {
					_this.getBoxList(function () {
						_this.loading = false
						msg.success("已更新最新配置")
						setTimeout(()=>{
							_this.btn.refresh = '更新'
						},500)
					 })
				 })
			}
    }
  }
</script>

<style scoped>
	.bd{
		border: 1px solid #e5e5e5;
		position: relative;
	}
	.sc-graph {
		overflow-y: hidden;
		overflow-x: auto;
		text-align: center;
		margin: 20px 0px;
	}
	.h-item,
	.v-item  {
		display: inline-block;
		margin-left: 10px;
		margin-right: 10px;
	}
	.h-item {
		width: 160px;
	}
	.v-item {
		width: 100px;
	}
	.com_item{
		height: 29px !important;
	}
	.h-item .item,
	.v-item .item {
		margin-top: 5px;
		margin-bottom: 5px;
		text-align: center;
		border-radius: 4px;
		line-height: 40px;
		color: #fff;
	}
	.h-item .item {
		height: 40px;
	}
	.v-item .item {
		height: 130px;
	}
	.h-item .item.sc-box-large {
		height: 130px;
		background: #9b9b9b;
		padding: 45px 0;
		line-height: 20px;
		box-sizing: border-box;
	}

	.state,
	.graph {
		display: inline-block;
		vertical-align: middle;
		margin: 0 20px;
	}
	.state .text {
		position: relative;
		font-size: 24px;
		padding-left: 30px;
		margin-bottom: 10px;
	}
	.state .text:before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border: 8px solid transparent;
		border-radius: 50%;
	}
	.state .text.text-success:before {
		border-color: #13CE66;
	}
	.state .text.text-danger:before {
		border-color: #FF4949;
	}
	.state .tip {
		margin-left: 30px;
	}
	.graph .item .box {
		display: inline-block;
		width: 100px;
		height: 100px;
		line-height: 100px;
		font-size: 28px;
		color: #fff;
		border-radius: 50%;
	}
	.top_box{
		margin-top: 15px;
		padding: 40px 0px;
	}
	.box_uk{
		margin-top: -30px;
	}
</style>