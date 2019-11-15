<template>
	<div class="ukao-pt-md">
		<el-breadcrumb class="link-back"
		               separator="/">
			<el-breadcrumb-item to="/client/list/all">
				<i class="el-icon-arrow-left icon-smaller"></i>所有客户</el-breadcrumb-item>
			<el-breadcrumb-item>新建客户</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clearfix m-t-lg ">
			<el-form :model="ruleForm"
				         ref="ruleForm"
				         label-width="160px"
				         class="demo-ruleForm">
					<el-row>
						<el-col :span="10">
							<el-form-item label="手机号"
									prop="phone" :rules="[{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'},{validator: chPhoneCardNo, message: '手机号与会员卡二选一必填'}]">
								<div class="w-lg">
									<el-input v-model="ruleForm.phone" :maxlength="11" auto-complete="off" placeholder="请输入手机号"></el-input>
								</div>
							</el-form-item>
							<el-form-item label="姓名" prop="name" :rules="{min: 1, max: 25, message: '长度在1到25个长度', trigger: 'blur'}">
								<div class="dis-inline w-lg">
									<el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
								</div>
							</el-form-item>
							<el-form-item label="会员卡" prop="cardId" :rules="[{ required: true, message: '请选择会员卡'}]">
								<el-select :disabled="editCardDisable"
													 placeholder="请选择会员卡"
													 v-model="ruleForm.cardId">
									<el-option
										v-for="item in cardList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
										{{item.name}}（{{item.level}}级，{{item.discount | cardDiscount(item.discountType)}}）
              		</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="充值实付金额" prop="amount" :rules="{validator: checkAmount, min:1, max:10000000, ignoreEmpty:true, message: '无效的金额,保留二位小数', trigger: 'blur'}">
								<div class="dis-inline w-lg">
									<el-input type="number" v-model="ruleForm.amount" auto-complete="off" placeholder="请输入实付金额">
										<span slot="append">元</span>
									</el-input>
									<span class="text-muted text-sm">注：不参与充值优惠活动</span>
								</div>
							</el-form-item>
							<el-form-item label="分组" prop="groupId">
								<el-select clearable
													 v-model="ruleForm.groupId"
													 placeholder="请选择分组">
									<el-option
										v-for="item in groupList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="重要客户" prop="grade">
								<el-radio-group v-model="ruleForm.grade">
									<el-radio :label="-1">非重要客户</el-radio>
									<el-radio :label="1"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_blue.png"/>蓝冠</el-radio>
									<el-radio :label="2"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_yellow.png"/>皇冠</el-radio>
									<el-radio :label="3"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_purple.png"/>紫冠</el-radio>
								</el-radio-group>
								<div class="text-muted text-sm">注：重要客户分为三个等级：其中蓝冠等级最低，紫冠等级最高</div>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<el-form-item label="会员卡号" prop="cardNo">
								<div class="w-lg">
									<el-input v-model="ruleForm.cardNo" auto-complete="off" placeholder="请填写会员卡号"></el-input>
								</div>
							</el-form-item>
							<el-form-item label="性别" prop="sex">
								<el-radio-group v-model="ruleForm.sex">
									<el-radio :label="0">未知</el-radio>
									<el-radio :label="1">男</el-radio>
									<el-radio :label="2">女</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="标签">
								<el-select clearable multiple collapse-tags
													 v-model="tags"
													 placeholder="输选择标签">
									<el-option
										v-for="item in tagList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="充值赠送金额" prop="giftAmount" :rules="{validator: checkAmount, min:1, max:10000000, ignoreEmpty:true, message: '无效的金额,保留二位小数', trigger: 'blur'}">
								<div class="dis-inline w-lg">
									<el-input type="number" v-model="ruleForm.giftAmount" auto-complete="off" placeholder="请输入赠送金额">
										<span slot="append">元</span>
									</el-input>
								</div>
							</el-form-item>
							<el-form-item label="享受会员价" prop="isVip" v-if="mercInfo.isOpenVipPrice">
								<el-radio-group v-model="ruleForm.isVip">
									<el-radio :label="1">享受</el-radio>
									<el-radio :label="0">不享受</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="团体" prop="unionId">
								<el-select v-model="ruleForm.unionId"
													 filterable @change="chgUnion"
													 clearable
													 placeholder="全部">
									<el-option v-for="item in unionList"
														 :key="item.id"
														 :label="item.name"
														 :value="item.id">
									</el-option>
								</el-select>
								<div class="text-muted text-sm">若选择团体设置统一会员卡，则会覆盖当前所选择的会员卡</div>
							</el-form-item>
						</el-col>
					</el-row>

					<el-form-item v-if="ruleForm.amount || ruleForm.giftAmount" prop="toNotice">
						<el-checkbox v-model="ruleForm.toNotice">发送充值消息通知</el-checkbox>
					</el-form-item>

					<el-form-item>
						<el-button @click="resetForm('ruleForm')">重置</el-button>
						<el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
		</div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import auth from "@/utils/auth";
import msg from "@/utils/msg";
import regional from "@/utils/regional";
import validate from '@/utils/helpers/validate'
import calculation from "@/utils/helpers/calculation";

export default {
  data: function() {
    return {
      ruleForm: {
        name: "",
        phone: "",
        cardId: "",
        groupId: "",
        amount: "",
        grade: -1,
        cardNo: "",
        sex: 0,
        unionId: "",
        tagIds: "",
        giftAmount: "",
        isVip: 0,
        toNotice: false,
      },
      loading: false,
      tags: '',
      editCardDisable: false,
      mercInfo: auth.getMercInfo(),
      cardList: [],
      groupList: [],
      unionList:[],//团体列表
      tagList: [],
    };
  },
  created() {
    this.getCardList();
    this.getGroupList();
    this.queryUnionList();
    this.queryTagList();
  },
  methods: {
    // 获取会员卡列表 选项
    getCardList() {
      this.$store
        .dispatch("post", {
          uri: "userCard/listForSelect"
        })
        .then(res => {
          this.cardList = res.data.data.list;
        });
    },
    // 获取分组 选项
    getGroupList() {
      this.$store
        .dispatch("post", {
          uri: "userGroup/list"
        })
        .then(res => {
          this.groupList = res.data.data.list;
        });
    },
    // 获取团体客户
    queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        })
        .then(res => {
          this.unionList = res.data.data || [];
        });
    },
    queryTagList() {
			this.$store
				.dispatch("get", {
					uri: "userTag/list"
				})
				.then(res => {
					this.tagList = res.data.data.list || [];
				});
    },
    checkAmount(rule, value, callback) {
      if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
        callback(new Error());
      } else {
        callback();
      }
    },
    chPhoneCardNo(rule, value, callback) {
      if (!this.ruleForm.phone && !this.ruleForm.cardNo) {
        callback(new Error());
			} else {
        callback();
			}
		},
    chgUnion(id) {
      if (!id) {
        this.editCardDisable = false;
        return;
      }
      for (let i = 0; i < this.unionList.length; i ++) {
        if (this.unionList[i].id == id) {
          if (this.unionList[i].saleType == 2) {
            this.ruleForm.cardId = this.unionList[i].cardId;
            this.editCardDisable = true;
          } else {
            this.editCardDisable = false;
          }
          break;
        }
      }
    },
    resetForm(formName) {
      this.tags = [];
      this.editCardDisable = false;
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {

          if (this.tags) {
            this.ruleForm.tagIds = this.tags.join(',');
					}

					let form = {...this.ruleForm};
          form.amount = form.amount ? calculation.accMul(form.amount, 100) : "";
          form.giftAmount = form.giftAmount ? calculation.accMul(form.giftAmount, 100) : "";

					this.loading = true;
          this.$store
            .dispatch("post", {
              uri: "userInfo/add",
              data: form,
              forceResolve: true
            })
            .then(res => {
              if (res.data.httpCode == 200) {
                msg.success();
                this.$router.push({ path: "/client/list/all" });
							} else {
                msg.error(res.data.msg);
                this.loading = false;
							}
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>