<template>
	<div v-loading="loading">
		<vBanner :isShow="cityInfo && cityInfo.isShopOpen===0"></vBanner>
		<el-row :gutter="20">
		  <el-col :span="6">
		  	<div>可选取件时间段</div>
		  </el-col>
		  <el-col :span="15">
		  	<div>开启的时间段将在客户下单界面被选择。</div>
		  	<ul class="time-list clearfix" v-if="takeTimeList && takeTimeList.length > 0">
					<li  v-for="item in timeList"  v-if="item.type == 1" v-bind:key="item.id">
						<div class="time-item" :class="{ 'is-active': item.status == 1 }">
							{{item.timeStart}} - {{item.timeEnd}}
						</div>
	  			</li>
		  	</ul>
				<div v-else class="text-muted" style="margin-top: 15px">
					未设置取件时间，用户微信下单不用选择取件时间。
				</div>
		  </el-col>
		  <el-col :span="3">
				<div class="text-right">
					<auth perm="weixin.time.period.update">
						<router-link to="/weixin/time/get"><el-button>修改</el-button></router-link>
					</auth>
				</div>
		  </el-col>
		</el-row>
		<div class="m-t-lg b-b m-b-lg"></div>
		<el-row :gutter="20" class="m-b">
		  <el-col :span="6">
		  	<div>可选送件时间段</div>
		  </el-col>
		  <el-col :span="15">
		  	<div>开启的时间段将在客户下单界面被选择。</div>
		  	<ul class="time-list clearfix" v-if="sendTimeList && sendTimeList.length > 0">
					<li v-for="item in timeList"  v-if="item.type == 2" v-bind:key="item.id">
						<div class="time-item" :class="{ 'is-active': item.status == 1 }">
							{{item.timeStart}} - {{item.timeEnd}}
						</div>
					</li>
		  	</ul>
				<div v-else class="text-muted" style="margin-top: 15px">
					未设置送件时间，订单送回时间不限制。
				</div>
		  </el-col>
		  <el-col :span="3">
		  	<div class="text-right">
					<auth perm="weixin.time.period.update">
						<router-link to="/weixin/time/send"><el-button>修改</el-button></router-link>
					</auth>
				</div>
		  </el-col>
		</el-row>
		<div class="m-t-lg b-b m-b-lg"></div>
		<div>
			<div style="font-size: 16px;color: #000;" class="m-t">约满时间设置</div>
			<div class="text-muted" style="padding: 10px 0px 20px">添加的时间客户微信上下单会显示约满
				<el-button class="pull-right" type="primary" style="margin-top: -10px;" @click="newServiceTimeLimit">+ 新建约满日期</el-button>
			</div>
			<el-table class="ukao-el-table w-full ukao-v-loading  "
								v-loading="loading"
								:data="timeLimitList"
								style="width: 100%;"
			>
					<el-table-column
						label="序号"
						type="index"
						width="200" >
					</el-table-column>

					<el-table-column  label="日期"  width="240" >
						<template slot-scope="scope">
							<span class="">{{scope.row.date}}</span>
						</template>
					</el-table-column>

					<el-table-column  label="约满"  >
						<template slot-scope="scope">
							<ul class="time-list limit-time-list clearfix" v-if="takeTimeList && takeTimeList.length > 0">
								<li  v-for="item in timeList" :key="item.id" >
									<div v-for="item2 in scope.row.serviceTimeIds.split(',')" v-if="item.id == item2" >
										<div class="is-limit-item" >
											{{item.timeStart}} - {{item.timeEnd}}
										</div>
									</div>
								</li>
							</ul>
						</template>
					</el-table-column>

				<el-table-column  label="操作" width="160">
					<template slot-scope="scope">
						<el-button size="small" v-if="scope.row.id" @click="detail(scope.row)" type="primary">编辑</el-button>
						<el-button size="small" v-if="scope.row.id" type="danger" @click="del(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>

			</el-table>

		</div>

		<el-dialog class="ukao-dialog"
							 :title="form.id ? '修改约满时间': '新建约满时间'"
							 :visible.sync="dialogVisible"
							 size="small"
		>
			<el-form :model="form"
							 :rules="rules"
							 ref="form"
							 label-width="160px">
				<el-form-item label="日期"
											prop="date">
					<el-date-picker
						v-model="form.date"
						align="right"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期"
						:picker-options="pickerOptions1">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="约满时间段"
											prop="serviceTimeIds">
					<el-checkbox-group v-model="form.serviceTimeIds" size="small">
						<span v-for="item in takeTimeList" :key="item.id" style="margin-right: 10px">
							<el-checkbox-button   :label="item.id"
																		border
																		:clearable="false">
								{{`${item.timeStart} - ${item.timeEnd}`}}
							</el-checkbox-button >
						</span>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary"
										 :loading="saving"
										 :disabled="!form.date || !form.serviceTimeIds.length > 0"
										 @click="submitForm(form)">{{saving ? '保存中' : '保存'}}</el-button>
				</el-form-item>

			</el-form>
		</el-dialog>
	</div>

</template>

<script>
	import vBanner from '../banner.vue'
  import ElRow from "element-ui/packages/row/src/row";
  import msg from "@/utils/msg";
	export default {
		components: {
      ElRow, vBanner
		},
		data: function() {
			return {
        saving: false,
        dialogVisible: false,
				loading: true,
				timeList: [],
				takeTimeList: [],
				sendTimeList: [],
				cityInfo:{},
				timeLimitList:[],
				form:{
          id:"",
          date:"",
					serviceTimeIds:"",
          serviceTimeIds: []
				},
        rules:{
          serviceTimeIds:{
            required: true, message: "请选择约满时间段"
          },
					date:{
            required: true, message: "请选择日期"
					}
				},

        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() <= Date.now()-24*60*60*1000 || time.getTime() > Date.now()+30*24*60*60*1000 //|| time.getTime > Date.now()+30*12*60*60*1000;
          }
        }
			}
		},
		created () {
		  this.list();
			this.limitList();
	  },
		methods: {
			list (){
			  var _this = this
				this.$store.dispatch('post', {
					uri : 'serviceTime/list',
					data: {}
				}).then((res) =>{
				  this.cityInfo = res.data.cityInfo
					let list = res.data.data.list || []
					list.forEach(function (item) {
					  if(item.status == 1) {
              if (item.type == 1) {
                _this.takeTimeList.push(item)
              }
              if (item.type == 2) {
                _this.sendTimeList.push(item)
              }
            }
          })
					this.timeList = list
					this.loading = false
				})
			},
			limitList(){
        this.$store.dispatch('post', {
          uri : 'serviceTimeLimit/list',
          data: {
            //desc: 1
            startRow: 0,
            pageSize: 30
					}
        }).then((res) =>{
          this.timeLimitList = res.data.data.list;
          for(let index in this.timeLimitList){
            this.timeLimitList[index].index = index + 1;
            this.timeLimitList[index].serviceTimesList = this.timeLimitList[index].serviceTimeIds.split(",")
					}
				});
			},
      newServiceTimeLimit(){
			  this.form.id="";
			  this.form.date = "";
			  this.form.serviceTimeIds = [];
			  this.dialogVisible = true;
			},
			del(id){
        this.$store
          .dispatch("post", {
            uri:  "serviceTimeLimit/delete" ,
            data: {
              id:id
						},
            forceResolve: true
          })
          .then(res => {
            if (200 === res.data.httpCode) {
              this.limitList();
              msg.success();
            } else {
              msg.error(res.data.msg);
            }
					});
			},
      detail(item){
			  this.form.id = item.id;
			  this.form.date = item.date;
			  this.form.serviceTimeIds = item.serviceTimeIds ? item.serviceTimeIds.split(",").map(Number) : [];
        this.dialogVisible = true;

			},
      // 保存
      submitForm() {
        this.saving = true;
        let data = {
          id: this.form.id,
          date: this.form.date,
          serviceTimeIds: this.form.serviceTimeIds.join(","),
				}
				this.$store
					.dispatch("post", {
						uri: this.form.id ? "serviceTimeLimit/update" : "serviceTimeLimit/add",
						data: data,
						forceResolve: true
					}).then(res => {
						if (200 === res.data.httpCode) {
							this.limitList();
							msg.success();
							this.dialogVisible = false;
						} else {
							msg.error(res.data.msg);
						}
						this.saving = false;
					});

      },
		}
	}
</script>

<style less>
	.time-list li {
		float: left;
		margin-top: 10px;
		margin-right: 15px;
	}
	.time-list .time-item {
		background: #dcdcdc;
		padding: 10px 15px;
		color: #fff;
		border-radius: 4px;
	}
	.time-list .time-item.is-active {
		background-color: #36c924;
	}

	.is-limit-item{
		color: #f56c6c;
		background: #fef0f0;
		border: 1px solid #fbc4c4;
		padding: 10px 15px;
		border-radius: 4px;
	}
	.ukao-el-table th, .ukao-el-table th .cell{
		background-color: #eef1f6;
		color: #000;
		font-weight: normal;
		font-size: 14px;
	}

	.el-table .cell {
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		white-space: normal;
		word-break: break-all;
		line-height: 20px;
	}

	.limit-time-list li {
		float: left;
		margin-top: 0px;
		margin-right: 15px;
	}

	.el-checkbox-button:last-child .el-checkbox-button__inner {
		 border-radius: 4px;
		padding: 15px 15px;
		margin-bottom: 10px;
	}
</style>

