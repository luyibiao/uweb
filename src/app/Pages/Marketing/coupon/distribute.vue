<template>
	<div>
		<div class="m-b-lg">
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="send"><i class="el-icon-arrow-left icon-smaller"></i>优惠券</el-breadcrumb-item>
			  <el-breadcrumb-item>派发优惠券</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="coupons_give_user">
			<div class="total_show">将要派发给已选的 <span>{{cnt}}</span> 个客户</div>
		</div>
		<div class="membership-container clearfix">
			<div class="membership-sidebar">
				<img class="img b-a" src="/static/img/membership_card.png" alt="">
				<div class="content2">
					<div class="text-box text-white">
						<p class="wrapper text-white-transp">{{ ruleForm.name || '优惠券名称'}}</p>
						<div class="m-t-lg text-center">
							<p>
								<span class="text-vlg" v-show="!eventForm.randomCheckbox">{{ruleForm.amount || 0}}</span>
								<span class="text-vlg" v-show="eventForm.randomCheckbox">
									{{ruleForm.minAmount || 0}} <label style="font-size: 14px;">至</label>  {{ruleForm.maxAmount || 0}}
								</span>元
							</p>
							<p class="text-white-transp" v-show="eventForm.fullAmountCheckbox2">
								满 {{ruleForm.fullAmount || 0}}元可用
							</p>
							<p class="text-white-transp" v-show="ruleForm.dateType == 1">{{ruleForm.timeStart || '-'}} 至 {{ruleForm.timeEnd || '-'}} 有效</p>
							<p class="text-white-transp" v-show="ruleForm.dateType == 2">领取后{{ruleForm.term}}天内有效</p>
						</div>
					</div>
					<div class="b-box"></div>
					<div class="b-text b-b">使用说明</div>
					<div style="padding: 8px">
						<p>
							{{ruleForm.detail}}
						</p>
					</div>
				</div>
			</div>
			<div class="membership-content">
				<el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="优惠券名称" prop="name" :rules="[
					  { required: true, message: '请输优惠券名称', trigger: 'blur' },
						{ min: 2, max: 30, message: '长度在2到30个长度', trigger: 'blur' }
					]">
					  <div class="w-lg">
					  	<el-input v-model="ruleForm.name"></el-input>
					  </div>
				  </el-form-item>

				  <el-form-item label="券面值" required>
						<div class="dis-inline" v-if="!eventForm.randomCheckbox">
							<div class="w-lg m-r-sm dis-inline">
								<el-form-item  prop="amount" :rules="[
								     { required: true, message: '请输入券面值', trigger: 'blur' },
								     {validator: checkAmount, min:1, max:99999, message: '面值1至99999之间,保留2位小数', trigger: 'blur'}
								]">
									<el-input v-model="ruleForm.amount" type="number"></el-input>
								</el-form-item>
							</div>元
						</div>

						<div class="dis-inline" v-if="eventForm.randomCheckbox">
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item  prop="minAmount" :rules="[
								     { required: true, message: '请输入随机面值', trigger: 'blur' },
								     {validator: checkRandomAmount,   trigger: 'blur'},
								]">
									<el-input v-model="ruleForm.minAmount" type="number"></el-input>
								</el-form-item>
							</div> 至
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item  prop="maxAmount" :rules="[
										 { required: true, message: '请输入随机面值', trigger: 'blur' },
										 {validator: checkRandomAmount,  trigger: 'blur'},
								]">
									<el-input v-model="ruleForm.maxAmount" type="number"></el-input>
								</el-form-item>
							</div>元
						</div>

						<!--<div class="dis-inline">-->
							<!--<el-checkbox v-model="eventForm.randomCheckbox" @change="randomCheckbox">-->
									<!--<span>随机</span>-->
							<!--</el-checkbox>-->
						<!--</div>-->
				  </el-form-item>

				  <!--<el-form-item label="发放总量" prop="cnt" :rules="[-->
				    <!--{ required: true, message: '请输入发放总量', trigger: 'blur' },-->
				    <!--{validator: checkNumber, min:1, max:99999, message: '有效数量1至99999之间的正整数', trigger: 'blur'}-->
				  <!--]">-->
					  <!--<div class="w-lg m-r-sm dis-inline">-->
					  	<!--<el-input v-model="ruleForm.cnt" type="number"></el-input>-->
					  <!--</div>张-->
				  <!--</el-form-item>-->

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

				  <el-form-item label="给每人" prop="perUserNum" :rules="[
				    { required: true, message: '请填写每人限领张数', trigger: 'blur' },
				    {validator: checkNumber, min:1, max:99999, ignoreEmpty:false, message: '每人限领数1至99999之间的正整数', trigger: 'blur'}
				  ]">
						<span>
							<span class="w-sm dis-inline m-r-sm">
								<el-input type="number" v-model="ruleForm.perUserNum"></el-input>
							</span>张
						</span>
				  </el-form-item>

				  <el-form-item v-if="ruleForm.dateType==1" label="有效日期" prop="timeStart"  :rules="[
				    { required: true, message: '请选择有效日期', trigger: 'change' },
				  ]">
						<el-date-picker
				      v-model="timeStartObj"
				      type="daterange"
				      placeholder="选择有效日期"
							@change="changeTimeStart"
				      :picker-options="pickerOptions0">
				    </el-date-picker>
				  </el-form-item>

				  <el-form-item label="使用规则" prop="couponRuleId" :rules="[
				    { required: true, message: '请选择使用规则' },
				    { message: '请选择使用规则', trigger: 'blur'}]">
						<couponUseRule :callback="onCouponUseRuleCallback"></couponUseRule>
						<!--<p class="text-muted">当会员满足条件时会自动发放上一等级对应的会员卡</p>-->
						<el-input style="display: none" v-model="ruleForm.couponRuleId" ></el-input>
				  </el-form-item>

					<el-form-item label="提醒设置" prop="remindDay" :rules="[
				    {  required: eventForm.remindDateCheckbox2, message: '请选择提醒天数' },
				    { message: '请选择提醒天数', trigger: 'change'}]">
						<div>
							<el-checkbox label="不提醒" v-model="eventForm.remindDateCheckbox1" @change="remindDateCheckbox1"></el-checkbox>
						</div>
						<div class="m-t-sm">
							<el-checkbox v-model="eventForm.remindDateCheckbox2" @change="remindDateCheckbox2">
								<span>到期前
									<span class="w-sm dis-inline m-l-sm m-r-sm">
										<el-select v-model="ruleForm.remindDay"  :disabled="eventForm.remindDateDisabled" placeholder="请选择">
										 	<el-option :label="item.level" :value="item.level" :key="item.level" v-for="item in remindDateList"></el-option>
			    					</el-select>
									</span>天提醒一次
								</span>
							</el-checkbox>
						</div>
					</el-form-item>

					<el-form-item label="其他设置" prop="useBalance" >
						<div>
							<el-checkbox label="优惠券与余额不能同时使用" v-model="eventForm.useBalance" ></el-checkbox>
						</div>
					</el-form-item>

					<el-form-item label="同步打标签">
				  <el-tag class="m-r m-b-xs"
					  :key="tag"
					  v-for="tag in eventForm.tagList"
					  :closable="true"
					  :close-transition="false"
					  @close="delTag(tag)"
					>
					{{tag}}
					</el-tag>
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
			  </el-form-item>

					<el-form-item label="使用说明" prop="detail" :rules="[
					  { required: false, max: 200, message: '内容长度在200个字内容', trigger: 'blur' }
					]">
					  <div class="w-lg">
					  	<el-input type="textarea" v-model="ruleForm.detail"
												:autosize="{ minRows: 4, maxRows: 6}"
												placeholder="填写活动的详细说明，支持换行。"></el-input>
					  </div>
				  </el-form-item>
					<el-form-item label="备注" prop="remark" :rules="[
								{ required: false, max: 200, message: '内容长度在200个字内容', trigger: 'blur' }
							]">
					  <div class="w-lg">
					  	<el-input type="textarea" v-model="ruleForm.remark"
												:autosize="{ minRows: 3, maxRows: 5}"
												placeholder="备注，支持换行。"></el-input>
					  </div>
				  </el-form-item>
				  <el-form-item label="">
						<router-link to="/marketing/coupon/send">
			  			<el-button>取消</el-button>
						</router-link>
						<el-button type="primary" :loading="saveBtnLoading" @click="submitForm('ruleForm')">{{saveBtnLoadingText}}</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</div>

	</div>
</template>

<script>
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import validate from '@/utils/helpers/validate'
	import time from '@/utils/helpers/timeLite'
	import calculation from '@/utils/helpers/calculation'
	import couponUseRule from '@/components/Coupon/use_rule'

	export default {
    components: {couponUseRule}, data: function() {
			return {
				ruleForm: {
				  disType: 1, // 派发类型 1.选中用户 2.筛选用户
          userSearchKey: '',
					ids: '',
					type: 2,	//COUPON_TYPE
					name: '',		//名称
					amount:'', //非随机-面值 （单位分）
          cnt: 0,	//发放总量
					random:0,		//随机
					minAmount: '',	//最小金额（单位分）
					maxAmount: '',	//最大金额（单位分）
					fullAmount: '0', //满xx元可用
					perUserNum: '1',		//每人限领xx张
					dateType: '1',	//日期类型 1.固定日期 2.激活后有效天数
					term: '',	//领取后n天内有效
					timeStart: '',	//生效日期
					timeEnd: '',		//过期日期
					level: '',		//关联的可以领取的会员等级
					detail: '',		//使用说明
					remark: '',		//备注
					tagNames: '',	//标签 json格式
					couponRuleId:'',	//优惠券使用限制关联表id
					share: 1,	//是否可用分享
					isShared: 0,//是否分享过
          remindDay: '',	//提醒日期
          useBalance: '',	//是否可用于金额同用
        },
				eventForm:{		//
					randomCheckbox: false,
					fullAmountCheckbox1: true,
					fullAmountCheckbox2: false,
					fullAmountDisabled : true,
					perUserNumCheckbox1: true,
					perUserNumCheckbox2: false,
					perUserNumDisabled: true,
          remindDateCheckbox1: true,
          remindDateCheckbox2: false,
          remindDateDisabled: true,
          useBalance: false,
					maxTag : 10,		//最多能添加数
					tagList:[],
					saveTagList:[]
				},
        pickerOptions0: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							const date = new Date();
							picker.$emit('pick', [date, date]);
						}
					},{
						text: '明天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() + 3600 * 1000 * 24);
							picker.$emit('pick', [date, date]);
						}
					}, {
						text: '三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							end.setTime(end.getTime() + 3600 * 1000 * 24 * 30 * 3);
							picker.$emit('pick', [start, end]);
						}
					}]
        },
				cnt:0,
				tagShow: true,
				inputVisible: false,
    		inputValue: '',
				tagInputValue: '',
				levelList:[],
        remindDateList:[{level:'1'},{level:'2'},{level:'3'},
          {level:'4'},{level:'5'},{level:'6'},{level:'7'},{level:'8'},{level:'9'},{level:'10'}],	//提醒日期
				levelObj:{},
				couponRuleObj:{},
				timeStartObj:[],
				timeEndObj:{},
				saveBtnLoading : false,
				saveBtnLoadingText : '保存'
			}
		},
		created(){
			let query = this.$route.query;
			if (query) {
        this.cnt = query._cnt;
        this.ruleForm.disType = query._disType;
        if (query._disType == 1) {
          this.ruleForm.ids = query._ids;
				} else {
          this.ruleForm.userSearchKey = JSON.stringify(query);
				}
			}
    },
		methods: {
			//日期
			changeTimeStart(item){
				this.ruleForm.timeStart = time.getDate(item[0])
				this.ruleForm.timeEnd = time.getDate(item[1])
			},
			changeLevel(item) {
				 this.ruleForm.level = item.level
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
			randomCheckbox(value){
				this.ruleForm.random = this.eventForm.randomCheckbox ? 1 : 0
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
			checkNumber(rule, value, callback) {
			 if (!validate.number(value, rule.min, rule.max, rule.ignoreEmpty)) {
				 callback(new Error());
			 } else {
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
			delTag(tag) {
        this.eventForm.tagList.splice(this.eventForm.tagList.indexOf(tag), 1)
				this.tagShow = this.eventForm.tagList.length < this.eventForm.maxTag
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
        });
      },
			onCouponUseRuleCallback(data){
				this.$store.dispatch('post', {
					uri: 'couponRule/temp/add',
					data: data
				}).then((res) => {
			    this.ruleForm.couponRuleId = res.data.data.id + ''
				})
			},
			submitForm (formName){
				this.ruleForm.tagNames = helpers.arrayToJson(this.eventForm.saveTagList);
				this.$refs[formName].validate((valid) => {

					if (valid) {
            this.saveBtnLoading = true;
            this.saveBtnLoadingText = "保存中...";
					  let ruleForm = {...this.ruleForm};
						if(!this.eventForm.randomCheckbox){
							ruleForm.amount = calculation.accMul(ruleForm.amount, 100)
						}else{
							ruleForm.minAmount = calculation.accMul(ruleForm.minAmount, 100);
							ruleForm.maxAmount = calculation.accMul(ruleForm.maxAmount, 100)
						}
						if(!this.eventForm.fullAmountDisabled){
							ruleForm.fullAmount =  calculation.accMul(ruleForm.fullAmount, 100)
						}
            ruleForm.useBalance = this.eventForm.useBalance? 0 : 1;
            ruleForm.remindDay = ruleForm.remindDay ? ruleForm.remindDay : '-1';
						this.$store.dispatch('post', {
							uri: 'couponInfo/distribute',
							data: ruleForm,
              forceResolve: true
						}).then((res) => {
						  if (res.data.httpCode == 200) {
                msg.success();
                this.$router.push({ path: '/marketing/coupon/send' })
							} else {
						  	msg.error(res.data.msg);
                this.saveBtnLoading = false;
                this.saveBtnLoadingText = "保存";
							}
						})
					}
				})
      }

    }
	}
</script>

<style scoped>
	.coupons_give_user {
		padding: 0px;
		position: relative;
		margin-bottom: 10px;
		display: block;
		overflow: hidden;
	}
	.coupons_give_user .total_show {
		border: 1px solid #D5E5FF;
		background-color: #f5fbff;
		line-height: 30px;
		padding: 15px;
		text-align: center;
		font-size: 22px;
	}
	.total_show span {
		font-weight: 500;
		color: #ff6600;
		font-size: 24px;
	}
	.membership-container {
		position: relative;
	}
	.membership-sidebar {
		position: absolute;
		top: 0;
		left: 0;
	}
	.membership-sidebar .img {
		width: 350px;
		height: auto;
	}
	.membership-sidebar .content2 {
		position: absolute;
		top: 60px;
		left: 1px;
		right: 1px;
	}
	.membership-sidebar .content2 .text-box {
		padding-bottom: 10px;
		background: #f66400;
		background: linear-gradient(#f66400, #f7882a);
	}
	.b-box {
		height: 20px;
		background: linear-gradient(rgba(255,255,255,0) 50%, #f9f9f9 0) 0 0,radial-gradient(circle closest-corner, #f9f9f9 50%, #f7882a 0) 0 0;
		background-size: 20px 20px;
		background-repeat: repeat-x;
	}
	.b-text {
		background: #f9f9f9;
		padding: 0 15px 6px 15px;
	}
	.membership-sidebar .card {
		background: #60be4e;
		padding: 20px;
		border-radius: 8px;
		margin: 0 20px;
	}
	.membership-content {
		margin-left: 440px;
	}
	.text {
		margin: 0 80px;
		height: 50px;
		line-height: 25px;
	}
	.tip {
		padding: 10px 0;
	}
	.input-new-tag {
		width: 80px;
	}
	.text-vlg {
		font-size: 28px;
	}
	.text-white-transp {
		color: rgba(255,255,255,0.8);
	}
</style>
