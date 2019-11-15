<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
    	<!-- <div class="client-box clearfix v-middle m-t-lg">
			<img class="img pull-left" :src="dataInfo.info.headimgPath || '/static/img/user/def.png'" alt="">
			<div class="v-middle content">
				<p><span class="text-black m-r-xl">{{dataInfo.info.name}}</span><a class="text-primary" @click="showDialog('name')">修改</a></p>
				<p class="text-muted"><span>微信呢称：</span><span>{{dataInfo.info.wxNickname}}</span></p>
				<p>
					<span class="icon-svg icon-svg-weixin" v-if="dataInfo.info.wxId != -1"></span>
					<span class="icon-svg icon-svg-mobile2" v-if="dataInfo.info.phone"></span>
					<span class="icon-svg icon-svg-android" v-if="dataInfo.info.verifyAndriod == 1"></span>
					<span class="icon-svg icon-svg-iphone" v-if="dataInfo.info.verifyIos == 1"></span>
					<span class="icon-svg icon-svg-mobile1" v-if="dataInfo.info.verifyPhone == 1"></span>
					<span class="text-danger m-r v-middle" v-if="dataInfo.info.subscribe == 3">微信已跑路</span>
					<a class="text-primary" v-if="dataInfo.info.wxId != -1" @click="unBindWx">解绑微信</a>
				</p>
			</div>
		</div> -->
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'1'"></v-list-tab-nav>
		</div>
		<div class="ukao-tb-default m-t-xl">
			<table class="ukao-table" style="width: 100%">
				<tbody>
					<tr>
						<td style="width: 30%">手机号</td>
						<td>{{dataInfo.info.phone}}</td>
						<td style="width: 20%"><auth perm="client.list.all.update"><el-button @click="showDialog('phone')">修改</el-button></auth></td>
					</tr>
					<tr>
						<td v-if="mercInfo && mercInfo.otherEnable"  rowspan="2">余额</td>
						<td v-else>余额</td>
						<td>
							{{dataInfo.ext.balance | amtFormat}}元
						</td>
						<td>
							<auth perm="client.list.all.recharge">
								<el-button v-if="workInfo.roleId !== 1" @click="onRecharge(1)">余额充值</el-button>
							</auth>
							<auth perm="client.list.all.chgbal">
								<el-button @click="showDialog('balance')">修改</el-button>
							</auth>
            </td>
					</tr>
					<tr v-if="mercInfo && mercInfo.otherEnable">
						<td>含通洗卡余额：{{dataInfo.ext.otherBalance | amtFormat}}元</td>
						<td>
							<auth perm="client.list.all.recharge">
								<el-button v-if="workInfo.roleId !== 1" @click="onRecharge(2)">通洗卡充值</el-button>
							</auth>
						</td>
					</tr>

					<tr>
						<td>积分</td>
						<td>{{dataInfo.ext.point}}</td>
						<td>
							<auth perm="client.list.all.point">
								<el-button @click="showDialog('point')">加积分</el-button>
							</auth>
						</td>
					</tr>
					<tr v-if="dataInfo.card">
						<td>会员卡号</td>
						<td>{{dataInfo.card?dataInfo.card.no:''}}</td>
						<td><auth perm="client.list.all.update"><el-button @click="showDialog('no')">修改</el-button></auth></td>
					</tr>
					<tr v-if="dataInfo.card && dataInfo.card.info">
						<td>会员卡</td>
						<td>
							{{dataInfo.card.info.name || ''}}（{{dataInfo.card.info.discount | cardDiscount(dataInfo.card.info.discountType)}}）
							<p v-if="dataInfo.groupCard">团卡：<router-link class="text-primary" target="_blank" :to="'/marketing/visitors/detail/'+dataInfo.groupCard.groupCardId">{{dataInfo.groupCard.groupCardName}}</router-link></p>
						</td>
						<td>
							<auth perm="client.list.all.card">
								<el-button @click="showDialog('card')">修改</el-button>
							</auth>
						</td>
					</tr>
          <tr>
            <td>实体会员卡</td>
            <td>
              <p v-if="dataInfo.card && dataInfo.card.isBinding == 1" class="text-success">已绑定</p>
              <p v-else class="text-danger">未绑定</p>
              <p v-if="dataInfo.card && dataInfo.card.isBinding == 1">{{dataInfo.card.rfidNo}}</p>
            </td>
            <td>
							<auth perm="client.list.all.card">
								<template v-if="dataInfo.card && dataInfo.card.isBinding == 1">
									<el-button plain type="danger" @click="unbundledEntityCard(11,dataInfo.card.rfidId)">解绑</el-button>
									<el-button plain type="danger" @click="InvalidEntityCard(11, dataInfo.card.rfidId)">作废</el-button>
								</template>
								<template v-else>
									<el-button @click="openEntityCard(11)">绑定</el-button>
								</template>
							</auth>
            </td>
          </tr>
          <tr>
            <td>优付卡</td>
            <td>
              <div v-if="dataInfo.uPayCard">
                <p>{{dataInfo.uPayCard.balance || 0 | amtFormat}}元</p>
                <p>支付比例{{dataInfo.uPayCard.payRatio}}%</p>
              </div>
              <div v-else class="text-danger">未绑定</div>
            </td>
            <td>
							<auth perm="client.list.all.card">
								<template v-if="!dataInfo.uPayCard">
									<el-button @click="openEntityCard(41)">绑定</el-button>
								</template>
								<!--<template v-else>-->
									<!-- <el-button plain type="danger" @click="unbundledEntityCard(41,dataInfo.uPayCard.rfidId)">解绑</el-button>
								<el-button plain type="danger" @click="InvalidEntityCard(41, dataInfo.uPayCard.rfidId)">作废</el-button> -->
								<!--</template>-->
							</auth>
            </td>
          </tr>
          <tr>
            <td>团体客户</td>
            <td colspan="2">
              <router-link v-if="dataInfo.unionInfo" :to="'/marketing/group/detail/'+dataInfo.unionInfo.id" class="text-primary" target="_blank">{{dataInfo.unionInfo.name}}</router-link>
              <p v-else>无团体</p>
            </td>
          </tr>
					<tr>
						<td>创建时间</td>
						<td>{{dataInfo.info.createTime | getDateTime}}</td>
						<td></td>
					</tr>
					<tr>
						<td>性别</td>
            <td>
              <span v-if="dataInfo.info.sex == 0">未知</span>
              <span v-if="dataInfo.info.sex == 1">男</span>
              <span v-if="dataInfo.info.sex == 2">女</span>
            </td>
						<td><auth perm="client.list.all.update"><el-button @click="showDialog('sex')">修改</el-button></auth></td>
					</tr>
					<tr>
						<td>出生日期</td>
						<td>{{dataInfo.ext.birthday}}</td>
						<td><auth perm="client.list.all.update"><el-button @click="showDialog('birthday')">修改</el-button></auth></td>
					</tr>
					<tr>
						<td>客户分组</td>
						<td>
							<auth perm="client.list.all.update">
								<el-dropdown @command="updateGroup" trigger="click">
									<span class="el-dropdown-link text-primary">
										{{dataInfo.group.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
									</span>
									<el-dropdown-menu slot="dropdown" style="height: 300px;overflow: auto">
										<el-dropdown-item :command="JSON.stringify({group:{id:-1, name:'默认分组'}})">默认分组</el-dropdown-item>
										<el-dropdown-item v-for="group in groupList" :key="group.id" :command="JSON.stringify({group})">{{group.name}}</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
								<template slot="noPerm">{{dataInfo.group.name}}</template>
							</auth>
						</td>
						<td></td>
					</tr>
					<tr>
						<td>客户标签</td>
						<td>
							<auth perm="client.list.all.update">
								<el-tag class="m-r-sm m-b-xs "
									type="primary"
									size="medium"
									:key="tag.relId"
									v-for="tag in dataInfo.tagList"
									:closable="true"
									:close-transition="false"
									@close="delTag(tag)"
								>
								{{tag.userTag.name}}
								</el-tag>
								<el-input
									class="w-xxs"
									v-if="showTagInput"
									v-model="tagInputValue"
									ref="saveTagInput"
									size="mini"
									@keyup.enter.native="addTagConfirm"
									@blur="addTagConfirm"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 添加标签</el-button>
								<template slot="noPerm">
									<el-tag class="m-r-sm m-b-xs"
													size="medium"
													type="primary"
													:key="tag.relId"
													v-for="tag in dataInfo.tagList"
													:close-transition="false"
										>
											{{tag.userTag.name}}
									</el-tag>
								</template>
							</auth>
						</td>
						<td></td>
					</tr>
					<tr v-if="dataInfo.isRecommend && dataInfo.friend">
						<td>推荐方</td>
						<td>
							<p>
								<a class="text-primary" target="_blank" :href="'/marketing/friend/detail/'+dataInfo.friend.id">{{dataInfo.friend.phone}}</a>
								<a class="text-primary" target="_blank" :href="'/marketing/friend/detail/'+dataInfo.friend.id">{{dataInfo.friend.name}}</a>
							</p>
							<p>{{dataInfo.friend.profitDate| getDate}} 前分润</p>
						</td>
						<td>

						</td>
					</tr>
				<tr>
					<td>是否享受会员价</td>
					<td></td>
					<td>
						<el-switch
							style="display: block"
							v-model="dataInfo.card.isVip"
							:active-value="1"
							:inactive-value="0"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开启"
							inactive-text="关闭"
							@change="changeIsVip"
						>
						</el-switch>
					</td>
				</tr>
				</tbody>
			</table>
		</div>

    <el-dialog class="ukao-dialog"
               :title="editDialog.title"
               :visible.sync="editDialog.show"
               size="small">
      <div>
        <el-form :model="formData" ref="editForm" label-width="120px">
          <el-form-item label="姓名" v-if="key == 'name'" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
            <div class="w-lg">
              <el-input :maxlength="32" v-model="formData.name"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="手机号" v-if="key == 'phone'" prop="phone"
                        :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkPhone, message: '请输入正确的手机号', trigger: 'blur' }]">
            <div class="w-lg">
              <el-input :maxlength="20" v-model="formData.phone"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="积分" v-if="key == 'point'" prop="point"
                        :rules="{validator: checkNumber, min:-10000000, max:10000000, message: '无效的积分', trigger: 'blur'}">
            <div class="w-lg">
              <el-input type="number" v-model="formData.point"></el-input>
            </div>
            <p class="text-muted tip-text">负数扣积分</p>
          </el-form-item>

					<el-form-item label="余额" v-if="key == 'balance'" prop="balance"
                        :rules="{validator: checkAmount, min:-10000000, max:10000000, message: '无效不合法', trigger: 'blur'}">
            <div class="w-lg">
              <el-input type="number" v-model="formData.balance"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="会员卡号" v-if="key == 'no'" prop="no"
                        :rules="{ required: true, message: '请输入卡号', trigger: 'blur' }">
            <div class="w-lg">
              <el-input :maxlength="32" v-model="formData.no"></el-input>
            </div>
          </el-form-item>

					<el-form-item label="会员卡" v-if="key == 'card'" prop="carId"
                        :rules="{ required: true, message: '请输选择要修改的会员卡' }">
            <div class="w-lg">
							<el-select class="uk-search-content" v-model="formData.carId" placeholder="请选择">
								<el-option v-for="(item,index) in userCardList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status != 1">
                  {{item.name}}（{{item.discount | cardDiscount(item.discountType)}}）
                </el-option>
								</el-select>
            </div>
          </el-form-item>

          <el-form-item label="性别" v-if="key == 'sex'" prop="sex"
                        :rules="{ required: true, type:'number', message: '请选择性别', trigger: 'blur' }">
            <div class="w-lg">
              <el-radio class="radio" v-model="formData.sex" :label="1">男</el-radio>
              <el-radio class="radio" v-model="formData.sex" :label="2">女</el-radio>
              <el-radio class="radio" v-model="formData.sex" :label="0">未知</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="出生日期" v-if="key == 'birthday'" prop="birthday"
                        :rules="{ required: true, type:'date', message: '请选择出生日期', trigger: 'change' }">
            <div class="w-lg">
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                :clearable="false"
                placeholder="选择日期"
                :picker-options="birthdayOptions">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="editDialog.show=false">取消</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
		<!-- 充值弹窗 -->
		<el-dialog :title="dialog.title" size="tiny" :visible.sync="showRecharge">
			<recharge :name="dataInfo.info.name" :phone="dataInfo.info.phone" :id="dataInfo.info.id" :type="dialog.type" @cancel="showRecharge = false"  @success="cashRechargeSuccess"></recharge>
		</el-dialog>
    <!-- RFID卡操作弹框 -->
		<el-dialog class="ukao-dialog"
			:title="`绑定${cardForm.type == 11 ? '实体会员卡' : '优付卡'}`"
			:visible.sync="cardFormVisible"
			size="small">
			<el-form :model="cardForm" ref="cardForm">
				<el-form-item label="RFID卡" prop="rfidNo" label-width="150px" :rules="[
						{ required: true, message: '请填写RFID卡'}
					]">
					<div class="w-lg">
						<el-input  v-model="cardForm.rfidNo" placeholder="请输入RFID工卡号"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="验证码" label-width="150px" prop="checkCode"  :rules="[
						{ required: true, message: '请填写验证码'}
					]">
					<div class="w-lg">
						<el-input class="w-lg" v-model="cardForm.checkCode" placeholder="请输入验证码"></el-input>
					</div>
				</el-form-item>
				<el-form-item label-width="150px">
					<el-button @click="cardFormVisible=false">取消</el-button>
					<el-button type="primary"  @click="bundledEntityCard">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import recharge from '@/components/Recharge/index'
	import vListTop from '@/app/Pages/Client/List/listtop';
  import vListTabNav from '@/app/Pages/Client/List/listtabnav';
  import calculation from '@/utils/helpers/calculation'
  import msg from '@/utils/msg'
  import time from '@/utils/helpers/timeLite'
  import validate from '@/utils/helpers/validate'
	import auth from "@/utils/auth";
	import {mapState} from 'vuex'

	export default {
		components: {
      vListTop, vListTabNav,recharge
		},
		data: function() {
		  let funs = {
		    name: {title:'修改姓名', url: 'userInfo/update', obj:'info'},
		    phone: {title:'修改手机号', url: 'userInfo/update', obj:'info'},
		    point: {title:'增减积分', url: 'userExt/increasePoint', obj:'ext'},
		    no: {title:'修改会员卡号', url: 'userInfo/update', obj:'card'},
		    sex: {title:'修改性别', url: 'userInfo/update', obj:'info'},
		    birthday: {title:'修改出生日期', url: 'userExt/update', obj:'ext'},
				balance: {title:'修改余额', url: 'userExt/balance/update', obj:'ext'},
				card: {title:'修改会员卡', url: 'userCard/updateUserCard', obj:'friend'}
		  };
			return {
			  isVip: 1,
				mercInfo: auth.getMercInfo(),
				dialog:{
				  title:'充值',
					type:1	//1余额充值，2通洗卡充值
        },
        id :this.$route.params.id,
        showRecharge: false, //显示充值金额弹窗
			  dataInfo: {
          info: {},
          ext: {},
          card: {
            info:{}
          },
          group: {
          }
        },
        birthdayOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        groupList:[],
				userCardList:[],
        showTagInput: false,
        tagInputValue: '',
        editDialog : {
          title:'新建分组名称',
          label:'',
          url:'',
          show:false
        },
        formData: {
          name: null,
          phone: null,
          sex: null,
          no:null,
          birthday:null,
					balance:null,
					carRelId:null,
					userId:null,
					card:null,
					carId:null
        },
        key:'',
        funs,
        cardFormVisible:false,
				cardForm:{
          type: 11, //卡的类型 11:实体会员卡 ， 41：优付卡
					rfidNo:'',
					checkCode:'',
				}
			}
		},
		created() {
			this.detail();
			this.queryGroupList();
			this.queryUserCardList();

		},
		methods: {
		  detail() {
		    let id = this.$route.params.id;
		    if (!id) {
          msg.error("无效的id");
		      return;
        }
        this.$store.dispatch('post', {
          uri : 'userInfo/detail',
          data: {id:id}
        }).then((res) =>{
          this.dataInfo = res.data.data;
        })
			},
      queryGroupList() {
        this.$store.dispatch('post', {
          uri : 'userGroup/list'
        }).then((res) =>{
          this.groupList = res.data.data.list || []
        })
      },
			queryUserCardList() {
		    var _this = this
				_this.$store.dispatch('post', {
						uri : 'userCard/listForSelect',
				}).then((res) =>{
					this.userCardList = res.data.data.list || []
				})
			},
      delTag(tag) {
		    let tagList = this.dataInfo.tagList;
        tagList.splice(tagList.indexOf(tag), 1);
        this.$store.dispatch('post', {
          uri : 'userTagRel/delete',
          data: {
            id: tag.relId
          }
        })
      },
      showInput() {
        this.showTagInput = true;
        this.$nextTick(_=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      addTagConfirm() {
        let name = this.tagInputValue;
        this.tagInputValue = null;
        if (name) {
          let item = this.dataInfo;
          if (!item.tagList) {
            this.$set(item, 'tagList', []);
          }
          let tag = {userTag:{name}};

          let addSign = true;
          item.tagList.forEach(function(item) {
            if (item.userTag.name == name) {
              addSign = false;
              return false;
            }
          });

          if (addSign) {
            item.tagList.push(tag);

            this.$store.dispatch('post', {
              uri : 'userTagRel/add',
              data: {
                userId: item.info.id,
                tagName: name
              }
            }).then((res)=>{
              tag.relId = res.data.data;
            });
          }

        }
        this.showTagInput = false;
      },
      updateGroup(command) {
        command = JSON.parse(command);
        if (this.dataInfo.group.id == command.group.id) {
          return;
        }

        this.dataInfo.group = command.group;

        this.$store.dispatch('post', {
          uri : 'userGroupRel/add',
          data: {
            userId: this.dataInfo.info.id,
            groupId: command.group.id
          }
        });
      },
      showDialog(key) {
		    let fun = this.funs[key];
		    this.key = key;
        this.editDialog.title = fun.title;
        this.editDialog.url = fun.url;
        this.formData = {
          id : this.dataInfo.info.id,
          userId : this.dataInfo.info.id,
          name: null,
          phone: null,
          sex: null,
          no: null,
          birthday:null,
					balance: null,
					carRelId: this.dataInfo.card.relId,
					carId:null
        };

        if (this.dataInfo[fun.obj]) {
          this.formData[key] = this.dataInfo[fun.obj][key];
				}

        if (key == 'no' && this.dataInfo.card) {
          this.formData.relId = this.dataInfo.card.relId;
        }

        if(key == 'balance' && this.dataInfo.ext){
					this.formData.balance = calculation.accDiv(this.dataInfo.ext.balance, 100)
        }
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields();
        }
        this.editDialog.show = true;
      },
      checkPhone(rule, value, callback) {
        if (!validate.tel(value)) {
          callback(new Error());
        } else {
          callback();
        }
      },
      checkNumber(rule, value, callback){
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
			onRecharge(type){
        this.showRecharge = true;
				this.dialog.type = type
				this.dialog.title = type == 1  ? "余额充值" : "通洗卡充值"
			},
      submitForm(){
        let _this = this;
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            let formData = {...this.formData};
            if (formData.birthday) {
              formData.birthday = time.getDate(formData.birthday);
            }
            if(formData.balance){
							formData.balance = calculation.accMul(formData.balance, 100) ;
						}
						if(formData.otherBalance){
							formData.otherBalance = calculation.accMul(formData.otherBalance, 100) ;
						}
            this.$store.dispatch('post', {
              uri: this.editDialog.url,
              data: {...formData}
            }).then((res)=>{
              _this.editDialog.show = false;
              msg.success();
              this.detail();
            })
          }
        });
      },
      cashRechargeSuccess(){ //充值成功
        this.detail();
        this.showRecharge = false;
      },
      unBindWx(){
        msg.confirm({
          msg:'解绑后用户需在微信端重新验证手机, 是否继续?',
          confirmFn:_=>{
            this.$store.dispatch('post',{
              uri:'userInfo/unBindWx',
              data:{id:this.dataInfo.info.id}
            }).then(res=>{
              msg.success();
              this.dataInfo.info.wxId = -1;
            })
          }
				});
			},
      InvalidEntityCard(type,id){ //实体卡作废
        msg.confirm({
          msg:'挂失作废后此卡将无法使用, 是否继续?',
          confirmButtonText:'确认作废',
          confirmFn:_=>{
            this.$store.dispatch('post',{
              uri:'rfidInfo/user/cancel',
              data:{rfidId:id,cardType:type}
            }).then(res=>{
              this.cardForm.type = type;
              this.delEntityCard();
              msg.success('已作废！')
            })
          }
        })
      },
      unbundledEntityCard(type,id){ //实体卡、优付卡解绑
        msg.confirm({
          msg:'解绑后该客户将无法使用此卡, 是否继续?',
          confirmButtonText:'确认解绑',
          confirmFn:_=>{
            this.$store.dispatch('post',{
              uri:'rfidInfo/user/unbundling',
              data:{rfidId:id,cardType:type}
            }).then(res=>{
              this.cardForm.type = type;
              this.delEntityCard();
              msg.success('已解绑！')
            })
          }
        })
      },
      delEntityCard(){ //删除实体卡、优付卡数据
        if(this.cardForm.type == 11){
          this.dataInfo.card.isBinding = 0;
          delete this.dataInfo.card.rfidCheckCode;
          delete this.dataInfo.card.rfidId;
          delete this.dataInfo.card.rfidNo;
          delete this.dataInfo.card.rfidStatus;
        }else{
          delete this.dataInfo.uPayCard
        }
      },
      bundledEntityCard(){ //绑定实体卡、优付卡
        this.$refs.cardForm.validate(valid=>{
          if(valid){
            this.$store.dispatch('post',{
              uri:'rfidInfo/user/binding',
              data:{
                userId: this.dataInfo.info.id,
                rfidNo: this.cardForm.rfidNo,
                checkCode: this.cardForm.checkCode,
                cardType : this.cardForm.type
              }
            }).then(res=>{
              this.detail();
              this.cardFormVisible = false;
						  msg.success('绑定成功！');
            })
          }
        })
      },
      openEntityCard(type){ //打开实体卡、优付卡绑卡弹窗
        this.cardForm.type = type;
        this.cardForm.rfidNo='';
        this.cardForm.checkCode='';
        this.cardFormVisible = true;
      },
      changeIsVip(){
        msg.confirm({
          msg: "确认修改当前状态？",
          confirmFn: this.updateCardIsVip,
          cancelFn: _ => {
            this.statusVal = !this.statusVal;
          }
        });
			},
			updateCardIsVip(){
        this.$store.dispatch('post',{
          uri:'userCardRel/update',
          data:{
            id: this.dataInfo.card.relId,
           isVip: this.dataInfo.card.isVip
          }
        }).then(res=>{});
			}
    },
    computed:{
      ...mapState([
        'workInfo'
      ])
    }
	}
</script>

<style>
	/* .client-box .img {
		width: 60px;
		height: auto;
		border-radius: 6px;
	}
	.client-box .content {
		margin-left: 70px;
	} */
</style>