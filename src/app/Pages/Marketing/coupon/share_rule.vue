<template>
	<div>
		<div>
			<p class="ukao-tb-title text-black">赠送规则</p>
			<div class="ukao-tb-default ukao-v-loading">
				<table class="ukao-table b-t" style="width: 100%" v-loading="loading">
					<tbody>
						<tr>
							<td style="width: 30%">状态</td>
							<td>
								<div v-show="couponInfo.statusVal">已启用</div>
								<div v-show="!couponInfo.statusVal">未启用</div>
							</td>
							<td style="width: 20%">
								<auth perm="marketing.coupon.share.update">
									<el-switch
										v-model="couponInfo.statusVal"
										active-color="#13ce66"
										inactive-color="#dcdcdc"
										on-text="已启用"
										off-text="未启用"
										@change="updateStatus(couponInfo)"
										:width="74">
									</el-switch>
								</auth>
							</td>
						</tr>
						<tr>
							<td>优惠券名称</td>
							<td>{{couponInfo.name}}</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('name', '优惠券名称')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>使用规则</td>
							<td>
								{{ruleName}}
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('rule', '使用规则')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>券面值</td>
							<td>
								<div v-if="couponInfo.random == 0 && couponInfo.amount > 0.01">
									{{couponInfo.amount }}元
								</div>
								<div v-if="couponInfo.random == 1">
									{{couponInfo.minAmount}} - {{couponInfo.maxAmount}}元
								</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('random', '券面值')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>发放总数</td>
							<td>
								<div v-if="couponInfo.cnt && couponInfo.cnt > 0">
									{{couponInfo.cnt}}张
								</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('cnt', '发放总数')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>使用限制</td>
							<td>
									<div v-show="couponInfo.fullAmount > 0">
										满{{couponInfo.fullAmount}}元可使用
									</div>
									<div v-show="couponInfo.fullAmount==0">不限制</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('fullAmount', '使用限制')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>每人获赠数</td>
							<td>
								<div v-if="couponInfo.perUserNum">
									{{couponInfo.perUserNum}}张
								</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('perUserNum', '每人获赠数')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>有效天数</td>
							<td>
								<div v-if="couponInfo.term">
									获赠后{{couponInfo.term}}天内有效
								</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('term', '获赠后有效天数')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>使用说明</td>
							<td>
								{{couponInfo.detail}}
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('detail', '使用说明')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>同步打标签</td>
							<td>
								<el-tag class="m-r m-b-xs"
									:key="tag"
									type="primary"
									v-for="tag in eventForm.tagList"
									:closable="false"
									:close-transition="false"
								>{{tag}}</el-tag>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="updateTag('tag', '添加标签')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>分享的标题</td>
							<td>{{couponShare.title}}</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="updateShare('title', '分享的标题')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>分享的描述</td>
							<td>{{couponShare.detail}}</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="updateShare('detail', '分享的描述')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>分享的图标</td>
							<td>
								<!--<p class="text-muted">格式必须为：png,jpeg,jpg,不可大于2M;尺寸60*60</p>-->
								<img class="thumb-md" :src="couponShare.imgPath || '/static/img/marketing/share_rule_icon.png'" alt="">
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="updateShare('imagePath', '分享的图标')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>优惠券到期提醒</td>
							<td><div v-if="couponInfo.remindDay > 0">
								到期前{{couponInfo.remindDay}}天提醒一次
								</div>
							<div v-else>不提醒</div>
							</td>
							<td>
								<auth perm="marketing.coupon.share.update">
									<el-button @click="update('remindDay', '优惠券到期提醒')">设置</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>使用设置</td>

							<td>
								优惠券与余额<span v-show="couponInfo.useBalanceVal">允许</span><span v-show="!couponInfo.useBalanceVal">不允许</span>同时使用
							</td>
							<td style="width: 20%">
								<auth perm="marketing.coupon.share.update">
									<el-switch
										v-model="couponInfo.useBalanceVal"
										active-color="#13ce66"
										inactive-color="#dcdcdc"
										on-text="允许"
										off-text="不允许"
										@change="updateUseBalance(couponInfo)"
										:width="74">
									</el-switch>
								</auth>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- 编辑-->
		<el-dialog class="ukao-dialog"
			:title="dialog.title"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="优惠券名称" prop="name" v-if="dialog.attr ==='name'" :rules="[
						{ required: true, message: '名称不能为空'},
						{ min: 2, max: 30, message: '长度在2到30个长度', trigger: 'blur' }
					]">
						<div class="w-lg">
							<el-input v-model="ruleForm.name"></el-input>
						</div>
					</el-form-item>

					<div v-if="dialog.attr ==='rule'">
						<el-form-item label="使用规则" prop="couponRuleId" :rules="[
						{ required: true, message: '请选择使用规则' },
						{validator: checkSelect, message: '请选择使用规则', trigger: 'change'}]">
							<couponUseRule :callback="onCouponUseRuleCallback"></couponUseRule>
							<el-input style="display: none" v-model="ruleForm.couponRuleId" ></el-input>
					</el-form-item>
					</div>

					<div v-if="dialog.attr ==='random'">
						<div class="dis-inline">
							<div class="w-lg m-r-sm dis-inline">
								<el-form-item label="随机">
									<el-radio-group v-model="ruleForm.random">
											<el-radio-button label="0">否</el-radio-button>
											<el-radio-button label="1">是</el-radio-button>
									</el-radio-group>
								</el-form-item>
							</div>
						</div>

						<div class="dis-inline" v-if="ruleForm.random==0">
							<div class="w-lg m-r-sm dis-inline">
								<el-form-item label="券面值" prop="amount"  :rules="[
									 { required: true, message: '请输入券面值', trigger: 'blur' },
									 {validator: checkAmount, min:1, max:99999, message: '面值1至99999之间,保留2位小数', trigger: 'blur'}
								]">
									<div class="w-lg">
										<el-input type="number" v-model="ruleForm.amount"></el-input>
									</div>
								</el-form-item>
							</div>
						</div>

						<div class="dis-inline" v-if="ruleForm.random==1">
							<el-form-item label="券面值" required>
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item prop="minAmount" :rules="[
										 { required: true, message: '请输入随机券面值', trigger: 'blur' },
										 {validator: checkRandomAmount,   trigger: 'blur'},
								]">
									<el-input v-model="ruleForm.minAmount" type="number"></el-input>
								</el-form-item>
							</div> 至
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item  prop="maxAmount" :rules="[
										 { required: true, message: '请输入随机券面值', trigger: 'blur' },
										 {validator: checkRandomAmount,  trigger: 'blur'},
								]">
									<el-input v-model="ruleForm.maxAmount" type="number"></el-input>
								</el-form-item>
							</div>元
							</el-form-item>
						</div>
					</div>

					<div class="dis-inline" v-if="dialog.attr ==='cnt'">
						<el-form-item label="发放总数" prop="cnt" :rules="[
							{ required: true, message: '请输入发放总量', trigger: 'blur' },
			    		{validator: checkNumber, min:1, max:99999, message: '有效数量1至99999之间的正整数', trigger: 'blur'}]">
							<div class="w-lg">
								<el-input type="number" v-model="ruleForm.cnt"></el-input>
							</div>
						</el-form-item>
					</div>

					<div v-if="dialog.attr ==='fullAmount'">
						<el-form-item label="使用限制" prop="fullAmount" :rules="[
							{ required: true, message: '请填写使用限制金额', trigger: 'blur' },
							{validator: checkAmount, min:0, max:99999, message: '金额有效数0至99999之间的正数', trigger: 'blur'}
						]">
							<div>
								<el-checkbox label="不限制" v-model="eventForm.fullAmountCheckbox1" @change="fullAmountCheckbox1"></el-checkbox>
							</div>
							<div class="m-t-sm">
								<el-checkbox v-model="eventForm.fullAmountCheckbox2" @change="fullAmountCheckbox2">
									<span>满
										<span class="w-sm dis-inline m-l-sm m-r-sm">
											<el-input type="number" v-model="ruleForm.fullAmount" :disabled="eventForm.fullAmountDisabled"></el-input>
										</span>元可用
									</span>
								</el-checkbox>
							</div>
						</el-form-item>
					</div>

					<div v-if="dialog.attr ==='perUserNum'">
						<el-form-item label="每人获赠数" prop="perUserNum" :rules="[
							{ required: true, message: '请填写每人获赠数', trigger: 'blur' },
							{validator: checkNumber, min:1, max:100, ignoreEmpty:false, message: '每人限领数1至100之间的正整数', trigger: 'blur'}
						]">
							<div>
									<span class="dis-inline m-r-sm">
										<el-input type="number" v-model="ruleForm.perUserNum"></el-input>
									</span>张
							</div>
						</el-form-item>
					</div>

					<div v-if="dialog.attr ==='term'">
						<el-form-item label="有效天数" prop="term" :rules="[
							{ required: true, message: '请输入有效天数', trigger: 'blur' },
							{ validator: checkNumber, min: 1, max: 1000, message: '有效天数1至1000天', trigger: 'blur' }
						]">
							<div>
								<span class="dis-inline m-r-sm">
									<el-input type="number" v-model="ruleForm.term" placeholder="获赠后n天内有效"></el-input>
								</span>天
							</div>
						</el-form-item>
					</div>

					<div v-if="dialog.attr ==='detail'">
						<el-form-item label="" prop="detail" :rules="[
							{ required: true, max: 200, message: '内容长度在200个字内容', trigger: 'blur' }
						]">
							<div class="w-lg">
								<el-input type="textarea" v-model="ruleForm.detail"
													:autosize="{ minRows: 4, maxRows: 6}"
													placeholder="填写活动的详细说明，支持换行。"></el-input>
							</div>
						</el-form-item>
					</div>

					<div class="dis-inline" v-if="dialog.attr ==='remindDay'">
						<el-form-item label="提醒设置" prop="remindDay" :rules="[
				    {  required: eventForm.remindDateCheckbox2, message: '请选择提醒天数' },
				    { message: '请选择提醒天数2', trigger: 'change'}]">
							<div>
								<el-checkbox label="不提醒" v-model="eventForm.remindDateCheckbox1" @change="remindDateCheckbox1"></el-checkbox>
							</div>
							<div class="m-t-sm">
								<el-checkbox v-model="eventForm.remindDateCheckbox2" @change="remindDateCheckbox2">
								<span>到期前{{ruleForm.remindDay}}
									<span class="w-sm dis-inline m-l-sm m-r-sm">
										<el-select v-model="ruleForm.remindDay"  :disabled="eventForm.remindDateDisabled" placeholder="请选择">
										 	<el-option :label="item.name" :value="item.level" :key="item.level" v-for="item in remindDateList"></el-option>
			    					</el-select>
									</span>天提醒一次
								</span>
								</el-checkbox>
							</div>
						</el-form-item>
					<!--	<el-form-item label="" prop="cnt" :rules="[
							{ required: true, message: '请输入发放总量', trigger: 'blur' },
			    		{validator: checkNumber, min:1, max:99999, message: '有效数量1至99999之间的正整数', trigger: 'blur'}]">
							<div class="w-lg">
								<el-input type="number" v-model="ruleForm.cnt"></el-input>
							</div>
						</el-form-item>-->
					</div>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"  @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>

		</el-dialog>
		<!-- 编辑-->

		<!-- 标签-->
	<el-dialog class="ukao-dialog"
		:title="dialogTag.title"
		:visible.sync="dialogTag.visible"
		size="small">
			<div class="membership-content demo-ruleForm">
				<el-tag class="m-r m-b-xs"
						:key="tag"
						type="primary"
						v-for="tag in eventForm.tagList"
						:closable="true"
						:close-transition="false"
						@close="delTag(tag)"
					>{{tag}}</el-tag>
					<el-input
						placeholder="标签内容15个字以内"
						class="input-new-tag"
						v-if="inputVisible"
						v-model="tagInputValue"
						ref="saveTagInput"
						size="mini"
						@keyup.enter.native="addTagConfirm"
						@blur="addTagConfirm"
					>
					</el-input>
				<el-button v-show="tagShow" v-else class="button-new-tag" size="small" @click="showInput">+标签</el-button>
				<div style="text-align: center;margin-top: 15px">
					<el-button @click="dialogTag.visible=false">取消</el-button>
					<el-button type="primary"  @click="submitFormTag('ruleForm')">保存</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 标签-->

		<!-- 分享-->
	<el-dialog class="ukao-dialog"
		:title="dialogShare.title"
		:visible.sync="dialogShare.visible"
		size="small">
			<div class="membership-content demo-ruleForm">
				<el-form :model="ruleFormShare"  ref="ruleFormShare" label-width="150px">

					<el-form-item label="" prop="title" v-if="dialogShare.attr ==='title'" :rules="[
						{ required: true, message: '标题不能为空'},
						{ min: 2, max: 50, message: '长度在2到50个长度', trigger: 'blur' }
					]">
						<div class="w-lg">
							<el-input type="textarea" v-model="ruleFormShare.title" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="" prop="detail" v-if="dialogShare.attr ==='detail'" :rules="[
						{ required: true, message: '描述不能为空'},
						{ min: 2, max: 150, message: '长度在2到150个长度', trigger: 'blur' }
					]">
						<div class="w-lg">
							<el-input type="textarea" v-model="ruleFormShare.detail" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
						</div>
					</el-form-item>

					<el-form-item v-if="dialogShare.attr === 'imagePath'">
						<Uploader
						tip="格式必须为：png,jpeg,jpg,不可大于2M;尺寸60*60"
						:path="ruleFormShare.imgPath"
						:beforeFn="beforeAvatarUpload"
						:changeFn="handleAvatarChange"
						:successFn="handleAvatarSuccess"
						:errorFn="handleAvatarError"
						></Uploader>
					</el-form-item>

				</el-form>
				<div style="text-align: center;margin-top: 15px">
					<el-button @click="dialogShare.visible=false">取消</el-button>
					<el-button type="primary"  :loading="dialogShare.btn"   @click="submitFormShare('ruleFormShare')">{{dialogShare.text}}</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 分享-->

	</div>
</template>


<script>
	import msg from '@/utils/msg'
	import validate from '@/utils/helpers/validate'
	import calculation from '@/utils/helpers/calculation'
	import time from '@/utils/helpers/timeLite'
	import helpers from '@/utils/helpers/base'
	import Uploader from '@/components/Uploader/index.vue'
	import couponUseRule from '@/components/Coupon/use_rule'

	export default {
		components: {
			Uploader, couponUseRule
		},
		data: function() {
			return {
				loading: true,
				ruleName: '',
				dynamicTags: [],
				couponInfo:{
					id:'',
					type: 4,
					status:0,
					statusVal: false,
          useBalanceVal: false,
					name: '',
					random:0,
					ruleName: '',
          remindDay: '',	//提醒日期
          //useBalance: '',	//是否可用于金额同用
				},
				couponShare:{	//分享信息
					title:'',
					imgPath:'',
					detail:''
				},
				dialog:{
					title: '设置',
					visible: false,
				},
				dialogTag:{
					title: '设置',
					visible: false,
				},
				dialogShare:{
					title: '设置',
					visible: false,
					btn: false,
					text:'保存'
				},
				ruleForm:{
					name:'',
					couponRuleId:'',
					random: 0,
					amount:'',
					minAmount:'',
					maxAmount:'',
					fullAmount:'0',
					perUserNum:'',
					dateType:2,
					term:'',
					detail: '',
					ruleName: '',
          remindDay: '',	//提醒日期
          //useBalance: '',	//是否可用于金额同用
				},
				eventForm:{
					fullAmountCheckbox1: true,
					fullAmountCheckbox2: false,
					fullAmountDisabled : true,
					perUserNumCheckbox1: false,
					perUserNumCheckbox2: true,
					perUserNumDisabled: false,
          remindDateCheckbox1: true,
          remindDateCheckbox2: false,
          remindDateDisabled: true,
					maxTag : 10,		//最多能添加数
					tagList:[],
					saveTagList:[]
				},
				couponRuleObj:{},
				inputVisible: false,
				inputValue: '',
				tagInputValue: '',
				tagShow: true,
				imageUrl: '',
				ruleFormShare:{
					title:'',
					imgPath:'',
					detail:''
				},
				cacheCouponUseRule:{},
        remindDateList:[{level:'1',name:'1'},{level:'2',name:'2'},{level:'3',name:'3'},
          {level:'4',name:'4'},{level:'5',name:'5'},{level:'6',name:'6'},{level:'7',name:'7'},{level:'8',name:'8'},{level:'9',name:'9'},{level:'10',name:'10'}],	//提醒日期
				level:''
			}
		},
		created(){
      var _this = this
			_this.info(function () {
			  _this.shareDetail()
				_this.queryCouponRuleDetail()
				_this.loading = false
      })
    },
		watch : {		//监听选择改变
			'couponInfo.couponRuleId'(){
				this.queryCouponRuleDetail()
			},
			'dialogTag.visible'(visible){
			  if(!visible) {
          this.detail()
        }
			}
		},
		methods: {
			info(fn){
				this.$store.dispatch('post', {
					uri : 'couponInfo/share',
					data: {}
				}).then((res) =>{
					 var couponInfo = res.data.data
					 this.initCouponInfo(couponInfo)
					 if(typeof (fn) === 'function'){
						 fn()
					 }
				})
			},
			detail(){
				this.$store.dispatch('post', {
					uri : 'couponInfo/detail',
					data: {
					 id: this.couponInfo.id
					}
				}).then((res) =>{
					var couponInfo = res.data.data
					this.initCouponInfo(couponInfo)
				})
			},
			shareDetail(){
				this.$store.dispatch('post', {
					uri : 'couponShare/detailByCouponId',
					data: {
						couponId: this.couponInfo.id
					}
				}).then((res) =>{
					this.couponShare = res.data.data
					this.ruleFormShare = {...this.couponShare}
				})
			},
			initCouponInfo(couponInfo){
				 var _this = this
				 couponInfo.statusVal = couponInfo.status ? true : false
				 couponInfo.useBalanceVal = couponInfo.useBalance ? true : false
				 couponInfo.amount = couponInfo.amount ? calculation.accDiv(couponInfo.amount, 100) : couponInfo.amount
				 couponInfo.minAmount =  couponInfo.minAmount ? calculation.accDiv(couponInfo.minAmount, 100) : couponInfo.minAmount
				 couponInfo.maxAmount = couponInfo.maxAmount ? calculation.accDiv(couponInfo.maxAmount, 100) : couponInfo.maxAmount
				 couponInfo.fullAmount = couponInfo.fullAmount ? calculation.accDiv(couponInfo.fullAmount, 100) : '0'
				 this.eventForm.fullAmountCheckbox1 = Number(couponInfo.fullAmount) > 1 ? false : true
				 this.eventForm.fullAmountCheckbox2 = !this.eventForm.fullAmountCheckbox1
				 this.eventForm.fullAmountDisabled = this.eventForm.fullAmountCheckbox1
				 this.dynamicTags = couponInfo.tagNames ? eval(couponInfo.tagNames) : []
				 this.eventForm.saveTagList = this.dynamicTags || []
				 _this.eventForm.tagList.length = 0
				 this.dynamicTags.forEach(function (item) {
					 _this.eventForm.tagList.push(item.name)
				 })
				this.tagShow = this.eventForm.tagList.length < this.eventForm.maxTag
        this.eventForm.remindDateCheckbox2 = couponInfo.remindDay > 0 ? true: false;
        this.eventForm.remindDateCheckbox1 = couponInfo.remindDay < 0 ? true: false;
        this.eventForm.remindDateDisabled = couponInfo.remindDay < 0 ? true: false;
        couponInfo.remindDay = couponInfo.remindDay > 0 ? couponInfo.remindDay.toString():'';
				this.couponInfo = couponInfo


        console.log(this.eventForm.remindDateCheckbox1,"this.eventForm.remindDateCheckbox1",couponInfo.remindDay)
				 this.ruleForm = {...couponInfo}

			},
			update(attr, title){
				this.dialog.title = title
				this.dialog.attr = attr
				this.dialog.visible = true
			},
			updateTag(attr, title){
				this.dialogTag.title = title
				this.dialogTag.attr = attr
				this.dialogTag.visible = true
			},
			updateShare(attr, title){
				this.dialogShare.title = title
				this.dialogShare.attr = attr
				this.dialogShare.visible = true
			},
			submitForm(formName){
				var _this = this
				//修改使用规则
				if(this.dialog.attr ==='rule') {
          this.couponUseRuleSave(function () {
            _this.updateCouponInfo()
          })
        }else {
          this.$refs[formName].validate((valid) => {
            if (valid) {

              this.updateCouponInfo()
            }
          })
        }
			},

			updateCouponInfo(){
				var ruleForm = {...this.couponInfo}
				ruleForm.name = this.isNull(this.ruleForm.name, ruleForm.name)
				ruleForm.couponRuleId = this.ruleForm.couponRuleId
				ruleForm.random = this.isNull(this.ruleForm.random, ruleForm.random)
				ruleForm.amount = this.isNull(this.ruleForm.amount, ruleForm.amount)
				ruleForm.minAmount = this.isNull(this.ruleForm.minAmount, ruleForm.minAmount)
				ruleForm.maxAmount = this.isNull(this.ruleForm.maxAmount, ruleForm.maxAmount)
				ruleForm.fullAmount = this.isNull(this.ruleForm.fullAmount, ruleForm.fullAmount)
				ruleForm.perUserNum = this.isNull(this.ruleForm.perUserNum, ruleForm.perUserNum)
				ruleForm.dateType = this.isNull(this.ruleForm.dateType, ruleForm.dateType)
				ruleForm.term = this.isNull(this.ruleForm.term, ruleForm.term)
				ruleForm.detail = this.isNull(this.ruleForm.detail, ruleForm.detail)
				ruleForm.cnt = this.isNull(this.ruleForm.cnt, ruleForm.cnt)
				console.log(this.ruleForm.remindDay,"console.log(this.ruleForm.remindDay,this.ruleForm.remindDay)")
        this.ruleForm.remindDay = this.ruleForm.remindDay ? this.ruleForm.remindDay : '-1';
				ruleForm.remindDay = this.isNull(this.ruleForm.remindDay, ruleForm.remindDay)
        console.log(ruleForm.remindDay,"console.log(ruleForm.remindDay")
				if(ruleForm.random == '0'){
					ruleForm.amount = ruleForm.amount ? calculation.accMul(ruleForm.amount, 100) : ruleForm.amount
					ruleForm.minAmount = ''
					ruleForm.maxAmount = ''
				}else{
					ruleForm.amount = ''
					ruleForm.minAmount = ruleForm.minAmount ? calculation.accMul(ruleForm.minAmount, 100) : ruleForm.minAmount
					ruleForm.maxAmount = ruleForm.maxAmount ? calculation.accMul(ruleForm.maxAmount, 100) : ruleForm.maxAmount
				}
				ruleForm.fullAmount =  ruleForm.fullAmount ? calculation.accMul(ruleForm.fullAmount, 100) : ruleForm.fullAmount
				ruleForm.createTime = ruleForm.createTime ? time.getDateTime(ruleForm.createTime) : ruleForm.createTime
				ruleForm.updateTime = ruleForm.updateTime ? time.getDateTime(ruleForm.updateTime) : ruleForm.updateTime

				this.$store.dispatch('post', {
					uri: 'couponInfo/update',
					data: ruleForm
				}).then((res) => {
					this.dialog.visible = false
					msg.success()
					this.detail()
				})
			},

			submitFormShare(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
							this.$store.dispatch('post', {
								uri: 'couponShare/update',
								data: this.ruleFormShare
							}).then((res) => {
								this.dialogShare.visible = false
								msg.success()
								this.shareDetail()
							})
            }
        })
			},
			isNull(str1, str2){
				return (str1 && str1.length > 0 ? str1 : str2)
			},
			updateStatus (item){
        if(this.checkStatsEnable()){
          msg.error("信息设置不完整，请设置完整再开启")
          item.statusVal = false
          return
        }
				this.$store.dispatch('post', {
					uri : item.statusVal ? 'couponInfo/enable' : 'couponInfo/disable',
					data: {
						id: item.id
					}
				}).then((res) =>{
					msg.success()
					this.detail()
				})
			},
      updateUseBalance (item){
        this.$store.dispatch('post', {
          uri : item.useBalanceVal ? 'couponInfo/enableUseBalance' : 'couponInfo/disableUseBalance',
          data: {
            id: item.id
          }
        }).then((res) =>{
          msg.success()
          this.detail()
        })
      },
			checkStatsEnable(){
				var coupon = this.couponInfo
				return (
					coupon.name == null
					|| coupon.couponRuleId ==null
					|| (coupon.amount == null && (coupon.minAmount == null && coupon.maxAmount == null))
					|| coupon.fullAmount == null
					|| coupon.perUserNum == null
					|| coupon.term == null
					|| this.couponShare.title == null || this.couponShare.title == ''
					|| this.couponShare.detail == null || this.couponShare.detail == ''
					//|| this.couponShare.imgPath == null || this.couponShare.imgPath == ''
				)
			},
			submitFormTag(){
				var tagNames = helpers.arrayToJson(this.eventForm.saveTagList)
				this.$store.dispatch('post', {
					uri: 'couponInfo/updateTag',
					data: {
						id: this.couponInfo.id,
						tagJson: tagNames
					}
				}).then((res) => {
					this.dialogTag.visible = false
					msg.success()
					this.detail()
				})
			},
			addTagConfirm(){
				let name = this.tagInputValue
				this.tagInputValue = null
				if (name) {
					if(name.length > 15){
						msg.error("标签内容不能超过15个字")
					}else {
						let tagList = this.eventForm.tagList
						this.tagShow = tagList.length + 1 < this.eventForm.maxTag
						if (tagList.length < this.eventForm.maxTag) {
							let addSign = true
							tagList.forEach(function (item) {
								if (item == name) {
									addSign = false;
									return false;
								}
							});
							if (addSign) {
								tagList.push(name)
								this.queryTagName(name);
							} else {
								msg.error("标签【" + name + "】已存在")
							}
						} else {
							msg.error("标签不能超过"+this.eventForm.maxTag+"个")
						}
					}
				}
				this.showTagInput = false
				this.inputVisible = false
			},
			queryTagName(tagName){
				this.$store.dispatch('post', {
					uri : 'userTag/byName',
					data:{
						name: tagName
					}
				}).then((res) =>{
					let data =  res.data.data
					let tag = {id:'', name: tagName}
					if(data){
						tag.id = data.id
						tag.name = data.name
					}
					this.eventForm.saveTagList.push(tag)
				})
			},
			delTag(tag) {
				var _this = this
				this.eventForm.tagList.splice(this.eventForm.tagList.indexOf(tag), 1)
				this.tagShow = this.eventForm.tagList.length < this.eventForm.maxTag
				var saveTagList = [...this.eventForm.saveTagList] || []
				var tmpTagList = []
				saveTagList.forEach(function (item) {
					if(item.name !== tag) {
						tmpTagList.push(item)
					}
				})
				this.eventForm.saveTagList = tmpTagList
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			queryCouponRuleDetail(){
			  if(!this.couponInfo.couponRuleId){
			    return
				}
				this.$store.dispatch('post', {
				 uri : 'couponRule/detail',
					data:{
				   id: this.couponInfo.couponRuleId
					}
				 }).then((res) =>{
					let ruleItem = res.data.data
					if(ruleItem) {
						this.couponInfo.ruleName = ruleItem.name
						this.ruleForm.ruleName = ruleItem.name
						this.ruleForm.couponRuleId = ruleItem.id
						this.couponRuleObj = ruleItem
						this.ruleName = ruleItem.name
					}
				})
			},
			checkNumber(rule, value, callback) {
			 if (!validate.number(value, rule.min, rule.max, rule.ignoreEmpty)) {
				 callback(new Error());
			 } else {
				 callback();
			 }
			},
			checkRandomAmount(rule, value, callback){
				if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
					callback(new Error("格式错误"));
				}

				if(this.ruleForm.maxAmount !=''
					&& this.ruleForm.minAmount != ''
					&& this.ruleForm.maxAmount - this.ruleForm.minAmount <= 0){
					callback(new Error("范围错误"));
				}else{
					callback();
				}
			},
			checkAmount(rule, value, callback) {
			 if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
				 callback(new Error());
			 } else {
				 callback();
			 }
			},
			changeCouponRule(item) {
				 this.ruleForm.couponRuleId = item.id
			},
			checkSelect(rule, value, callback){
				if (!validate.notEmpty(value)) {
				 callback(new Error());
				} else {
				 callback();
				}
			},
			fullAmountCheckbox1(){
				if(this.eventForm.fullAmountCheckbox1){
					this.eventForm.fullAmountCheckbox2 = false
					this.ruleForm.fullAmount = '0'
					this.eventForm.fullAmountDisabled = true
				}else{
					this.eventForm.fullAmountCheckbox1 = true
				}
			},
			fullAmountCheckbox2(){
				if(this.eventForm.fullAmountCheckbox2){
					this.eventForm.fullAmountCheckbox1 = false
					this.ruleForm.fullAmount = ''
					this.eventForm.fullAmountDisabled = false
				}else{
					this.eventForm.fullAmountCheckbox2 = true
				}
			},
			perUserNumCheckbox1(){
				if(this.eventForm.perUserNumCheckbox1){
					this.eventForm.perUserNumCheckbox2 = false
					this.ruleForm.perUserNum = '1'
					this.eventForm.perUserNumDisabled = true
				}else{
					this.eventForm.perUserNumCheckbox1 = true
				}
			},
			perUserNumCheckbox2(){
				if(this.eventForm.perUserNumCheckbox2){
					this.eventForm.perUserNumCheckbox1 = false
					this.ruleForm.perUserNum = ''
					this.eventForm.perUserNumDisabled = false
				}else{
					this.eventForm.perUserNumCheckbox2 = true
				}
			},
			handleClose: function(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			//临时缓存对象
			onCouponUseRuleCallback(data){
			  this.cacheCouponUseRule = data;
			},
			couponUseRuleSave(fn){
			  if(this.cacheCouponUseRule) {
          this.$store.dispatch('post', {
            uri: 'couponRule/temp/add',
            data: this.cacheCouponUseRule
          }).then((res) => {
            this.ruleForm.couponRuleId = res.data.data.id + ''
						if(typeof(fn) === 'function'){
              fn()
						}
          })
        }
			},
			handleAvatarChange(file){
			  var _this = this
				_this.dialogShare.btn = true
				_this.dialogShare.text = '上传中...'
			},
			handleAvatarSuccess(fileNames) {
			  var _this = this
				if(fileNames && fileNames[0]){
					_this.ruleFormShare.imgPath = fileNames[0]
        }
				_this.dialogShare.btn = false
				_this.dialogShare.text = '保存'
			},
			beforeAvatarUpload(file) {
				const isImg = validate.image(file.type)
				if (!isImg){
					msg.error('上传文件不是图片！');
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					msg.error('上传图片大小不能超过 2MB!');
				}
				return isImg && isLt2M;
			},
			handleAvatarError(file){
				this.dialogShare.btn = false
				this.dialogShare.text = '保存'
			},
      remindDateCheckbox1(){
        if(this.eventForm.remindDateCheckbox1){
          this.eventForm.remindDateCheckbox2 = false
          this.ruleForm.remindDay = ''
          this.eventForm.remindDateDisabled = true
        }else{
          this.eventForm.remindDateCheckbox1 = true
        }
      },
      remindDateCheckbox2(){
        if(this.eventForm.remindDateCheckbox2){
          this.eventForm.remindDateCheckbox1 = false
          this.ruleForm.remindDay = ''
          this.eventForm.remindDateDisabled = false
        }else{
          this.eventForm.remindDateCheckbox2 = true
        }
      },
		}
	}
</script>
