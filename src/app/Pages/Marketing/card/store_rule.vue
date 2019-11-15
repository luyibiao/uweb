<template>
	<div>
		<div class="tip">
			会员储值可提升客户忠诚度、增强会员粘性。可根据需要创建储值规则，并针对不同的储值规则配置不同的储值营销活动，会员储值后客户可在消费时使用余额进行支付。
		</div>
		<!--<div class="m-t">-->
			<!--<ul class="ukao-tabs-nav clearfix">-->
				<!--<li class="ukao-tabs-item is-active">储值规则</li>-->
				<!--<li class="ukao-tabs-item" @click="routeTo">储值记录</li>-->
			<!--</ul>-->
		<!--</div>-->
		<div class="m-t">
			<div class="dis-inline m-r m-b-sm">
				<el-select class="w-sm" v-model="searchKeys.storeId" clearable placeholder="所属门店">
					<el-option
						v-for="item in storeList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</div>
			<div class="dis-inline m-b-sm">
				<el-button type="primary" @click="list(0)">筛 选</el-button>
			</div>
			<auth perm="marketing.storeRule.update">
				<div class="text-right">
					<el-button type="primary" @click="preAdd">新建储值规则</el-button>
				</div>
			</auth>
			<el-dialog class="ukao-dialog"
			  :title="editDialog.title"
			  :visible.sync="editDialog.show"
			  size="small">
			  <div>
			  	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
						<el-form-item class="w-lg" label="所属门店" prop="storeId" :rules="[{ required: true, message: '请选择门店' }]">
							<el-select v-model="ruleForm.storeId" clearable placeholder="请选择">
								<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in storeList"></el-option>
							</el-select>
						</el-form-item>
					  <el-form-item label="规则名称" prop="name">
						  <div class="w-md"><el-input placeholder="充500元送100元" :maxlength="25" v-model="ruleForm.name"></el-input></div>
					    <p class="text-muted tip-text">最多可输入25个字符</p>
					  </el-form-item>
					 	<el-form-item label="储值金额" prop="amount" :required="true" :rules="{validator: checkAmount, min:1, max:10000000, ignoreEmpty:false, message: '无效的金额', trigger: 'blur'}">
						  <span class="dis-inline w-md m-r-xs"><el-input type="number" v-model="ruleForm.amount"></el-input></span>元
					    <p class="text-muted tip-text">请输入数字，保留二位小数</p>
					  </el-form-item>

					  <el-form-item label="营销活动">
							<div v-if="mercInfo.isOpenVipPrice && mercInfo.isOpenVipPrice == 1">
								<el-checkbox v-model="chkIsVip">充值享受会员价</el-checkbox>
							</div>
					  	<div :class="mercInfo.isOpenVipPrice && mercInfo.isOpenVipPrice == 1 ? 'm-t-sm' : ''">
					  		<el-checkbox v-model="chkSendAmt">赠送金额</el-checkbox>
                <el-form-item prop="giftAmount" :show-message="false" style="display: inline-block" :rules="{validator: checkAmount, min:1, max:10000000, ignoreEmpty:!chkSendAmt, message: '无效的金额,保留二位小数', trigger: 'blur'}">
						    <span v-show="chkSendAmt"><span class="dis-inline w-sm m-l-sm m-r-sm"><el-input type="number" v-model="ruleForm.giftAmount"></el-input></span>元</span>
						    </el-form-item>
					  	</div>
					  	<div class="m-t-sm">
					  		<el-checkbox v-model="chkCoupon">送优惠券</el-checkbox>
								<div v-show="chkCoupon">
									<div v-show="chkCoupon" class="m-b-sm" style="margin-left: 23px;" v-for="(couponItem, index) in ruleForm.couponList">

										<el-form-item style="display: inline-block" :prop="'couponList['+index+']'" :rules="{validator: checkCoupon, trigger: 'blur'}">
						    	<span class="dis-inline w-sm m-l-sm m-r-sm">
						    		<el-select v-model="couponItem.couponId" placeholder="请选择">
									    <el-option v-if="item.cnt - item.totalNum >0"
																 v-for="item in couponList"
																 :key="item.id"
																 :label="item.name"
																 :value="item.id">
									    </el-option>
									  </el-select>
						    	</span>
											<span class="dis-inline w-xs m-r-sm"><el-input v-model="couponItem.cnt"></el-input></span>张
										</el-form-item>
										<span v-if="index != 0" class="m-l"><el-button @click="removeCoupon(index)" type="text">删除</el-button></span>
									</div>
									<p @click="addCoupon" style="margin-left: 23px;"><el-button type="text">添加</el-button></p>
								</div>
					    </div>
					    <div>
					    	<el-checkbox v-model="chkPoint">送积分</el-checkbox>
                <el-form-item prop="giftPoint" :show-message="false" style="display: inline-block"
                              :rules="{ validator:checkNumber, min:1, max:50000, message:'无效的积分', ignoreEmpty:!chkPoint, trigger: 'blur' }">
						    <span v-show="chkPoint"><span  class="dis-inline w-sm m-l-sm m-r-sm"><el-input type="number" v-model="ruleForm.giftPoint"></el-input></span>分(值在1~50000之间)</span>
						    </el-form-item>
					    </div>
					    <div class="m-t-sm">
					    	<el-checkbox v-model="chkCard">可获得会员卡</el-checkbox>
								<span v-show="chkCard">
									<span class="dis-inline w-sm m-l-sm m-r-sm">
										<el-form-item prop="cardId" style="display: inline-block"
																	:rules="{ required: chkCard, type:'number', message:'请选择会员卡', trigger: 'change' }">
										<el-select v-model="ruleForm.cardId" placeholder="请选择" no-match-text="请选择">
											<el-option
												v-for="item in cardList"
												:key="item.id"
												:label="item.name"
												:value="item.id"
												:disabled="item.status != 1">
												{{item.name}}
												<template v-if="item.status != 1">（已停用）</template>
												<template v-else>
													（{{item.discount | cardDiscount(item.discountType)}}）
												</template>
											</el-option>
										</el-select>
										</el-form-item>
									</span>
									<router-link to="/client/card/new" class="text-primary">新建</router-link>
								</span>

							</div>
							<div v-if="chkCard">
								<el-checkbox v-model="chkCoverCard">覆盖既有会员卡折扣</el-checkbox>
							</div>
					  </el-form-item>
					  <el-form-item>
					  	<el-button @click="editDialog.show = false">取 消</el-button>
			    		<el-button type="primary" @click="submitForm">确 定</el-button>
					  </el-form-item>
					</el-form>
			  </div>
			</el-dialog>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table ukao-v-loading"
		    :data="tableData.list"
		    style="width: 100%" v-loading="loading">
		    <el-table-column
		      label="储值规则名称">
		      <template slot-scope="scope">
		        <div>{{ scope.row.info.name }}</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="所属门店">
					<template slot-scope="scope">
						<div>{{ scope.row.storeName }}</div>
					</template>
				</el-table-column>
		    <el-table-column
		      label="储值金额（元）">
		      <template slot-scope="scope">
		        <div>{{scope.row.info.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <!--<el-table-column-->
		      <!--label="储值人/次">-->
		      <!--<template slot-scope="scope">-->
		        <!--<div>{{scope.row.info.userCnt + '/' + scope.row.info.rechargeCnt}}</div>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
		    <el-table-column
		      label="营销活动">
		      <template slot-scope="scope">
            <div v-if="getPosBoolean(scope.row.info.rights, 0)">赠送金额{{scope.row.info.giftAmount | amtFormat}}元</div>
            <div v-if="getPosBoolean(scope.row.info.rights, 1)">赠送优惠券：</div>
            <div v-for="coupon in scope.row.couponList">{{coupon.couponName}}（{{coupon.info.cnt}}张）</div>
		        <div v-if="getPosBoolean(scope.row.info.rights, 2)">送{{scope.row.info.giftPoint}}积分</div>
		        <div v-if="getPosBoolean(scope.row.info.rights, 3)">送会员卡：{{getCardName(scope.row.info.cardId)}}</div>
						<div v-if="getPosBoolean(scope.row.info.rights, 4)">覆盖既有会员卡</div>
						<div v-if="getPosBoolean(scope.row.info.rights, 5)">充值享受会员价</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		        <div>{{scope.row.workName}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作">
		      <template slot-scope="scope">
		        <auth perm="marketing.storeRule.update">
              <template v-if="scope.row.info.status == 1">
		        	  <a class="text-primary" @click="updateStatus(scope.row.info.id, 0)">终止活动</a> |
		        	</template>
              <template v-else>
                <a class="text-primary" @click="updateStatus(scope.row.info.id, 1)">启用活动</a> |
              </template>
		        	<a class="text-primary" @click="queryById(scope.row.info.id)">编辑</a> |
		        	<!--<a class="text-primary" >链接</a> | -->
		        	<a class="text-primary" @click="deleteById(scope.row.info.id)">删除</a>
							<template slot="noPerm">-</template>
		        </auth>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
          @current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
  import msg from '@/utils/msg'
  import consts from '@/utils/consts'
  import base from '@/utils/helpers/base'
  import validate from '@/utils/helpers/validate'
  import calculation from '@/utils/helpers/calculation'
  import time from '@/utils/helpers/timeLite'
  import auth from '@/utils/auth';

	export default {
		data() {
			return {
        loading: true,
        chkSendAmt:false,
        chkCoupon:false,
        chkPoint:false,
        chkCard:false,
        chkCoverCard: false,
        chkIsVip: false,
        forceChkCoupon:false,
        mercInfo: auth.getMercInfo(),
        storeList: [], 		//门店
        tableData: {
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0
          }
        },
        editDialog : {
          title:'新建储值规则',
          show:false
        },
        ruleForm: {
          storeId: null,
          name: '',
          amount: '',
          giftAmount: '',
          giftPoint: '',
          cardId: '',
          couponList: [{couponId:'', cnt:''}]
        },
        rules: {
          name: [
            { required: true, message: '请输入储值规则名称', trigger: 'blur' },
          ]
        },
        searchKeys: {
          storeId:'',
				},
        couponList:[],
        cardList:[]
			}
		},
    created () {
      this.queryCardList();
      this.list();
      this.queryCouponList();
      this.getStoreList();
    },
		methods: {
      getStoreList() {
        this.$store.dispatch('getList', {
          uri: 'storeInfo/list',
        }).then((res) => {
          this.storeList = res.data.data.list || []
        })
      },
      preAdd() {
        if (this.$refs['ruleForm']) {
          this.$refs['ruleForm'].resetFields();
        }
        this.chkSendAmt = false;
        this.chkCoupon = false;
        this.chkPoint = false;
        this.chkCard = false;
        this.chkCoverCard = false;
        this.chkIsVip = false;
        this.ruleForm = {
          storeId: null,
          name: null,
          amount: null,
          rights: '00000',
          giftAmount: null,
          giftPoint: null,
          cardId: null,
          couponList: [{couponId:'', cnt:''}]
        };
        this.editDialog.title = '新建储值规则';
        this.editDialog.show = true;
      },
      getCardName(id){
        let cList = this.cardList;
        for (let i = 0; i < cList.length; i ++) {
          if (cList[i].id == id) {
            return cList[i].name;
          }
        }
      },
      queryById(id) {
        this.editDialog.title = '编辑储值规则';

        this.$store.dispatch('post', {
          uri : 'userRechargeRule/detail',
          data:{id}
        }).then((res) =>{
          let ruleForm = res.data.data;
          if (!ruleForm) {
            msg.error("记录不存在");
            return;
          }
          let cpList = [{couponId:'', cnt:''}];

          this.chkSendAmt = this.getPosBoolean(ruleForm.rights, 0);
          this.chkCoupon = this.getPosBoolean(ruleForm.rights, 1);
          this.chkPoint = this.getPosBoolean(ruleForm.rights, 2);
          this.chkCard = this.getPosBoolean(ruleForm.rights, 3);
          this.chkCoverCard = this.getPosBoolean(ruleForm.rights, 4);
					this.chkIsVip = this.getPosBoolean(ruleForm.rights, 5);
          if (this.chkCoupon) {
            res.data.couponList.forEach(function (item , index) {
              cpList[index] = {
                couponId : item.couponId,
                cnt : item.cnt
              };
            });
          }
          ruleForm.couponList = cpList;

          ruleForm.amount = calculation.accDiv(ruleForm.amount, 100);
          if (ruleForm.giftAmount) {
            ruleForm.giftAmount = calculation.accDiv(ruleForm.giftAmount, 100);
          }

          this.ruleForm = {...ruleForm};

          if (this.$refs['ruleForm']) {
            this.$refs['ruleForm'].resetFields();
          }

          this.editDialog.show = true;
        });
      },
      getPosBoolean(right, pos) {
        return right[pos]==1;
      },
      getRights() {
        // 	营销活动点位符
        return (this.chkSendAmt?"1":"0") + (this.chkCoupon?"1":"0") +
          (this.chkPoint?"1":"0") + (this.chkCard?"1":"0") + (this.chkCard && this.chkCoverCard?"1":"0")+(this.chkIsVip && this.chkIsVip ? "1" : "")
      },
      checkAmount(rule, value, callback) {
        if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
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
      checkCoupon(rule, value, callback) {
        if (this.chkCoupon || this.forceChkCoupon) {
          if (!validate.notEmpty(value.couponId)) {
            callback(new Error('请选择优惠券'));
          } else if (!validate.notEmpty(value.cnt)){
            callback(new Error('请输入优惠券数量'));
          } else if (!validate.number(value.cnt, 1, 20)) {
            callback(new Error('优惠券数量在1~20之间'));
          } else {
            let repeat = 0;
            let cpList = this.ruleForm.couponList;

            let citem = value;
            for (let i = 0; i < cpList.length; i ++) {
              let item = cpList[i];
              if (citem.couponId == item.couponId) {
                repeat++;
              }
            }

            if (repeat > 1) {
              callback(new Error('不能选择重复的优惠券'));
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      },
      submitForm() {
        this.forceChkCoupon = false;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {

            this.ruleForm.rights = this.getRights();
            // 临时取值转换
            let ruleForm = {...this.ruleForm};

            ruleForm.amount = calculation.accMul(ruleForm.amount, 100);
            if (ruleForm.giftAmount) {
              ruleForm.giftAmount = calculation.accMul(ruleForm.giftAmount, 100);
            }
            if (this.chkCoupon) {
              ruleForm.couponList = base.arrayToJson(ruleForm.couponList);
            }
            ruleForm.createTime = null;
            ruleForm.updateTime = null;
            //console.log({...ruleForm});
            this.$store.dispatch('post', {
              uri: this.ruleForm.id?'userRechargeRule/update':'userRechargeRule/storeAdd',
              data: {...ruleForm}
            }).then((res)=>{
              this.editDialog.show = false;
              msg.success();
              this.list();
            })
          }
        });
      },
      deleteById(id) {
        let _this = this;
        msg.confirm({msg:"确认删除", confirmFn:function (){
          _this.$store.dispatch('post', {
            uri : 'userRechargeRule/delete',
            data:{id}
          }).then((res) =>{
            _this.list();
          })
        }});
      },
      updateStatus(id, status) {
        let _this = this;
        this.$store.dispatch('post', {
          uri : 'userRechargeRule/updateStatus',
          data:{
            id: id,
            status
          }
        }).then((res) =>{
          _this.list();
        })
      },
      list (start) {
        this.loading = true;
        this.$store.dispatch('post', {
          uri : 'userRechargeRule/storeList',
          data: {
            startRow: start || 0,
            pageSize: this.tableData.pagination.size,
            storeId: this.searchKeys.storeId
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false;
        })
      },
      handleCurrentChange (val){
        this.list((val-1) * this.tableData.pagination.size)
      },
      queryCouponList(){
        this.$store.dispatch('post', {
          uri : 'couponInfo/list',
          data: {types: [1,5],status:1,timeEnd :time.getDate(new Date())}
        }).then((res) =>{
          this.couponList = res.data.data.list;
        })
      },
      queryCardList(){
        this.$store.dispatch('post', {
          uri : 'userCard/listForSelect'
        }).then((res) =>{
          this.cardList = res.data.data.list;
        })
      },
			addCoupon() {
        let flag = true;
        let length = this.ruleForm.couponList.length;
        this.forceChkCoupon = true;
        for (let i = 0; i < length; i ++) {
          this.$refs.ruleForm.validateField('couponList['+i+']', function (msg){
            if (msg) {
              flag = false;
            }
          });
          if (!flag) {
            break;
          }
        }

        if (flag) {
          this.ruleForm.couponList.push({couponId:'', cnt:''});
        }
      	
      },
      removeCoupon(index) {
        this.ruleForm.couponList.splice(index,1);
      }
		}
	}	
</script>

<style scoped>
	.tip {
		max-width: 600px;
		padding: 15px;
		background: #f3f7ff;
		border-radius: 10px;
	}
	.tip-text {
		line-height: 20px;
		font-size: 12px;
	}
</style>
