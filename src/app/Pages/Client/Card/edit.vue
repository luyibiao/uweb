<template>
  <div>
    <div class="m-b-lg">
      <el-breadcrumb class="link-back"
                     separator="/">
        <el-breadcrumb-item to="/client/card/manage">
          <i class="el-icon-arrow-left icon-smaller"></i>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>编辑会员卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="clearfix">
      <!-- 微信预览 -->
      <wxPreview class="b-a pull-left"
                 :mercName="mercInfo.name"
                 :mercLogo="mercInfo.logoPath"
                 :cardName="ruleForm.name"
                 :bgType="ruleForm.coverType"
                 :bgColor="bgColor"
                 :bgPath="bgPath"
                 :discount="discount"
                 :discountRs="ruleForm.rights[1] == '1'"
                 :couponRs="ruleForm.rights[2] == '1'"
                 :pointRs="ruleForm.rights[3] == '1'" />
      <div class="membership-content">
        <el-form class="membership-form b-a"
                 :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="120px">
          <div class="title text-black b-b">会员卡基本信息</div>
          <el-form-item label="商家名称">
            <div>{{mercInfo.name}}</div>
          </el-form-item>
          <el-form-item label="商家LOGO">
            <img class="thumb b-a v-middle"
                 :src="mercInfo.logoPath"
                 alt="">
            <p class="text-muted">如果修改商家信息，请在
              <router-link to="/setting/account/basic">
                <span class="text-primary">账号设置</span>
              </router-link>中更新</p>
          </el-form-item>

          <el-form-item label="会员卡封面"
                        prop="coverType">
            <el-radio-group v-model="ruleForm.coverType">
              <el-radio :label="1">颜色</el-radio>
              <el-radio :label="2">封面图片</el-radio>
            </el-radio-group>
            <div v-if="ruleForm.coverType == 1"
                 class="l-h-0x m-t-sm">
              <el-color-picker v-model="bgColor"
                               @change="valiImgPath('ruleForm')"></el-color-picker>
            </div>
            <div v-if="ruleForm.coverType == 2">
              <Uploader class="u-avatar-uploader"
                        tip="尺寸为1000*600像素，只支持jpg、png、jpeg格式，且大小不超过2M"
                        :path="bgPath"
                        size="2"
                        :beforeFn="beforeAvatarUpload"
                        :saveSuccessFn="handleSaveSuccess" />
            </div>
          </el-form-item>

          <el-form-item label="会员卡折扣"
                        required>
            <el-radio-group v-model="ruleForm.discountType" disabled="ruleForm.del == 1"
                            @change="changeDiscountType">
              <el-radio :label="1">通用折扣</el-radio>
              <el-radio :label="2">按经营大类设置折扣</el-radio>
              <el-radio :label="3">无折扣</el-radio>
            </el-radio-group>
            <el-form-item v-show="ruleForm.discountType === 1"
                          prop="discount"
                          :rules="rules.comDiscount"
                          label="折扣优惠"
                          label-width="120px">
              <el-input class="w-xs"
                        v-model="ruleForm.discount"></el-input>
              <span class="m-l-xs">折</span>
            </el-form-item>
            <el-row class="m-b-n-md"
                    v-show="ruleForm.discountType === 2">
              <el-col class="m-b-md"
                      :span="12"
                      v-for="(item ,index) in ruleForm.discountDesc"
                      :key="item.bizId">
                <el-form-item :prop="'discountDesc.'+index+'.discount'"
                              :rules="rules.descDiscount"
                              :label="item.bizName"
                              class="dis-inline"
                              label-width="120px">
                  <el-input class="w-xs"
                            v-model="item.discount"></el-input>
                  <span class="m-l-xs">折</span>
                </el-form-item>
              </el-col>
            </el-row>
            <p v-show="ruleForm.discountType !== 3"
               class="text-sm text-muted m-t-md">折扣在0~10之间，最多保留1位小数</p>
          </el-form-item>

          <el-form-item label="会员卡等级"
                        prop="level">
            <el-select placeholder="会员卡等级" disabled="ruleForm.del == 1"
                       @change="selectedLevel"
                       v-model="levelIndex">
              <el-option v-for="(item,index) in levelList"
                         :label="item.name +'（' + item.level + '级）'"
                         :value="index"
                         :key="item.level"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="会员卡权益">
            <!-- 优惠券 -->
            <div class="interest">
              <el-checkbox class="interest-check"
                           true-label="1"
                           false-label="0"
                           v-model="ruleForm.rights[2]">优惠券</el-checkbox>
              <div class="interest-content"
                   v-for="(item , index) in ruleForm.couponList"
                   :key="item.key">
                <!-- 选择优惠券 -->
                <el-form-item class="interest-content-item"
                              :prop="'couponList.'+index+'.couponId'"
                              :rules="rules.couponId"
                              label="开卡赠送"
                              label-width="80px">
                  <el-select class="w-sm"
                             v-model="item.couponId"
                             placeholder="请选择优惠券">
                    <el-option v-if="item.cnt - item.totalNum >0" v-for="item in couponList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 优惠券张数 -->
                <el-form-item class="interest-content-item"
                              :rules="rules.couponCnt"
                              :prop="'couponList.'+index+'.cnt'">
                  <el-input v-model="item.cnt"
                            class="w-xs"></el-input>
                  <span class="m-l-xs">张</span>
                </el-form-item>
                <el-button v-if="index"
                           @click="removeCoupon(index)"
                           class="interest-content-item"
                           type="text">删除</el-button>
              </div>
              <div class="interest-content l-h-2x">
                <el-button type="text"
                           @click="addCoupon">添加</el-button>
                <p class="text-muted text-sm">优惠券过期、被删除、或库存为0时，系统不再送券</p>
              </div>
            </div>
            <!-- 积分 -->
            <div class="interest">
              <el-checkbox class="interest-check"
                           true-label="1"
                           false-label="0"
                           v-model="ruleForm.rights[3]">送积分</el-checkbox>
              <div class="interest-content">
                <el-form-item class="interest-content-item"
                              label="开卡赠送"
                              :show-message="false"
                              label-width="80px"
                              prop="giftPoint">
                  <el-input class="w-sm"
                            v-model="ruleForm.giftPoint"></el-input>
                  <span class="m-l-xs">积分</span>
                  <p class="text-muted text-xs">积分值在1~50000之间</p>
                </el-form-item>
              </div>
              <div class="interest-content">
                <el-form-item label="积分系数"
                              label-width="80px"
                              :show-message="false"
                              prop="pointRatio">
                  <el-input v-model="ruleForm.pointRatio"
                            class="w-xs"></el-input>
                  <p class="text-muted text-xs">积分系数在0~50之间</p>
                </el-form-item>
              </div>

            </div>
          </el-form-item>
          <el-form-item label="使用须知"
                        prop="remark">
            <el-input class="w-lg"
                      type="textarea"
                      v-model.trim="ruleForm.remark"></el-input>
          </el-form-item>

          <div class="title text-black b-b m-t-xl">领取设置</div>

          <el-form-item label="设置升级条件">
            <el-form-item class="form-adjacent"
                          label="累计消费金额"
                          prop="payAmt">
              <el-input class="w"
                        v-model.trim="ruleForm.payAmt"></el-input>
              <span class="m-l-sm">元</span>
            </el-form-item>
            <el-form-item class="form-adjacent"
                          label="或 累计支付成功"
                          prop="payCnt">
              <el-input class="w"
                        v-model.trim="ruleForm.payCnt"></el-input>
              <span class="m-l-sm">笔</span>
            </el-form-item>
            <el-form-item class="form-adjacent"
                          label="或 累计积分达到"
                          prop="point">
              <el-input class="w"
                        v-model.trim="ruleForm.point"></el-input>
              <span class="m-l-sm">分</span>
            </el-form-item>
          </el-form-item>

          <el-form-item label="会员卡等级"
                        prop="level">
            <el-select placeholder="会员卡等级" disabled
                       @change="selectedLevel"
                       v-model="levelIndex">
              <el-option v-for="(item,index) in levelList"
                         :label="item.name +'（' + item.level + '级）'"
                         :value="index"
                         :key="item.level"></el-option>
            </el-select>
            <p class="text-muted text-sm">当会员满足条件时会自动发放该等级对应的会员卡</p>
          </el-form-item>
        </el-form>
        <div class="m-t">
          <el-button @click="$router.push('/client/card/manage')">取消</el-button>

          <el-button type="primary"
                     :loading="saving"
                     @click="submit(saveCard)">保存</el-button>
          <el-button type="danger"
                     @click="deleteCard(ruleForm.id)">删除</el-button>
          <el-button v-if="ruleForm.status == 1"
                     @click="defCard(ruleForm.id)">设为默认</el-button>
          <el-button v-if="ruleForm.status == 1"
                     @click="updateStatus(ruleForm.id,0)">禁用</el-button>
          <el-button type="success"
                     v-else
                     @click="updateStatus(ruleForm.id,1)">启用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import calculation from "@/utils/helpers/calculation";
import msg from "@/utils/msg";

import card from "./mixins/card";
export default {
  data() {
    return {
      // 详情卡
      cardDetail: {}
    };
  },
  async created() {
    // 获取折扣详情
    await this.queryDetail();
    // 获取经营大类折扣
    this.getProductList();
    this.queryLevelList().then(res => {
      // 获取levelIndex
      for (let index = 0; index < this.levelList.length; index++) {
        if (this.ruleForm.level == this.levelList[index].level) {
          this.levelIndex = index;
          break;
        }
      }
    });
  },
  methods: {
    // 会员详情
    queryDetail() {
      return this.$store
        .dispatch("post", {
          uri: "userCard/detail",
          data: { id: this.$route.params.id }
        })
        .then(res => {
          let data = res.data.data;
          data.rights = data.rights.split("");
          if (data.rights[1] === "0") data.discountType = 3;
          data.payAmt = calculation.accDiv(data.payAmt || 0, 100);
          data.discount = calculation.accDiv(data.discount || 0, 10);
          data.coverType == 1
            ? (this.bgColor = data.imgPath)
            : (this.bgPath = data.imgPath);
          this.cardDetail = data;
          data.discountDesc = data.discountDesc
            ? JSON.parse(data.discountDesc)
            : [];
          this.initFormData(data, res.data.couponList);
          this.queryCouponList();
        });
    },
    // 格式化ruleForm数据
    initFormData(data, couponList) {
      Object.keys(this.ruleForm).forEach(key => {
        if (data[key]) {
          this.ruleForm[key] = data[key];
        }
      });
      // 优惠券列表
      let key = +new Date();
      if (couponList && couponList.length > 0) {
        couponList.forEach((item, index) => {
          this.ruleForm.couponList.push({
            couponId: item.couponId,
            cnt: item.cnt,
            key: key - 10000 * index
          });
        });
      } else {
        this.ruleForm.couponList.push({
          couponId: "",
          cnt: "",
          key: key
        });
      }
    },
    // 修改保存
    saveCard(data) {
      this.saving = true;
      this.$store
        .dispatch("post", {
          uri: "userCard/update",
          data,
          forceResolve: true
        })
        .then(res => {
          this.saving = false;
          if (200 === res.data.httpCode) {
            msg.success();
            this.$router.push("/client/card/manage");
          } else {
            msg.error(res.data.msg || consts.ERROR_MSG);
          }
        });
    },
    // 删除
    deleteCard(id) {
      msg.confirm({
        msg: "确认删除？",
        confirmFn: _ => {
          this.$store
            .dispatch("post", {
              uri: "userCard/delete",
              data: {
                id
              }
            })
            .then(res => {
              msg.success();
              this.$router.push("/client/card/manage");
            });
        }
      });
    },
    // 设为默认
    defCard(id) {
      this.$store
        .dispatch("post", {
          uri: "userCard/updateDefault",
          data: { id }
        })
        .then(res => {
          msg.success();
          this.$router.push("/client/card/manage");
        });
    },
    // 更改状态
    updateStatus(id, status) {
      this.$store
        .dispatch("post", {
          uri: "userCard/updateStatus",
          data: {
            id,
            status
          }
        })
        .then(res => {
          msg.success();
          this.$router.push("/client/card/manage");
        });
    }
  },
  mixins: [card]
};
</script>

<style lang="less" scoped>
@import "./styles/card.less";
</style>
