<template>
	<div>
		<p class="ukao-tb-title text-black">新客户赠券规则</p>
		<div class="ukao-tb-default ukao-v-loading">
			<div class='clearfix m-t-sm' v-loading="loading">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <div class="m-b-sm" style="margin-left: 23px;" :key="couponItem.couponId" v-for="(couponItem, index) in ruleForm.couponList">
            优惠券
            <el-form-item style="display: inline-block" :prop="'couponList['+index+']'" :rules="{validator: checkCoupon, trigger: 'blur'}">
            <span class="dis-inline w-sm m-r-sm m-l-sm">
              <el-select v-model="couponItem.couponId" placeholder="请选择">
                <el-option
                  v-if="item.cnt - item.totalNum >0"
                  v-for="item in couponList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
            <span class="dis-inline w-xs m-r-sm"><el-input type="number" v-model="couponItem.cnt"></el-input></span>张
            </el-form-item>
            <auth perm="marketing.coupon.new.update">
              <span class="m-l"><el-button @click="removeCoupon(index)" type="text">删除</el-button></span>
            </auth>
          </div>
          <auth perm="marketing.coupon.new.update">
            <p @click="addCoupon" style="margin-left: 23px;"><el-button type="text">添加</el-button></p>
          </auth>
          <p class="text-muted" style="margin-left: 23px;">优惠券过期、被删除、或库存为0时，系统不再送券</p>
          <div class="m-t">
            <auth perm="marketing.coupon.new.update">
              <el-button type="primary" @click="save()">保存</el-button>
            </auth>
          </div>
        </el-form>
			</div>
    </div>
	</div>
</template>

<script>
	import msg from '@/utils/msg'
  import validate from '@/utils/helpers/validate'
  import BIZ_CST from '@/utils/bizconsts'
  import time from '@/utils/helpers/timeLite'

	export default {
		data: function() {
			return {
				loading: true,
				ruleForm:{
          couponList:[{couponId:'', cnt:''}]
				},
        couponList:[]
			}
		},
		created(){
      this.queryInfo();
      this.queryCouponList();
    },
		methods: {
      queryCouponList(){
        this.$store.dispatch('post', {
          uri : 'couponInfo/list',
          data: {type: BIZ_CST.TOOL.COUPON_OBTAIN_RECEIVE, status: BIZ_CST.COMMON.ENABLE, timeEnd :time.getDate(new Date())}
        }).then((res) =>{
          this.couponList = res.data.data.list;
        })
      },
		  queryInfo(){
				this.$store.dispatch('post', {
				  uri : 'couponGift/listRule',
					data: {bizType: BIZ_CST.TOOL.COUPON_GIFT_TYPE_NEW_USER}
			 	}).then((res) =>{
				  let list = res.data.data;
				  if (list && list.length > 0) {
            this.ruleForm.couponList = res.data.data;
          }
          this.loading = false;
				})
			},
      checkCoupon(rule, value, callback) {
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
      },
      addCoupon() {
        let flag = true;
        let length = this.ruleForm.couponList.length;
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
      },
      save() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri : 'couponGift/saveRule',
              data: {
                couponList: JSON.stringify(this.ruleForm.couponList),
                bizType: BIZ_CST.TOOL.COUPON_GIFT_TYPE_NEW_USER
              }
            }).then((res) =>{
              msg.success();
            })
          }
        });
      }
		}
	}
</script>
