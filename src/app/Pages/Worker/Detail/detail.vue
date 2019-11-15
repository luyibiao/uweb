<template>
	<div>
		<table class="ukao-table" style="width: 100%" v-if="workerInfo">
			<tbody>
				<tr>
					<td style="width: 30%; color:#000;">基本信息</td>
					<td></td>
					<td style="width: 20%">
						<template v-if="workerInfo.roleId!=1 && workerInfo.roleId!=2 && workerInfo.roleId!=7 && workerInfo.roleId!=8 && workerInfo.roleId!=10">
							<auth perm="worker.list.update">
								<el-button type="danger" @click="deleteStaffInfo" >删除该员工</el-button>
							</auth>
						</template>
					</td>
				</tr>
				<tr>
					<td>头像</td>
					<td>
						<img class="thumb-md" :src="workerInfo.imgPath || '/static/img/work/def.png'" alt="">
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-button @click="modify('imgPath', '头像')" >修改</el-button>
						</auth>
					</td>
				</tr>
				<tr>
					<td>姓名</td>
					<td>{{workerInfo.name}}</td>
					<td><auth perm="worker.list.update"><el-button @click="modify('name', '姓名')">修改</el-button></auth></td>
				</tr>
				<tr>
					<td>手机号</td>
					<td>{{workerInfo.phone}}</td>
					<td><auth perm="worker.list.update"><el-button @click="modify('phone', '手机号')">修改</el-button></auth></td>
				</tr>
				<tr>
					<td>登录账号</td>
					<td>{{workerInfo.workAccount}}</td>
					<td></td>
				</tr>
				<tr>
					<td>登录密码</td>
					<td>******</td>
					<td><auth perm="worker.list.update"><el-button @click="modifyAcc('ruleFormAccount')">修改</el-button></auth></td>
				</tr>
				<tr>
					<td>状态</td>
					<td>
						<span v-if="workerInfo.status == 1" class="text-success">已启用</span>
						<span v-else class="text-danger">已停用</span>
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-switch v-model="statusVal"
								active-color="#13ce66" inactive-color="#dcdcdc"
								on-text="已启用"  off-text="未启用"  :width="74" @change="changeStatusVal">
							</el-switch>
						</auth>
					</td>
				</tr>
				<tr v-if="workerInfo.roleType == 2">
					<td>所属门店</td>
					<td>
							{{workerInfo.workStore}}
					</td>
					<td>
						<auth perm="worker.list.update">
							<!-- 此处修改门店，工厂，角色可能造成数据问题， 暂时不允许修改-->
							<el-button @click="modifyStore('store', '所属门店')">修改</el-button>
						</auth>
					</td>
				</tr>
				<tr v-if="workerInfo.roleId == 3 || workerInfo.wapExtend == 1">
					<td>所属智柜</td>
					<td>
						{{workerInfo.workCupboard}}
					</td>
					<td>
							<!-- 此处修改门店，工厂，角色可能造成数据问题， 暂时不允许修改-->
							<el-button @click="modifyCupboard('cupboard', '所属智柜')">修改</el-button>
					</td>
				</tr>

				<tr v-if="workerInfo.roleType == 3">
					<td>所属工厂</td>
					<td>
							{{workerInfo.workFactory}}
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-button @click="modifyFactory('factory', '所属工厂')">修改</el-button>
						</auth>
					</td>
				</tr>
				<tr v-if="workerInfo.roleType == 6">
					<td>所属中转站</td>
					<td>
						{{workerInfo.workTransfer}}
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-button @click="modifyTransfer('transfer', '所属中转站')">修改</el-button>
						</auth>
					</td>
				</tr>

				<tr v-if="workerInfo.roleId == 3 || workerInfo.wapExtend == 1">
					<td>取送员智柜管理权限</td>
					<td>
						<span v-if="workerInfo.isOpenBox == 1" class="text-success">允许</span>
						<span v-else  class="text-danger">不允许</span>
						<p class="text-muted">该取送员可以任意打开已绑定智柜的箱格</p>
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-switch v-model="isOpenBox"
												 active-color="#13ce66" inactive-color="#dcdcdc"
												 on-text="允许"  off-text="不允许"  :width="74" @change="changeIsOpenBox">
							</el-switch>
						</auth>
					</td>
				</tr>

				<tr>
					<td>角色</td>
					<td>{{workerInfo.roleName}}</td>
					<td>
						<!--<el-button  @click="modifyRole('role', '角色')">修改</el-button>-->
					</td>
				</tr>
				<tr>
					<td>RFID工卡</td>
					<td>
						<div v-if="workerInfo.isBinding == 1" class="text-success"> 已绑定 - {{workerInfo.rfidNo}} </div>
						<div v-else class="text-danger"> 未绑定</div>
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-button @click="RfidOperation">{{workerInfo.isBinding ? '解绑':'绑定'}}</el-button>
						</auth>
					</td>
				</tr>
				<tr>
					<td>创建时间</td>
					<td>{{workerInfo.createTime | getDate}}&nbsp;{{workerInfo.createTime | getTime}}</td>
					<td></td>
				</tr>
				<tr v-if="workerInfo.roleId === 3 || workerInfo.wapExtend == 1">
					<td>取送提成</td>
					<td v-if="!workerInfo.profits" class="text-danger">未设置</td>
					<td v-else>
						<p v-if="workerInfo.profits.takeType === 1">取件：{{workerInfo.profits.take / 100}}%（订单实付金额）</p>
						<p v-else>取件：{{workerInfo.profits.take | amtFormat}}元/单</p>
						<p v-if="workerInfo.profits.sendType === 1">送件：{{workerInfo.profits.send / 100}}%（订单实付金额）</p>
						<p v-else>送件：{{workerInfo.profits.send | amtFormat}}元/单</p>
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-button @click="changeBrokerage(1)">修改</el-button>
						</auth>
					</td>
				</tr>

				<template v-if="workerInfo.roleId === 3 || workerInfo.roleId === 8 || workerInfo.roleId === 9 || workerInfo.roleId === 10 || workerInfo.roleId === 11">
					<tr>
						<td>收衣提成</td>
						<td v-if="!workerInfo.profits" class="text-danger">未设置</td>
						<td v-else>
							<p v-if="workerInfo.profits.pickupType === 1">订单实付金额：{{workerInfo.profits.pickup / 100}}%</p>
							<p v-else-if="workerInfo.profits.pickupType === 2">按订单数：{{workerInfo.profits.pickup | amtFormat}}元/单</p>
							<p v-else-if="workerInfo.profits.pickupType === 3">按收衣件数：{{workerInfo.profits.pickup | amtFormat}}元/件</p>
							<p v-else class="text-danger">未知的类型</p>
						</td>
						<td>
							<auth perm="worker.list.update">
								<el-button @click="changeBrokerage(2)">修改</el-button>
							</auth>
						</td>
					</tr>

					<tr>
						<td>入库提成</td>
						<td v-if="!workerInfo.profits" class="text-danger">未设置</td>
						<td v-else>
							<p v-if="workerInfo.profits.stockInType === 1">订单实付金额：{{workerInfo.profits.stockIn / 100}}%</p>
							<p v-else-if="workerInfo.profits.stockInType === 2">按订单数：{{workerInfo.profits.stockIn | amtFormat}}元/单</p>
							<p v-else-if="workerInfo.profits.stockInType === 3">按收衣件数：{{workerInfo.profits.stockIn | amtFormat}}元/件</p>
							<p v-else class="text-danger">未知的类型</p>
						</td>
						<td>
							<auth perm="worker.list.update">
								<el-button @click="changeBrokerage(3)">修改</el-button>
							</auth>
						</td>
					</tr>
				</template>

				<tr v-if="workerInfo.roleId === 3 || workerInfo.roleId === 10 || workerInfo.roleId === 11">
					<td>
						手持机
						<template v-if="workerInfo.roleId === 3">-店员功能</template>
						<template v-else>-取送员功能</template>
					</td>
					<td>
						<span v-if="workerInfo.wapExtend == 1" class="text-success">已开启</span>
						<span v-else class="text-danger">已关闭</span>
					</td>
					<td>
						<auth perm="worker.list.update">
							<el-switch v-model="workerInfo.wapExtend"
									 active-color="#13ce66" inactive-color="#dcdcdc" :active-value="1" :inactive-value="0"
									 :width="74" @change="changeWapExtend">
							</el-switch>
						</auth>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- 修改-->
		<el-dialog class="ukao-dialog"
			:title="dialog.formTitle"
			:visible.sync="dialogVisible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="姓名" prop="name" v-if="dialog.attr == 'name'" :rules="[
								{ required: true, message: '请填写姓名'},
								{ min: 1, max: 8, message: '请输入1至8位长度', trigger: 'blur'}
							]">
						<div class="w-lg">
							<el-input v-model="ruleForm.name"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="手机号" prop="phone" v-if="dialog.attr == 'phone'" :rules="[
							{ required: true, message: '请填写手机号'},
							{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.phone"></el-input>
						</div>
					</el-form-item>

					<!-- <el-form-item  label="角色"  prop="roleId"  v-if="dialog.attr == 'role'"  :rules="[
						{ required: true, message: '请选择员工角色'}
						]">
						<el-select v-if="roleList && roleList.length > 0" class="w-lg" filterable v-model="ruleForm.roleId" placeholder="请选择">
							<el-option
								v-for="item in roleList" :key="item.id"  :label="item.name"  :value="item.id">
							</el-option>
						</el-select>
					</el-form-item> -->

					<el-form-item  label="所属门店" prop="storeIds" v-if="dialog.attr == 'store'" :rules="[
							{ required: workerInfo.roleRequired == 1, message: '请选择门店'}
						]">
					<el-select  v-if="storeInfoList && storeInfoList.length > 0" class="w-lg" filterable v-model="form.storeIds" placeholder="请选择门店"
											multiple  filterable clearable @change="selectStore">
						<el-option
							v-for="item in storeInfoList" :key="item.id"  :label="item.name"  :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

					<el-form-item  label="所属智柜" prop="cupboardIds" v-if="dialog.attr == 'cupboard'" :rules="[
							{ required: workerInfo.roleRequired == 1, message: '请选择智柜'}
						]">
						<el-select  v-if="cupboardInfoList && cupboardInfoList.length > 0" class="w-lg" filterable v-model="form.cupboardIds" placeholder="请选择智柜"
												multiple  filterable clearable @change="selectCupboard">
							<el-option
								v-for="item in cupboardInfoList" :key="item.id"  :label="item.name"  :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item  label="所属工厂"  prop="factoryIds" v-if="dialog.attr == 'factory'" :rules="[
							{ required: workerInfo.roleRequired == 1, message: '请选择工厂'}
						]">
						<el-select v-if="factoryInfoList && factoryInfoList.length > 0" class="w-lg" filterable v-model="form.factoryIds" placeholder="请选择工厂"
											multiple filterable clearable @change="selectFactory">
							<el-option  
									v-for="item in factoryInfoList" :key="item.id"  :label="item.name"  :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item  label="所属中转站"  prop="transferIds" v-if="dialog.attr == 'transfer'" :rules="[
							{ required: workerInfo.roleRequired == 1, message: '请选择中转站'}
						]">
						<el-select v-if="transferInfoList && transferInfoList.length > 0" class="w-lg" filterable v-model="form.transferIds" placeholder="请选择中转站"
											 multiple filterable clearable @change="selectTransfer">
							<el-option
								v-for="item in transferInfoList" :key="item.id"  :label="item.name"  :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="" v-if="dialog.attr == 'imgPath'">
						<Uploader
							:path="workerInfo.imgPath"
							class="u-avatar-uploader"
							tip="尺寸为300像素*300像素，大小不超过2M"
							:beforeFn="beforeAvatarUpload"
							:successFn="handleAvatarSuccess"
							:errorFn="handleAvatarError"/>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialogVisible=false">取消</el-button>
						<el-button type="primary" :loading="dialog.loading" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>

		<!-- 修改密码-->
		<el-dialog class="ukao-dialog"
			title="修改密码"
			:visible.sync="dialogVisibleAccount"
			size="small">
			<div>
				<el-form :model="ruleFormAccount" ref="ruleFormAccount" label-width="150px">
					<el-form-item label="密码" prop="pwd" :rules="[
							{ required: true, message: '请填写登录密码'},
							{ min: 6, max: 16, message: '请输入6至16位长度', trigger: 'blur'},
						]">
						<div class="w-lg">
							<el-input type="password" v-model="ruleFormAccount.pwd"></el-input>
						</div>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialogVisibleAccount=false">取消</el-button>
						<el-button type="primary"  @click="submitFormAccount('ruleFormAccount')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- RFID卡操作弹框 -->
		<el-dialog class="ukao-dialog"
			:title="workerInfo && workerInfo.isBinding ? '解绑RFID卡' : '绑定RFID卡'"
			:visible.sync="cardFormVisible"
			size="small">
			<el-form :model="cardForm" ref="cardForm" v-if="workerInfo">
				<el-form-item label="RFID卡" prop="rfidNo" label-width="150px" :rules="[
						{ required: true, message: '请填写RFID卡'},
						{ type: 'number', message:'RFID卡必须为数字', trigger: 'blur'},
					]">
					<div class="w-lg">
						<el-input v-model.number="cardForm.rfidNo" placeholder="请输入RFID工卡号"></el-input>
					</div>
				</el-form-item>
				<el-form-item v-if="!workerInfo.isBinding" label="验证码" label-width="150px" prop="checkCode"  :rules="[
						{ required: true, message: '请填写验证码'}
					]">
					<div class="w-lg">
						<el-input class="w-lg" v-model="cardForm.checkCode" placeholder="请输入验证码"></el-input>
					</div>
				</el-form-item>
				<el-form-item label-width="150px">
					<el-button @click="cardFormVisible=false">取消</el-button>
					<el-button type="primary" @click="submitRfidOperation">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 提成弹窗 -->
		<el-dialog
			:title="brokerage.title"
			@close = "brokerage.loading = false"
			size="tiny"
			:visible.sync="brokerage.dialog">
			<el-form :ref="brokerage.refName" :model="brokerage" label-width="120px">
				<!-- 取送员-->
				<div v-if="brokerage.profit == 1">
					<el-form-item label="取件提成类型" required>
						<el-select class="w" v-model="brokerage.takeType">
							<el-option label="订单实付比例(%)" :value="1"></el-option>
							<el-option label="固定金额(元/单)" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="取件提成" prop="take" :rules="brokerage.takeRule">
						<el-input class="w" v-model="brokerage.take"></el-input>
					</el-form-item>
					<el-form-item label="送件提成类型" required>
						<el-select class="w" v-model="brokerage.sendType">
							<el-option label="订单实付比例(%)" :value="1"></el-option>
							<el-option label="固定金额(元/单)" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="送件提成" prop="send" :rules="brokerage.sendRule">
						<el-input class="w" v-model="brokerage.send" ></el-input>
					</el-form-item>
				</div>

				<!-- 店员，店长-->
				<div v-if="brokerage.profit == 2">
					<el-form-item label="收衣提成类型" required>
						<el-select class="w" v-model="brokerage.pickupType">
							<el-option label="订单实付比例(%)" :value="1"></el-option>
							<el-option label="按订单数(元/单)" :value="2"></el-option>
							<el-option label="按收衣件数(元/件)" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="收衣提成" prop="pickup" :rules="brokerage.pickupRule">
						<el-input class="w" v-model="brokerage.pickup" ></el-input>
					</el-form-item>
				</div>

				<div v-if="brokerage.profit == 3">
					<el-form-item label="入库提成类型" required>
						<el-select class="w" v-model="brokerage.stockInType">
							<el-option label="订单实付比例(%)" :value="1"></el-option>
							<el-option label="按订单数(元/单)" :value="2"></el-option>
							<el-option label="按收衣件数(元/件)" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="入库提成" prop="stockIn" :rules="brokerage.stockInRule">
						<el-input class="w" v-model="brokerage.stockIn" ></el-input>
					</el-form-item>
				</div>

				<el-form-item>				
					<el-button @click="brokerage.dialog = false">取消</el-button>
					<el-button type="primary" :loading="brokerage.loading" @click="subBrokerage">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'
	import md5 from '@/utils/md5'
	import validate from '@/utils/helpers/validate'
	import Uploader from '@/components/Uploader'
	import calculation from "@/utils/helpers/calculation";

	export default {
		// 员工信息
		props:['workerInfo'],
		components: {
			Uploader
		},
		data() {
			return {
				statusVal:false, //员工开启状态
				isOpenBox:false, //员工是否允许打开智柜
				storeInfoList: [],	//门店
				factoryInfoList: [],	//工厂
				transferInfoList: [],	//工厂
        cupboardInfoList: [],
				dialogVisible: false,
				dialogVisibleAccount: false,
				dialog: {
					formTitle: '',
					attr: '',
          loading: false
				},
				// 基本信息表单
				ruleForm: {
					id: '',
					name: '',
					phone: '',
					imgPath: '',
					storeIds: '',
					factoryIds: '',
          transferIds: '',
          cupboardIds:''
				},
				// 选择的门店和工厂
				form:{
					storeIds:[],
					factoryIds:[],
          transferIds:[],
          cupboardIds:[]
				},
				// 密码表单
				ruleFormAccount: {
				  id:'',
					pwd: '',
					password:''
				},
				// RFID卡
				cardFormVisible:false,
				cardForm:{
					rfidNo:'',
					checkCode:'',
				},
				// 营收比例提成
				brokerage:{
					roleId:0,	//角色
					profit:1,	//提成
					takeRule:[
						{required: true, message: '请输入提成' },
						{validator:(rule,value,callback)=>{
							this.checkBrokerage('takeType',value,callback);
						},trigger:'blur'}
					],//表单验证
					sendRule:[ 
						{required: true, message: '请输入提成' },
						{validator:(rule,value,callback)=>{
							this.checkBrokerage('sendType',value,callback);
						},trigger:'blur'}
					],//表单验证
					stockInRule:[
						{required: true, message: '请输入提成' },
						{validator:(rule,value,callback)=>{
							this.checkBrokerage('stockInType',value,callback);
						},trigger:'blur'}
					],//表单验证
          pickupRule:[
            {required: true, message: '请输入提成' },
            {validator:(rule,value,callback)=>{
              this.checkBrokerage('pickupType',value,callback);
            },trigger:'blur'}
          ],//表单验证

          takeType :1, //提成类型
          sendType :1, //提成类型
          take:0, //取
          send:0,//送

					stockInType:1, //入库类型
          stockIn:0, //入库

          pickupType:1, // 收衣类型
          pickup:0, // 收衣类型

					dialog: false, //弹窗状态
					title:'设置员工提成', //弹窗title
					refName:'brokerage',
					loading:false,
				}
				// roleList: [],	//角色
			}
		},
		methods: {
			getStoreInfoList (fn){
				this.$store.dispatch('post', {
					uri : 'storeInfo/queryForSelect',
					data: {cityId: this.workerInfo.cityId}
				}).then((res) =>{
					this.storeInfoList = res.data.data || []
					if(typeof (fn) === 'function'){
					  fn()
					}
				})
			},
			getFactoryInfoList (fn){
				this.$store.dispatch('post', {
					uri : 'factoryInfo/queryForSelect',
          data: {cityId: this.workerInfo.cityId}
				}).then((res) =>{
					this.factoryInfoList = res.data.data || []
					if(typeof (fn) === 'function'){
					  fn()
					}
				})
			},
      getTransferInfoList (fn){
        this.$store.dispatch('post', {
          uri : 'transferInfo/queryForSelect',
          data: {cityId: this.workerInfo.cityId}
        }).then((res) =>{
          this.transferInfoList = res.data.data || []
          if(typeof (fn) === 'function'){
            fn()
          }
        })
      },
			getCupboardInfoList (fn){
        this.$store.dispatch('post', {
          uri : 'cupboardInfo/queryForSelect',
          data: {cityId: this.workerInfo.cityId, status: 1}
        }).then((res) =>{
          this.cupboardInfoList = res.data.data || []
          if(typeof (fn) === 'function'){
            fn()
          }
        })
      },
			selectStore(val){
			  this.ruleForm.storeIds = val.join(',')
			},
			selectFactory(val){
			  this.ruleForm.factoryIds = val.join(',')
			},
			selectTransfer(val){
			  this.ruleForm.transferIds = val.join(',')
			},
			selectCupboard(val){
			  this.ruleForm.cupboardIds = val.join(',')
			},
			modifyStore (attr, title){
				if(this.storeInfoList.length > 0	){
					this.modify(attr, title)
				}else {
          this.getStoreInfoList(_=>{
            this.modify(attr, title)
          })
        }
			},
			modifyFactory (attr, title){
				if(this.factoryInfoList.length > 0	){
					this.modify(attr, title)
				}else {
          this.getFactoryInfoList(_=>{
            this.modify(attr, title)
          })
        }
			},
			modifyTransfer (attr, title){
				if(this.transferInfoList.length > 0	){
					this.modify(attr, title)
				}else {
          this.getTransferInfoList(_=>{
            this.modify(attr, title)
          })
        }
			},
      modifyCupboard (attr, title){
        if(this.cupboardInfoList.length > 0	){
          this.modify(attr, title)
        }else {
          this.getCupboardInfoList(_=>{
            this.modify(attr, title)
          })
        }
      },
			// 修改基本信息
			modify (attr, title){
				this.dialog.formTitle = '修改'+ title;
				this.dialog.attr = attr;
				this.dialogVisible = true;
				// 初始化表单
				this.ruleForm.id = this.workerInfo.id;
				this.ruleForm.name = this.workerInfo.name;
				this.ruleForm.phone = this.workerInfo.phone;
				this.ruleForm.imgPath = this.workerInfo.imgPath || '';
			},
			// 提交基本信息
			submitForm (formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri: 'workerInfo/update',
							data: this.ruleForm
						}).then((res) => {
							this.$emit('updateInfo');
							msg.success();
							this.dialogVisible = false
							//更新用户信息
						})
					}
				});
			},
			// 修改密码
			modifyAcc (formName){
				this.dialogVisibleAccount = true
				this.$nextTick(_=>{
					this.$refs[formName].resetFields()
					this.ruleFormAccount.workId = this.workerInfo.id
					this.ruleFormAccount.pwd = ''
					this.ruleFormAccount.password = ''
        })
			},
			// 提交密码
			submitFormAccount (formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.ruleFormAccount.password = md5.hex_md5(this.ruleFormAccount.pwd)
						this.$store.dispatch('post', {
							uri: 'workerAccount/updateWkPwd',
							data: this.ruleFormAccount
						}).then((res) => {
							this.dialogVisibleAccount = false
							msg.success();
						})
					}
				});
			},
			// 删除用户
			deleteStaffInfo (){
				let _this = this;
				msg.confirm({msg:'此操作将永久删除， 同时会停用该员工的登录账号，是否继续?', confirmFn:function(){
					_this.$store.dispatch('post', {
						uri : 'workerInfo/delete',
						data: {
							id: _this.workerInfo.id
						}
					}).then((res) =>{
						msg.success();
						_this.$router.replace({ path: '/worker/list' })
					})
				}})
			},
      // 通洗管理家扩展功能(为1时取送员角色拥有店员功能/店员角色拥有取送员功能) 0.无 1.有
      changeWapExtend(value){
        msg.confirm({
          msg: "确认修改当前状态？",
          confirmFn: _=> {this.updateWapExtend(value)},
          cancelFn: _=> {
            if (this.workerInfo.wapExtend) {
              this.workerInfo.wapExtend = 0;
						} else {
              this.workerInfo.wapExtend = 1;
						}
          }
        });
      },
			updateWapExtend(value) {
        this.$store.dispatch('post', {
          uri: 'workerInfo/updateWapExtend',
          data: {
            id: this.workerInfo.id,
            wapExtend: value
          }
        }).then((res) => {
          msg.success();
        })
			},
			// 改变员工启用状态
			changeStatusVal(value){
				msg.confirm({
					msg: "确认修改当前状态？",
					confirmFn: this.updateStatus,
					cancelFn: _ => {
						this.statusVal = !this.statusVal;
					}
				});
			},
      //
      changeIsOpenBox(){
        msg.confirm({
          msg: "确认修改当前状态？",
          confirmFn: this.updateIsOpenBox,
          cancelFn: _ => {
            this.isOpenBox = !this.isOpenBox;
          }
        });
      },
			// 更新员工启用状态
			updateStatus (status){
				this.$store.dispatch('post', {
				  uri: this.statusVal ? 'workerInfo/enable' : 'workerInfo/disable',
				  data: {
					  id: this.workerInfo.id
				  }
			  }).then((res) => {
					this.workerInfo.status = this.statusVal ? 1:0;
					msg.success();
			  })
			},
      // 更新员工启用状态
      updateIsOpenBox (){
        this.$store.dispatch('post', {
          uri:  'workerInfo/updateIsOpenBox',
          data: {
            id: this.workerInfo.id,
						status: this.isOpenBox ? 1 : 0
          }
        }).then((res) => {
          this.workerInfo.isOpenBox = this.isOpenBox ? 1:0;
          msg.success();
        })
      },
			//图片上传模块
			handleAvatarSuccess(fileNames) {
				if (fileNames && fileNames[0]) {
					this.ruleForm.imgPath = fileNames[0]
				}
        this.dialog.loading = false;
			},
      handleAvatarError() {
        this.dialog.loading = false;
			},
			beforeAvatarUpload(file) {
				const isImg = validate.image(file.type)
				if (!isImg) {
					msg.error('上传文件不是图片！');
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					msg.error('上传图片大小不能超过 2MB!');
				}
				let isOk = isImg && isLt2M;
				if (isOk) {
          this.dialog.loading = true;
				}
				return isOk;
			},
			RfidOperation(){ //开始rfid卡相关操作前的准备
				this.cardFormVisible = true;
				this.cardForm.rfidNo = '';
				this.cardForm.checkCode = ''; 
			},
			submitRfidOperation(){ //提交frid卡修改
				this.$refs.cardForm.validate(valid=>{
					if(valid){
						if(this.workerInfo.isBinding){
							this.unbundRfid(_=>{
								this.cardFormVisible = false;
							});
						} else{
							this.bindRfid(_=>{
								this.cardFormVisible = false;
							});
						}
					}
				})
			},
			bindRfid(fn){ //绑定rfid卡
				this.$store.dispatch('post',{
						uri:'workerInfo/cardBinding',
						data:{
							workId:this.workerInfo.id,
							rfidNo:this.cardForm.rfidNo,
							checkCode:this.cardForm.checkCode,
						}
					}).then(res=>{
						msg.success();
						this.workerInfo.isBinding = 1;
						fn&&fn(); //回调函数
					})
			},
			unbundRfid(fn){ //解绑rfid卡
				this.$store.dispatch('post',{
					uri:'workerInfo/cardUnbundling',
					data:{
						workId:this.workerInfo.id,
						rfidNo:this.cardForm.rfidNo,
					}
				}).then(res=>{
					msg.success();
					this.workerInfo.isBinding = 0;
					fn&&fn(); //回调函数
				})
			},
			// 增加员工提成
			addBrokerage(){
				return this.$store.dispatch('post',{
					uri:'workerProfits/add',
					data:{
						workId: this.workerInfo.id,
						takeType: this.brokerage.takeType,
						sendType: this.brokerage.sendType,
						stockInType: this.brokerage.stockInType,
            pickupType: this.brokerage.pickupType,
						take: calculation.accMul(this.brokerage.take , 100),
						send: calculation.accMul(this.brokerage.send , 100),
						stockIn: calculation.accMul(this.brokerage.stockIn , 100),
            pickup: calculation.accMul(this.brokerage.pickup , 100)
					}
				})
			},
			// 更新员工提成
			updateBrokerage(){
				return this.$store.dispatch('post',{
					uri:'workerProfits/update ',
					data:{
						id: this.workerInfo.profits.id,
						takeType: this.brokerage.takeType,
						sendType: this.brokerage.sendType,
						stockInType: this.brokerage.stockInType,
            pickupType: this.brokerage.pickupType,
						take: calculation.accMul(this.brokerage.take , 100),
						send: calculation.accMul(this.brokerage.send , 100),
						stockIn: calculation.accMul(this.brokerage.stockIn , 100),
            pickup: calculation.accMul(this.brokerage.pickup , 100),
					}
				})
			},
			// 修改员工提成 - 显示并格式化表单数据
			changeBrokerage(profit){
			  this.brokerage.profit = profit || 1;
			  this.brokerage.roleId = this.workerInfo.roleId;
				this.brokerage.takeType = this.workerInfo.profits
					? this.workerInfo.profits.takeType
					: 1;
				this.brokerage.sendType = this.workerInfo.profits
					? this.workerInfo.profits.sendType
					: 1;
				this.brokerage.take = this.workerInfo.profits
					? calculation.accDiv(this.workerInfo.profits.take , 100)
					: 0;
				this.brokerage.send = this.workerInfo.profits
					? calculation.accDiv(this.workerInfo.profits.send , 100)
					: 0;
				this.brokerage.stockInType = this.workerInfo.profits
					? this.workerInfo.profits.stockInType
					: 1;
				this.brokerage.stockIn = this.workerInfo.profits
					? calculation.accDiv(this.workerInfo.profits.stockIn , 100)
					: 0;
        this.brokerage.pickupType = this.workerInfo.profits
          ? this.workerInfo.profits.pickupType
          : 1;
        this.brokerage.pickup = this.workerInfo.profits
          ? calculation.accDiv(this.workerInfo.profits.pickup , 100)
          : 0;
				this.brokerage.dialog = true;
			},
			// 提交员工提成 - 无提成信息需要去添加，有则更新提成信息
			subBrokerage(){
				this.$refs[this.brokerage.refName].validate(async(valid) => {
					if(valid){
						if(
							this.workerInfo.profits &&
							this.workerInfo.profits.take === calculation.accMul(this.brokerage.take , 100) &&
							this.workerInfo.profits.send === calculation.accMul(this.brokerage.send , 100) &&
							this.workerInfo.profits.stockIn === calculation.accMul(this.brokerage.stockIn , 100) &&
							this.workerInfo.profits.takeType === this.brokerage.takeType &&
							this.workerInfo.profits.sendType === this.brokerage.sendType &&
							this.workerInfo.profits.stockInType === this.brokerage.stockInType &&
							this.workerInfo.profits.pickupType === this.brokerage.pickupType &&
							this.workerInfo.profits.pickup === calculation.accMul(this.brokerage.pickup , 100)
							){
							// 表单数据 未发生变化 不调用更新接口
							msg.success('修改成功！');
							this.brokerage.dialog = false;
						}else{
							this.brokerage.loading = true;
							let result = await (this.workerInfo.profits
								? this.updateBrokerage()
								: this.addBrokerage());
							msg.success('修改成功！');
							this.workerInfo.profits ? this.updateWorkInfoProfits() : this.$emit('updateInfo');
							this.brokerage.dialog = false;
						}
					}
				})
			},
			// 提交成功更新员工profits信息
			updateWorkInfoProfits(){
				this.workerInfo.profits.takeType = this.brokerage.takeType;
				this.workerInfo.profits.sendType = this.brokerage.sendType;
				this.workerInfo.profits.stockInType = this.brokerage.stockInType;
				this.workerInfo.profits.pickupType = this.brokerage.pickupType;
				this.workerInfo.profits.take = calculation.accMul(this.brokerage.take , 100);
				this.workerInfo.profits.send = calculation.accMul(this.brokerage.send , 100);
				this.workerInfo.profits.stockIn = calculation.accMul(this.brokerage.stockIn , 100);
				this.workerInfo.profits.pickup = calculation.accMul(this.brokerage.pickup , 100);
			},
			// 校验提成金额
			checkBrokerage(typeName, value, callback){
				let type = this.brokerage[typeName];
				let max = 0,err = '';
				if(type === 1){
					max = 100;
					err = '请输入0-100的数字，最多保留2位小数'
				}else{
					max = 999999;
					err = '请输入0-999999的数字，最多保留2位小数'
				}
				validate.amount(value,2,0,max)
					? callback()
					: callback(new Error(err));
			},
			// // 修改角色
			// getRoleList (fn){
			// 	this.$store.dispatch('post', {
			// 		uri : 'wkRole/queryForSelect',
			// 		data: {isShow: 1}
			// 	}).then((res) =>{
			// 		let list = res.data.data.list || []
			// 		this.roleList = list
			// 		if(typeof (fn) === 'function'){
			// 		  fn()
			// 		}
			// 	})
			// },
			// // 修改角色
			// modifyRole (attr, title){
			// 	if(this.roleList.length > 0	){
			// 		this.modify(attr, title)
			// 	}else {
      //     this.getRoleList(_=> {
      //       this.modify(attr, title)
      //     })
      //   }
			// },
		},
		watch: {
			'workerInfo'(n,o){
				if( o === null){
					this.statusVal = n.status ==1;
					this.isOpenBox = n.isOpenBox == 1;
				}
			}
		}
	}
</script>
/*
	员工基本信息
		props
			name | type |default | description
			workerInfo|Object|无 | 员工基本信息
		evnets
			name | params | description
			updateInfo | 无 | 更新员工基本信息
 */