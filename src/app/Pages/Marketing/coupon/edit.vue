<template>
	<div>
		<div class="m-b-lg">
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="get"><i class="el-icon-arrow-left icon-smaller"></i>优惠券</el-breadcrumb-item>
			  <el-breadcrumb-item>编辑优惠券</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="membership-container clearfix">
			<div class="membership-sidebar">
				<img class="img b-a" src="/static/img/membership_card.png" alt="">
				<div class="content2">
					<div class="text-box text-white">
						<p class="wrapper text-white-transp">{{ ruleForm.name || '优惠券名称'}}</p>
						<div class="m-t-lg text-center">
							<p>
								<span class="text-vlg" v-show="!eventForm.randomCheckbox">{{ruleForm.amount}}</span>
								<span class="text-vlg" v-show="eventForm.randomCheckbox">
									{{ruleForm.minAmount}} <label style="font-size: 14px;">至</label>  {{ruleForm.maxAmount}}
								</span>元
							</p>
							<p class="text-white-transp" v-show="eventForm.fullAmountCheckbox2">
								满 {{ruleForm.fullAmount}}元可用
							</p>
							<p class="text-white-transp" v-show="ruleForm.dateType == 1">{{ruleForm.timeStart | getDate}} 至 {{ruleForm.timeEnd | getDate}} 有效</p>
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
						<div class="dis-inline" v-if="!ruleForm.random">
							<div class="w-lg m-r-sm dis-inline">
								<el-form-item  prop="amount">
									<el-input v-model="ruleForm.amount" :disabled="true" type="number"></el-input>
								</el-form-item>
							</div>元
						</div>

						<div class="dis-inline" v-if="ruleForm.random">
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item  prop="minAmount">
									<el-input v-model="ruleForm.minAmount" :disabled="true" type="number"></el-input>
								</el-form-item>
							</div> 至
							<div class="w-xs m-r-sm dis-inline">
								<el-form-item  prop="maxAmount">
									<el-input v-model="ruleForm.maxAmount" :disabled="true" type="number"></el-input>
								</el-form-item>
							</div>元
						</div>

						<div class="dis-inline">
							<el-checkbox v-model="eventForm.randomCheckbox" :disabled="true">
									<span>随机</span>
							</el-checkbox>
						</div>
				  </el-form-item>

				  <el-form-item label="发放总量" prop="cnt" :rules="[
				    { required: true, message: '请输入发放总量', trigger: 'blur' },
				    {validator: checkNumber, min:1, max:99999, message: '有效数量1至99999之间的正整数', trigger: 'blur'}
				  ]">
					  <div class="w-lg m-r-sm dis-inline">
					  	<el-input v-model="ruleForm.cnt" type="number"></el-input>
					  </div>张
				  </el-form-item>

				  <el-form-item label="使用限制" prop="fullAmount">
			      <div>
			      	<el-checkbox label="不限制" v-model="eventForm.fullAmountCheckbox1" :disabled="true"></el-checkbox>
			      </div>
			      <div class="m-t-sm">
			      	<el-checkbox v-model="eventForm.fullAmountCheckbox2" :disabled="true">
								<span>满
									<span class="w-sm dis-inline m-l-sm m-r-sm">
										<el-input type="number" v-model="ruleForm.fullAmount" :disabled="eventForm.fullAmountDisabled"></el-input>
									</span>元可用
								</span>
							</el-checkbox>
			      </div>
				  </el-form-item>

				  <el-form-item label="每人限领" prop="perUserNum">
			      <div>
			      	<el-checkbox label="不限制" v-model="eventForm.perUserNumCheckbox1" :disabled="true"></el-checkbox>
			      </div>
			      <div class="m-t-sm">
			      	<el-checkbox v-model="eventForm.perUserNumCheckbox2" :disabled="true">
								<span>
									<span class="w-sm dis-inline m-l-sm m-r-sm">
										<el-input type="number" v-model="ruleForm.perUserNum" :disabled="eventForm.perUserNumDisabled"></el-input>
									</span>张
								</span>
							</el-checkbox>
			      </div>
				  </el-form-item>

					<el-form-item label="日期类型" prop="dateType">
						<template v-if="ruleForm.dateType == 1">
							<el-button :disabled="true">固定时间</el-button>
						</template>
						<template v-if="ruleForm.dateType == 2">
							<el-button :disabled="true">领取后有效期</el-button>
						</template>
					</el-form-item>

				  <el-form-item v-if="ruleForm.dateType==1" label="有效日期" prop="timeStart">
						<span class="dis-inline m-r-sm">
							<el-input v-model="timeStartObj" :disabled="true"></el-input>
						</span>
				  </el-form-item>

					<el-form-item v-if="ruleForm.dateType==2" label="有效天数" prop="term">
						<div>
							<span class="dis-inline m-r-sm">
								<el-input type="number" v-model="ruleForm.term" :disabled="true" placeholder="领取后n天内有效"></el-input>
							</span>天
						</div>
					</el-form-item>

					<el-form-item label="会员卡等级" prop="level" :rules="[
					   { required: true, message: '请选择使用限制' },
					  {validator: checkSelect, message: '请选择等级', trigger: 'change'}]">
			    <el-select v-model="levelObj" placeholder="会员卡等级" :disabled="true">
              <el-option :label="item.text" :value="index" :key="item.level" v-for="(item,index) in levelList"></el-option>
			    </el-select>
			  </el-form-item>

				  <el-form-item label="使用规则">
						<span class="dis-inline m-r-sm">
							<el-input v-model="ruleForm.ruleName" :disabled="true"></el-input>
						</span>
				  </el-form-item>

					<el-form-item label="提醒设置" >
						<div>
							<el-checkbox label="不提醒" v-model="eventForm.remindDateCheckbox1" :disabled="true"></el-checkbox>
						</div>
						<div class="m-t-sm">
							<el-checkbox v-model="eventForm.remindDateCheckbox2" :disabled="true">
								<span>到期前
									<span class="w-sm dis-inline m-l-sm m-r-sm">
										<el-select v-model="ruleForm.remindDay"  :disabled="true" placeholder="请选择">
										 	<el-option :label="item.level" :value="item.level" :key="item.level" v-for="item in remindDateList" :disabled="true"></el-option>
			    					</el-select>
									</span>天提醒一次
								</span>
							</el-checkbox>
						</div>
					</el-form-item>

					<el-form-item label="其他设置" prop="useBalance" >
						<div>
							<el-checkbox label="优惠券与余额不能同时使用" :true-label="1" :false-label="0" v-model="ruleForm.useBalance" :disabled="true"></el-checkbox>
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
						<router-link to="/marketing/coupon/get">
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
					type: 1,	//COUPON_TYPE
					name: '',		//名称
					amount:'', //非随机-面值 （单位分）
          cnt: '',	//发放总量
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
          ruleName:'',	//优惠券使用限制关联表id
          remindDay:'',//提醒天数
          useBalance: 0,
					share: 1,	//是否可用分享
					isShared: 0	//是否分享过
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
					maxTag : 10,		//最多能添加数
					tagList:[],
					saveTagList:[]
				},
				tagShow: true,
				inputVisible: false,
    		inputValue: '',
				tagInputValue: '',
        remindDateList:[{level:'1'},{level:'2'},{level:'3'},
          {level:'4'},{level:'5'},{level:'6'},{level:'7'},{level:'8'},{level:'9'},{level:'10'}],
				levelList:[],
				levelObj:'',
				timeStartObj:'',
				timeEndObj:{},
				saveBtnLoading : false,
				saveBtnLoadingText : '保存'
			}
		},
		created(){
			this.queryLevelList()
    },
		methods: {
		  queryDetail() {
        let id = this.$route.query.id;
        this.$store.dispatch('post', {
          uri : 'couponInfo/detail',
					data: {id}
        }).then((res) =>{
          let ruleForm = res.data.data;
					if (ruleForm.random) {
            this.eventForm.randomCheckbox = true;
            ruleForm.minAmount = calculation.accDiv(ruleForm.minAmount, 100);
            ruleForm.maxAmount = calculation.accDiv(ruleForm.maxAmount, 100);
					} else {
            ruleForm.amount = calculation.accDiv(ruleForm.amount, 100);
					}
					//ruleForm.useBalance = ruleForm.useBalance == 0 ;
          ruleForm.cnt = ruleForm.cnt.toString();

          ruleForm.fullAmount = calculation.accDiv(ruleForm.fullAmount, 100);
					if (ruleForm.fullAmount) {
            this.eventForm.fullAmountCheckbox1 = false;
            this.eventForm.fullAmountCheckbox2 = true;
					} else {
            this.eventForm.fullAmountCheckbox1 = true;
            this.eventForm.fullAmountCheckbox2 = false;
					}
					this.eventForm.remindDateCheckbox1 = ruleForm.remindDay < 0 ;
					this.eventForm.remindDateCheckbox2 = ruleForm.remindDay >= 0;
          ruleForm.remindDay = ruleForm.remindDay < 0 ? '' : ruleForm.remindDay;
          ruleForm.dateType = ruleForm.dateType.toString();

          let levelList = this.levelList;
          for (let i = 0; i < levelList.length; i ++) {
            if (levelList[i].level == ruleForm.level) {
              this.levelObj = i;
              break;
            }
          }
          this.timeStartObj = time.getDate(ruleForm.timeStart) + ' - ' +
						time.getDate(ruleForm.timeEnd);

          if (ruleForm.tagNames) {
            let stList = JSON.parse(ruleForm.tagNames);
            let tList = [];
            for (let i = 0; i < stList.length; i ++) {
              tList.push(stList[i].name);
						}
						this.eventForm.saveTagList = stList;
						this.eventForm.tagList = tList;
					}

					this.ruleForm = {...ruleForm};
        })
			},
			//等级
			queryLevelList(){
			 let list = [];
			 this.$store.dispatch('post', {
				 uri : 'userLevel/list',
			 }).then((res) =>{
				 let levelList = res.data.data.list;
				 let tmpLevelList = []
				 levelList.forEach(function (item) {
					 item.text = item.name + '（'+item.level+'级）'
					 tmpLevelList.push(item)
         })
				 tmpLevelList.unshift({text:'所有等级', level: -1})
			   this.levelList = tmpLevelList;

				 this.queryDetail();
			 });
			},
			//日期
			changeTimeStart(item){
				this.ruleForm.timeStart = time.getDate(item[0])
				this.ruleForm.timeEnd = time.getDate(item[1])
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
                tagList.push(name);
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
			submitForm (formName){
			  this.saveBtnLoading = false
				this.saveBtnLoadingText = "保存"
				this.ruleForm.tagNames = helpers.arrayToJson(this.eventForm.saveTagList)
				this.$refs[formName].validate((valid) => {

					if (valid) {
            this.saveBtnLoading = true
            this.saveBtnLoadingText = "保存中..."
					  let ruleForm = {...this.ruleForm}

					  if(ruleForm.minAmount && ruleForm.minAmount != '' && Number(ruleForm.minAmount) > 0) {
              ruleForm.minAmount = calculation.accMul(ruleForm.minAmount, 100);
            }
	  				if(ruleForm.maxAmount && ruleForm.maxAmount != '' && Number(ruleForm.maxAmount) > 0) {
              ruleForm.maxAmount = calculation.accMul(ruleForm.maxAmount, 100);
            }
	  				if(ruleForm.fullAmount && ruleForm.fullAmount != '' && Number(ruleForm.fullAmount) > 0) {
              ruleForm.fullAmount = calculation.accMul(ruleForm.fullAmount, 100);
            }
            if(ruleForm.amount && ruleForm.amount != '' && Number(ruleForm.amount) > 0) {
              ruleForm.amount = calculation.accMul(ruleForm.amount, 100);
            }

            ruleForm.createTime = null;
            ruleForm.updateTime = null;
            ruleForm.timeStart = null;
            ruleForm.timeEnd = null;

						this.$store.dispatch('post', {
							uri: 'couponInfo/update',
							data: ruleForm,
              forceResolve: true
						}).then((res) => {
						  if (res.data.httpCode == 200) {
                msg.success();
                this.$router.push({ path: '/marketing/coupon/get' })
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
