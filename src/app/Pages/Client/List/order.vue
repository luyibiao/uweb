<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'5'"></v-list-tab-nav>
		</div>

		<div class="m-t-xl"  v-loading="loading">
			<table class="ukao-order-table w-full">
				<thead>
					<tr>
						<!-- <th>客户</th> -->
						<th>下单时间</th>
						<th>地址坐标 | 派发人员</th>
						<th>地址 | 取/送时间</th>
						<th>标签</th>
						<th>取送员</th>
						<th>取送服务商</th>
						<th>所属门店 | 智柜</th>
						<th>订单状态</th>
						<th>付款状态</th>
						<th>金额</th>
						<th>操作</th>
					</tr>
				</thead>
				<tr class="tr-content"
				    v-if="!tableData.list || tableData.list.length == 0">
					<td colspan="20"
					    style="text-align: center">暂无数据</td>
				</tr>

				<tbody v-for="item in tableData.list"
				       :key="item.id">
					<tr>
						<td colspan="11"></td>
					</tr>
					<tr class="tr-th">
						<td colspan="13">
							<p class="dis-inline w m-r text-black">{{item.originText}} - {{item.takeModeText}}</p>
							<p class="dis-inline m-r-xl">
								<span class="text-muted">订单号：</span>
								<router-link :to="'/order/list/detail/'+item.id"
														 class="text-primary" target="_blank">{{item.orderNo}}</router-link>
							</p>
							<p class="dis-inline m-r-xl">下单件数：{{item.createCnt || 0}} <template v-if="item.businessStr">({{item.businessStr}})</template></p>
							<p class="dis-inline" v-if="item.unionId"><span class="group-ico">团</span>{{item.unionName}}</p>
							<span class="pull-right" style="margin-right:10px;">
								<span v-if="item.isEnableDestroy">
									<auth perm="order.list.destroy">
										<el-button type="text" @click="destroy(item)" class="text-danger" style="padding: 0">作废</el-button>
										-
									</auth>
								</span>
								<auth perm="order.list.remark">
									<el-button type="text" @click="mercRemark(item)" style="padding: 0">备注</el-button>
								</auth>
							</span>
						</td>
					</tr>
					<tr class="tr-content">
						<!-- <td>
							<div>
								<p>{{item.userName || item.userRemark}}</p>
								<p>
									<a target="_blank"
									   :href="'/client/list/'+item.userId+'/basic'"
									   class="text-primary">{{item.userPhone || ''}}</a>
								</p>
								<p class="dis-inline text-space" v-if="item.userUnionName!==null"><span class="group-ico">团</span>{{item.userUnionName}}</p>
							</div>
						</td> -->
						<td>
							<div>{{item.createTime | getDate(item.createTime) }}</div>
							<div>{{item.createTime | getTime(item.createTime) }}</div>
						</td>
						<td>
							<div v-if="item.takeLng"> {{item.takeLng}},{{item.takeLat}}</div>
							<div>
								<span v-for="work in item.waitWorkList">
									<a target="_blank"
									   :href="'/worker/detail/'+work.workId"
									   class="text-primary">{{work.name}}</a> | </span>
								<template v-if="item.waitWorkList != null && item.waitWorkList.length == 0" ><span class="text-muted">不在取送范围内</span></template>
							</div>
						</td>
						<td>
							<div style="padding: 3px;border: 1px dashed #167efb;" v-if="item.takeMode ==2">
								<p>{{(item.takePhone ||'')}} &nbsp; {{(item.takeName || '')}}</p>
								<p>{{(item.takeAddress || '')}}<template v-if="item.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(0, item)"> - 修改</a></auth></template></p>
								<p>取件时间：{{item.takeDate}} &nbsp;{{item.takeTimeStart}}-{{item.takeTimeEnd}}<template v-if="item.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0, item)"> - 修改</a></auth></template></p>
							</div>
							<div style="margin-top: 5px;padding: 3px;border: 1px dashed #3dc700;" v-if="item.sendMode ==2">
								<p>{{(item.sendPhone ||'')}} &nbsp; {{(item.sendName || '')}}</p>
								<p>{{(item.sendAddress || '')}} <template v-if="item.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(1, item)"> - 修改</a></auth></template></p>
								<p>送件时间：{{item.sendDate}} &nbsp;{{item.sendTimeStart}}-{{item.sendTimeEnd}}<template v-if="item.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(1, item)"> - 修改</a></auth></template></p>
							</div>
						</td>
						<td style="max-width:140px;">
							<div class="m-r-sm m-b-sm item-tag" v-for="tag in item.tags" :key="tag.id">{{tag.name}}</div>
						</td>
						<td>
							<div class="text-xs" v-if="item.takeMode == 2">
								<span class="tx ts-icon">取</span>
								<span>{{item.takeWorkName || "未指派"}}</span>
								<span v-if="!item.takeExpressType && item.statusVal < 5"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(0, item)">指派</a></auth></span>
							</div>
							<div class="text-xs m-t-xs" v-if="item.sendMode == 2">
								<span class="sx ts-icon">送</span>
								<span>{{item.sendWorkName || "未指派"}}</span>
								<span v-if="!item.sendExpressType && item.statusVal < 41"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(1, item)">指派</a></auth></span>
							</div>
						</td>
						<td>
							<div class="text-xs" v-if="item.takeMode == 2">
								<span class="tx ts-icon">取</span>
								<template v-if="item.takeExpressType">
									{{item.takeExpressType | getValText('EXPRESS_TYPE')}}：{{item.takeExpressNo}}
								</template>
								<template v-else>
									未指派<span v-if="item.statusVal < 5"><auth perm="order.list.assign"> - <a class="text-primary" @click="showExpress(1, item)">指派</a></auth></span>
								</template>
							</div>
							<div class="text-xs m-t-xs" v-if="item.sendMode == 2">
								<span class="sx ts-icon">送</span>
								<template v-if="item.sendExpressType">
									{{item.sendExpressType | getValText('EXPRESS_TYPE')}}：{{item.sendExpressNo}}
								</template>
								<template v-else>
									未指派
								</template>
							</div>
						</td>
						<td>
							<div>
								<a target="_blank"
								   :href="'/store/info/'+item.storeId"
								   class="text-primary">{{item.storeName || ''}}</a>
							</div>
							<div></div>
						</td>
						<td>
							<!--订单状态-->
							<div :class="(item.statusVal===3 || item.statusVal===47 || item.statusVal===29 || item.statusVal===50) ? 'text-success' :''">{{item.statusText}}</div>
						</td>
						<td>
							<div :class="item.payStatus != 1 ? 'text-danger' : 'text-success'">{{item.payStatusText}}<span class="bg-danger ts-icon" v-if="item.creditStatus == 1">赊</span></div>
						</td>
						<td colspan="2">
							<div>{{item.paymentPrice | amtFormat}} <span class="bg-danger ts-icon" style="margin-left: 5px" v-if="item.isModifyPrice">改</span></div>
						</td>
					</tr>
					<tr class="tr-tip"
					    v-show="item.userRemark || item.remark || (item.rList && item.rList.length > 0)">
						<td colspan="12">
							<span class="m-r-lg text-warning light"
							   v-if="item.userRemark" style="font-size:10px;">用户：{{item.userRemark || '-'}}</span>
							<span class="text-danger light"
							   v-if="item.remark" style="font-size:10px;">管理：{{item.remark || '-'}}</span>
							<span class="text-danger light"
										v-if="item.rList && item.rList.length > 0" style="font-size:10px;">
								管理：<template v-for="r in item.rList">{{r.remark}}<span class="text-muted">【{{r.workName}}】</span> </template>
							</span>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="text-right m-t-sm">
				<el-pagination class="pull-right"
					:page-size="tableData.pagination.size"
					layout="total, prev, pager, next"
					:total="tableData.pagination.total"
					@current-change="handleCurrentChange" >
				</el-pagination>
		  </div>
		</div>

			<!-- 指定派送收人员弹窗 -->
		<el-dialog :title="editStatus?'请指定送件员':'请指定收件员'" :visible.sync="personbox" :lock-scroll='false'>
			<div class="scrollbox">
				<div class="staff-item" @click="checkedStaff(item)" :class="{selected:item.checked}" v-for="(item,index) in staffList" :key="index">
					<div class="user-logo">
						<img :src="item.imgPath?item.imgPath:'/static/img/user/def.png'" alt="">
						<div class="mask text-center">
							<i class="el-icon-check text-xl"></i>
						</div>
					</div>
					<p class="text-center">
						<span class="name">{{item.name}}</span>
					</p>
				</div>
			</div>
			<div class="footer text-right" slot="footer">
				<el-button @click="personbox = false">取消</el-button>
				<el-button type="primary" @click="subStaff">确认</el-button>
			</div>
		</el-dialog>

			<!-- 地址修改弹窗 -->
		<el-dialog :title="editAddress?'请选择送件地址':'请选择取件地址'" :visible.sync="addressbox" :lock-scroll='false'>
		 <div class="scrollbox">
			<el-row :gutter="0" class="b-b">
				<el-col :span="4"><div class="grid-content">联系人</div></el-col>
				<el-col :span="6"><div class="grid-content">手机/电话</div></el-col>
				<el-col :span="6"><div class="grid-content">地址</div></el-col>
				<el-col :span="8"><div class="grid-content">详细地址</div></el-col>
			</el-row>
			<el-row class="b-b" :gutter="0" v-for="(item,index) in addressList" :key="index" @click.native="checkedAddress(item)">
					<el-col :span="4"><div class="grid-content">{{item.name}}</div></el-col>
					<el-col :span="6"><div class="grid-content"><span>{{item.phone}}</span></div></el-col>
					<el-col :span="6"><div class="grid-content">{{item.regionalDesc}}</div></el-col>
					<el-col :span="6"><div class="grid-content">{{item.detail}}</div></el-col>
					<el-col :span="2"><div class="grid-content"><i class="el-icon-circle-check" :class="item.checked?'text-success':' text-muted'"></i></div></el-col>
			</el-row>
		 </div>
			 <div class="footer text-right" slot="footer">
				<el-button @click="addressbox = false">取消</el-button>
				<el-button type="primary" @click="subAddress">确认</el-button>
			</div>
		</el-dialog>

			<!-- 时间弹窗 -->
		<el-dialog :title="editTime?'请选择送件时间':'请选择取件时间'" :visible.sync="timebox" :lock-scroll='false'>
			<div class="timebox">
				<div class="m-b-md">
					<span class="time-item" :class="{'selected':selectedTimes.dayIndex == index}" v-for="(item,index) in daysList" :key="index" @click="selectedDay(item,index)">{{item}}</span>
				</div>
				<div>
					<span class="time-item" :class="{'disable':(!item.status || timeIsLapse(item)),'selected':selectedTimes.id == item.id}" v-for="(item,index) in timeBoxList" :key="index" @click="selectedTimeSlot(item)">{{item.timeStart}}-{{item.timeEnd}}</span>
				</div>
			</div>
			 <div class="footer text-right" slot="footer">
				<el-button @click="timebox = false">取消</el-button>
				<el-button type="primary"  @click="subTimes">确认</el-button>
			</div>
		</el-dialog>

		<!-- 指定取送服务商 -->
		<el-dialog :title="expressMode==1?'指定取件服务商':'指定送件服务商'" :visible.sync="expressbox" :lock-scroll='false'>

			<div class="scrollbox">
				<div class="staff-item" @click="checkedExpress(item)" :class="{selected:item.checked}" v-for="(item,index) in expressList" :key="index">
					<div class="user-logo">
						<img src="/static/img/marketing/sf_logo.png" alt="">
						<div class="mask text-center">
							<i class="el-icon-check text-xl"></i>
						</div>
					</div>
					<p class="text-center">
						<span class="name">{{item.type | getValText('EXPRESS_TYPE')}}</span>
					</p>
				</div>
				<div v-if="expressObj">
					<el-form label-width="170px">
						<!--<p class="text-center">-->
							<!--<span class="name">收件人：{{expressObj.pickupName}} {{expressObj.pickupPhone}}</span>-->
						<!--</p>-->
						<!--<p class="text-center">-->
							<!--<span class="name">收件地址：{{expressObj.pickupRegionalDesc}} {{expressObj.pickupDetail}}</span>-->
						<!--</p>-->
						<el-form-item class="m-b-none" label="收件人：">
							<span class="name">{{expressObj.pickupName}} {{expressObj.pickupPhone}}</span>
						</el-form-item>
						<el-form-item class="m-b-none" label="收件地址：">
							<span class="name">{{expressObj.pickupRegionalDesc}} {{expressObj.pickupDetail}}</span>
						</el-form-item>
						<el-form-item class="m-b-none" label="备注：">
							<div class="w-xxl">
								<el-input type="textarea"
													:autosize="{ minRows: 4, maxRows: 6}"
													v-model="expressRemark"
													auto-complete="off"></el-input>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="footer text-right" slot="footer">
				<el-button @click="expressbox = false">取消</el-button>
				<el-button type="primary" @click="subExpress">确认</el-button>
			</div>
		</el-dialog>

		<!-- 管理备注-->
		<el-dialog class="ukao-dialog"
		           title="备注"
		           :visible.sync="remarkDialog.visible"
		           size="small">
			<div>
				<el-form :model="remarkDialog.ruleForm"
				         ref="remarkDialog.ruleForm"
				         label-width="160px">

					<el-form-item label="用户:">
						<div>
							<p v-if="remarkDialog.ruleForm.userRemark"
							   class="w-lg text-warning ">{{remarkDialog.ruleForm.userRemark || '未备注'}}</p>
							<p v-else
							   class="text-muted">未备注</p>
						</div>
					</el-form-item>

					<el-form-item label="管理"
					              prop="remark"
					              :rules="[
							{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input type="textarea"
							          :autosize="{ minRows: 4, maxRows: 6}"
							          v-model="remarkDialog.ruleForm.remark"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="remarkDialog.visible=false">取消</el-button>
						<el-button type="primary"
						           @click="mercRemarkSave('remarkDialog.ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end管理备注-->

		<!-- 订单作废-->
		<el-dialog class="ukao-dialog"
		           title="订单作废"
		           :visible.sync="destroyDialog.visible"
		           size="small">
			<div>
				<el-form :model="destroyDialog.ruleForm"
				         ref="destroyDialog.ruleForm"
				         label-width="160px">
					<div class="w-full m-b-sm m-l-xxl">
						{{destroyDialog.msg}}
					</div>
					<el-form-item label="作废备注"
					              prop="remark"
					              :rules="[
						  { required: true, message: '请输入作废内容', trigger: 'blur' },
							{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input type="textarea"
							          :autosize="{ minRows: 4, maxRows: 6}"
							          v-model="destroyDialog.ruleForm.remark"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="destroyDialog.visible=false">取消</el-button>
						<el-button type="primary"
						           @click="destroySave('destroyDialog.ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end订单作废-->
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from "@/utils/msg";
  import base from '@/utils/helpers/base'
  import time from '@/utils/helpers/timeLite'
	import vListTop from '@/app/Pages/Client/List/listtop';
	import vListTabNav from '@/app/Pages/Client/List/listtabnav';

	export default {
		components: {
			vListTop, vListTabNav
		},
		data: function() {
			return {
				loading: true,
				tableData: {
					list: [],
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0
					},
					userId: this.$route.params.id
				},
				addressList:[],  //地址列表
				takeTimeList:[],  //取件时间段列表
				sendTimeList:[],  //送件时间段列表
				timeBoxList:[],  //时间选择弹窗的时间段列表
				daysList:null, //天列表
				staffList:[],  //取送人员列表
				expressList:[],			// 服务商列表

				editStatus:0, //修改人员状态 0：收件员  1：送件员
				personbox:false, //是否显示选人弹窗
				addressbox:false, //是否显示地址选择弹窗
				timebox: false, //是否显示时间选择弹窗
				expressbox:false,		// 是否显示选择服务商列表
				editAddress:0, //修改地址状态 0：取件地址  1：送件地址

				editTime:0,  //修改时间  0:取件时间   1：送件时间
				selectedTimes:{ //选择的时间
					day:'',
					date:'',
					dayIndex:0,
					timeStart:'',
					timeEnd:'',
					id:0, //时间段id
				},
				expressMode: null, // 取送模式 1：收件  1：送件
				expressObj: null, // 当前选中的服务商

				remarkDialog: {
					visible: false,
					ruleForm: {
						id: "",
						userRemark: "",
						remark: ""
					}
				},
				destroyDialog: {
        //作废
					visible: false,
					msg: "",
					ruleForm: {
						id: "",
						remark: ""
					}
				},
      }
    },
		created () {
			this.list()
    },
		methods: {
			
			list (start) {
				this.loading = true;
				this.$store.dispatch('post', {
					uri : 'orderInfo/list',
					data: {
						startRow: start| 0,
						userId: this.tableData.userId || 0,
						pageSize: this.tableData.pagination.size,
					}
				}).then((res) =>{
				  const _this = this
					const list = res.data.data.list || []
					list.forEach(function (item) {
					  if(item.productCnt) {
              _this.proList(item)
						}
						if(item.business) {
							let bList = JSON.parse(item.business);
							let tmpList = [];
							bList.forEach(function (item) {
								tmpList.push(item.name)
							});
							item.businessStr = tmpList.join('/')
						}
            if (item.remarkJson) {
              let rJson = JSON.parse(item.remarkJson);
              let rList = [];
              rJson.forEach(function (ri) {
                rList.push(ri)
              });
              item.rList = rList;
            }
          });
					if(list.length>0){
						this.getTags(list);
					}
					setTimeout(() => {
						this.tableData.pagination.total = res.data.data.total || 0
						this.tableData.list = list
						this.loading = false;
					}, 800);
				})
			},
			getTags(Arr){
					let userIds=[];
					let ArrId=Arr;
					for(let i=0;i<ArrId.length;i++){
						userIds.push(ArrId[i].userId);
					}
					this.$store.dispatch('post',{
						uri:'userTagRel/queryUserTagList',
						data:{
							userIds:userIds.join(',')
						}
					}).then(res=>{
						let tagArr = res.data.data;
						let list = Arr;
						let _this = this;

						list.forEach(function(item){
							if (tagArr[item.userId]) {
								_this.$set(item, "tags", tagArr[item.userId]);
							}
						});
					})
			},

				// 开始选择收送件地址
				startCheckAddress(i, item){
					let _this = this
					_this.orderInfo = item
					_this.getAddressList(function () {
						_this.editAddress = i;
						_this.addressbox = true;
						_this.selectedAddress = null;
						_this.addressList.forEach(item=>{
							item.checked = false;
						})
					})
			},
				// 获取地址列表
		getAddressList(fn){
			this.$store.dispatch('get',{
				uri:'userAddress/list',
				params:{
					userId:this.orderInfo.userId
				}
			}).then(res=>{
				this.addressList = res.data.data.list;
				this.addressList.forEach(item=>{
					this.$set(item,'checked',false);
				})
				if(typeof (fn) === 'function'){
				  fn()
				}
			})
		},
			// 选取地址
		checkedAddress(val){
			val.checked = !val.checked;
			this.addressList.forEach(item=>{
				if(item.checked && item.id !=val.id) item.checked = false;
			})
			this.selectedAddress = val.checked? val:null;
		},
			// 提交地址
		subAddress(){
			if(this.selectedAddress){
				let uri = this.editAddress ? 'orderExt/updateSendAddress':'orderExt/updateTakeAddress';
				this.$store.dispatch('post',{
					uri,
					params:{
						id:this.orderInfo.id,
						addressId:this.selectedAddress.id
					}
				}).then(res=>{
					this.addressbox = false;
					msg.success()
				 this.list();
				})
			}else{
				msg.error('请选择地址');
			}
		},

			// 获取可指派的人员
		getStaffList(storeId, fn){
			this.$store.dispatch('get',{
				uri:'workerInfo/takeAndSend/list',
				data:{
					storeId: storeId
				}
			}).then(res=>{
				this.staffList = res.data.data || [];
				this.staffList.forEach(item=>{
					this.$set(item,'checked',false)
				})
				if(typeof (fn) === 'function'){
					fn()
				}
			})
		},
		// 开始选择收送件人员
	startCheckStaff(i, item){
    let _this = this
		_this.orderInfo = item
		_this.getStaffList(item.storeId, function () {
			_this.editStatus = i;
			_this.personbox = true;
			if(i){
				_this.staffList.forEach(item=>{
				 item.checked = (item.id == _this.orderInfo.sendWorkId) ? true: false;
				 if(item.checked){
					 _this.selectedStaff = item;
				}
			})
			} else{
				_this.staffList.forEach(item=>{
					item.checked = (item.id == _this.orderInfo.takeWorkId) ? true: false;
					if(item.checked){
						_this.selectedStaff = item;
					}
				})
			}
		})
	},
	// 选取人员
	checkedStaff(val){
		this.staffList.forEach(item=>{
			if(item.checked) item.checked = false;
		})
		val.checked = true;
		this.selectedStaff = val;
	},
		// 提交修改的人员信息
	subStaff(){
		 let id = this.editStatus ? this.orderInfo.sendWorkId : this.orderInfo.takeWorkId;
		 if(this.selectedStaff.id != id){
			 let uri = this.editStatus ? 'orderExt/assignSendWork':'orderExt/assignTakeWork';
			 this.$store.dispatch('post',{
				 uri,
				 data:{
					 id:this.orderInfo.id,
					 workId:this.selectedStaff.id
				 }
			 }).then(res=>{
				 this.personbox = false;
				 msg.success()
				 this.list();
			 })
		 }else{
			 this.personbox = false;
		 }
 		},
		 // 开始修改时间
		startCheckTime(i, item){
		  this.orderInfo = item
			this.editTime = i;
			this.selectedTimes = {
				day:'',
				date:'',
				dayIndex:0,
				timeStart:'',
				timeEnd:'',
				id:0, //时间段id
			}
			if(this.editTime && !this.sendTimeList.length){
				this.getSendTimeList().then(_=>{
					this.setDayList();
					this.timeBoxList = this.sendTimeList;
				});
			}else if(!this.takeTimeList.length){
				this.getTakeTimeList().then(_=>{
					this.setDayList();
					this.timeBoxList = this.takeTimeList;
				});
			}else{
				 this.timeBoxList = this.editTime ? this.sendTimeList : this.takeTimeList;
			}
			this.timebox = true;
		},
			// 设置日期数组
		setDayList(){
			if(!this.daysList){
				this.daysList = Array.apply(null,Array(20)).map((item,i)=>{
					return new Date(this.timer+1000*60*60*24*i).getMonth()+1+ '-' + new Date(this.timer+1000*60*60*24*i).getDate();
				});
			}
		},
		// 时间段是否失效
		timeIsLapse(item){
			return this.selectedTimes.dayIndex == 0 && (new Date(this.timer).getHours()+1) >= parseInt(item.timeEnd);
		},
		// 选择日期
		selectedDay(val,index){
			this.selectedTimes.day = val;
			this.selectedTimes.date = new Date(this.timer+1000*60*60*24*index).getFullYear()+'-'+val;
			this.selectedTimes.dayIndex = index;
			if(index == 0){
				this.selectedTimes.id = 0;
			}
		},
		// 选择时间段
		selectedTimeSlot(item){
			if(item.status && !this.timeIsLapse(item)){
				this.selectedTimes.timeStart = item.timeStart;
				this.selectedTimes.timeEnd = item.timeEnd;
				this.selectedTimes.id = item.id;
			}
		},
		// 提交时间
		subTimes(){
			if(this.selectedTimes.id){
				if(!this.selectedTimes.date) this.selectedTimes.date = new Date(this.timer).getFullYear()+'-'+this.daysList[0];
				let uri = this.editTime ? 'orderExt/updateSendDate':'orderExt/updateTakeDate';
				this.$store.dispatch('post',{
					uri,
					data:{
						id:this.orderInfo.id,
						date : this.selectedTimes.date,
						timeStart : this.selectedTimes.timeStart,
						timeEnd : this.selectedTimes.timeEnd,
					}
				}).then(res=>{
					if(this.editTime){
						this.orderInfo.sendDate = this.selectedTimes.date;
						this.orderInfo.sendTimeStart = this.selectedTimes.timeStart;
						this.orderInfo.sendTimeEnd = this.selectedTimes.timeEnd;
					}else{
						this.orderInfo.takeDate = this.selectedTimes.date;
						this.orderInfo.takeTimeStart = this.selectedTimes.timeStart;
						this.orderInfo.takeTimeEnd = this.selectedTimes.timeEnd;
					}
					msg.success();
					this.timebox = false;
				})
			}else{
				msg.error('请选择时间日期');
			}
		},
		getTakeTimeList(){
			return this.$store.dispatch('get',{
				uri:'serviceTime/take/list',
				params:{
					cityId:this.orderInfo.cityId
				}
			}).then(res=>{
				this.takeTimeList = res.data.data || [];
				this.timer = res.data.timestamp;
			})
		},
		getSendTimeList(){
			return this.$store.dispatch('get',{
				uri:'serviceTime/send/list',
				 params:{
					cityId:this.orderInfo.cityId
				}
			}).then(res=>{
				this.sendTimeList = res.data.data || [];
				this.timer = res.data.timestamp;
			})
		},
		queryExpressList(cityId, fn) {
      this.$store.dispatch('post',{
        uri:'expressParam/list',
        data:{
          cityId: cityId
        }
      }).then(res=>{
        this.expressList = res.data.data.list || [];
        this.expressList.forEach(item=>{
          this.$set(item,'checked',false)
        });
        if(typeof (fn) === 'function'){
          fn()
        }
      })
		},
		showExpress(mode, item) {
      let _this = this;
      _this.orderInfo = item;
			_this.expressMode = mode;
			_this.expressObj = null;
			_this.queryExpressList(item.cityId, function () {
        _this.expressbox = true;
			});
    },
		subExpress() {
			let uri = this.expressMode == 1 ? 'expressInfo/assignTake':'';
			this.$store.dispatch('post',{
				uri,
				data:{
					orderId: this.orderInfo.id,
          type: this.expressObj.type,
					remark: this.expressRemark
				}
			}).then(res=>{
				this.expressbox = false;
				msg.success()
				this.list();
			})
		},
		// 选取人员
    checkedExpress(val){
      this.expressList.forEach(item=>{
        if(item.checked) item.checked = false;
      })
      val.checked = true;
      this.expressObj = val;
      if (!this.expressRemark) {
        this.expressRemark = this.expressObj.remark;
			}
    },
		mercRemark(item) {
      this.remarkDialog.ruleForm.id = item.id || "";
      this.remarkDialog.ruleForm.remark = item.remark || "";
      this.remarkDialog.ruleForm.userRemark = item.userRemark || "";
      this.remarkDialog.visible = true;
    },
		mercRemarkSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "orderExt/addRemark",
              data: {
                id: this.remarkDialog.ruleForm.id,
                remark: this.remarkDialog.ruleForm.remark
              }
            })
            .then(res => {
              this.remarkDialog.visible = false;
              msg.success();
              this.list();
            });
        } else {
          return false;
        }
      });
    },
		destroy(item) {
      var _this = this;
      _this.destroyDialog.msg =
        "此操作将订单【" + item.orderNo + "】永久作废, 是否继续?";
      _this.destroyDialog.visible = true;
      _this.destroyDialog.ruleForm.id = item.id;
    },
    destroySave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "orderInfo/destroy",
              data: {
                id: this.destroyDialog.ruleForm.id,
                remark: this.destroyDialog.ruleForm.remark
              }
            })
            .then(res => {
              this.destroyDialog.visible = false;
              msg.success();
              this.list();
            });
        }
      });
    },

		proList(order){
			this.$store.dispatch('post', {
				uri : 'orderProductRel/orderProList',
				data:{
					orderId:order.id
				}
			}).then((res) =>{
				order.proList = res.data.data || []
			})
		},
			handleCurrentChange (val){
				this.list((val-1) * this.tableData.pagination.size)
			},
    }
	}
</script>

<style scoped lang="less">
	.filter-list li {
		float: left;
		width: 320px; 
		margin-right: 30px;
		margin-bottom: 10px;
	}

	.order-detail {
		position: relative;
	}
	.order-detail .num {
		float: right;
		width: 45px;
		text-align: left;
	}
	.order-detail .content {
		margin-right: 60px;
		overflow: hidden;
	}
	.order-detail .content .text {
		margin-left: 60px;
	}

	.order-state {
		position: relative;
	}
	.order-state > img {
		position: absolute;
		right: 0;
		top: 0;
	}
	.time-item{
   display: inline-block;
   line-height: 30px;
   padding: 0 10px;
   margin-right: 10px;
   border: 1px solid #ccc;
   margin-bottom: 10px;
   cursor: pointer;
   &.disable{
     background-color: #ccc;
     color:#fff;
     cursor:no-drop;
   }
   &.selected{
     background-color: #27c24c;
     border-color: #27c24c;
     color: #fff;
   }
 }

	.scrollbox{
   max-height: 450px;
   overflow-y: auto;
 }
	.grid-content{
	    height: 100%;
	    line-height: 34px;
	    cursor: pointer;
	  }
	  .staff-item {
	    width: 90px;
	    cursor: pointer;
	    margin: 20px 10px 0;
	    vertical-align: top;
	    display: inline-block;
	    .user-logo {
	      margin: 0 auto;
	      width: 80px;
	      height: 80px;
	      border-radius: 50%;
	      overflow: hidden;
	      position: relative;
	      img {
	        width: 100%;
	      }
	      .mask {
	        position: absolute;
	        left: 0;
	        top: 0;
	        width: 100%;
	        line-height: 80px;
	        display: none;
	        background-color: rgba(0, 0, 0, .1);
	        .el-icon-check {
	          color: #fff;
	        }
	      }
	    }
	    .name {
	      margin-top: 5px;
	      line-height: 28px;
	      display: inline-block;
	      padding: 0 15px;
	      border-radius: 14px;
	      border: 1px solid transparent;
	      max-width: 90px;
	    }
	    &.selected {
	      .name {
	        background-color: #d5e5ff;
	        border-color: #20a0ff;
	        color: #20a0ff;
	      }
	      .mask {
	        display: block;
	      }
	    }
	  }
	.group-ico{
		color: #fff;background: #9a74f4; border-radius: 100%;padding: 2px;
		font-size: 12px;
	}
	.text-space{
		max-width: 120px;
		overflow: hidden; 
		text-overflow:ellipsis; 
		white-space: nowrap;
	}
	.item-tag{
		padding: 0px 5px;
		display:inline-block;
		max-width:133px;
		min-width: 35px;
		white-space:normal;
		min-height: 20px;
		line-height: 19px;
		font-size: 12px;
		border-radius: 4px;
		box-sizing: border-box;
		color: #20a0ff;
		border: 1px solid transparent;
		border-color: rgba(32,160,255,.2);
		background-color: rgba(32,160,255,.1);
	}
</style>