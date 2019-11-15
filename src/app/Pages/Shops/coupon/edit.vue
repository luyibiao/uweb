<style lang="less" scoped>
.wx-bg {
  margin-left: 30px;
  width: 350px;
  height: 625px;
  position: relative;
  background: url("/static/img/weixin_public.png") no-repeat center center;
  background-size: 350px 625px;
}
.wx-box {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  height: 565px;
  overflow-y: auto;
  background-color: #efeff4;
  padding: 10px 15px 50px;
  box-sizing: border-box;
  .wx-content {
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;
    min-height: 100%;
  }
  .coupen-header {
    border-bottom: 1px dashed #e8e8e8;
    background-color: #fff;
    min-height: 100px;
    position: relative;
    &:after,
    &:before {
      z-index: 10;
      content: "";
      position: absolute;
      bottom: -9px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: #efeff4;
    }
    &:after {
      right: -9px;
    }
    &:before {
      left: -9px;
    }
  }
  .coupen-cont {
    padding: 10px 10px 20px;
  }
  .package-btn {
    border-radius: 4px;
    padding: 6px 12px;
    border: 1px solid #cfcfcf;
    margin-top: 10px;
    display: inline-block;
    &:first-of-type {
      background-color: #f90;
      border-color: #f90;
      color: #ffff;
    }
  }
  .package-btn + .package-btn {
    margin-left: 10px;
  }
}

.goods-item {
  padding: 8px 10px;
  border-radius: 4px;
  .logo {
    width: 60px;
    height: 60px;
    background-color: #e5e5e5;
  }
  .amount {
    color: #ffa51c;
  }
}

.main {
  margin-left: 430px;
  overflow: hidden;
}

// 发布套餐
.package {
  width: 480px;
  padding: 10px;
  border-radius: 4px;
}
.package-item + .package-item {
  margin-top: 15px;
}
.package-title {
  background-color: #f8f8f8;
  padding: 6px 8px;
  position: relative;
  .btn {
    display: inline-block;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    padding: 0 12px;
    line-height: 36px;
    border-radius: 4px;
  }
  .package-close {
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -10px;
    font-size: 18px;
    color: #c2c2c2;
    cursor: pointer;
    display: none;
  }
  &:hover .package-close {
    display: block;
  }
}

.spec {
  padding: 15px 10px 0;
  &:last-of-type {
    padding: 10px 10px 0;
  }
  &-label {
    text-align: right;
    padding: 8px 10px 8px 0;
    line-height: 20px;
    display: inline-block;
  }
  &-ipt {
    width: 105px;
  }
  &-select {
    width: 150px;
  }
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/" class="m-b-md">
      <el-breadcrumb-item :to="{ path: '/shops/coupon' }"><i class="el-icon-arrow-left icon-smaller"></i>礼券列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{disabled ? '编辑礼券' : '新建礼券'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="clearfix" v-loading="loading">
      <div class="pull-left">
        <div class="wx-bg b-a">
          <div class="wx-box">
            <div class="wx-content">
              <div class="coupen-header">
                <h3 class="text-center m-t">{{form.name}}</h3>
                <p class="wrapper-sm text-sm text-muted ">{{form.detail}}
                  <span>{{validity}}</span>
                </p>
              </div>
              <div class="coupen-cont" v-if="packageList[0]">
                <div>
                  <span class="package-btn" v-for="(item , index) in packageList">{{item.name}}</span>
                </div>
                <div v-for="(item,index) in packageList[0].list" :key="index">
                  <p class="text-muted m-b-xs m-t-sm">第{{index+1}}个商品</p>
                  <div class="clearfix goods-item b-a">
                    <div class="logo pull-left m-r"></div>
                    <div class="pull-left">
                      <p class="m-b-xs">请选择</p>
                    </div>
                    <div class="amount pull-right">￥{{item.modifyPrice*100 || 0 | amtFormat}}</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <p class="m-t-md text-center">微信预览界面</p>
      </div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="礼券名称" prop="name">
            <el-input class="w" v-model.trim="form.name"></el-input>
          </el-form-item>

          <el-form-item label="礼券数量" prop="cnt" required>
            <el-input :disabled="disabled" class="w m-r-sm" v-model.trim="form.cnt"></el-input><span>张</span>
          </el-form-item>

          <el-form-item label="日期类型" required>
            <el-radio-group v-model="form.dateType">
              <el-radio-button :disabled="disabled && form.dateType !== 1" :label="1">固定时间</el-radio-button>
              <el-radio-button :disabled="disabled && form.dateType !== 2" :label="2">领取后有效期限</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item  prop="timeStart" v-show="form.dateType === 1" >
            <div slot="label"><span style="color:#ff4949; margin-right:4px;">*</span>生效时间</div>
            <el-date-picker
              :disabled="disabled"
              v-model="form.timeStart"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerTimeStart">
            </el-date-picker>
          </el-form-item>

          <el-form-item  prop="timeEnd" v-show="form.dateType === 1" >
            <div slot="label"><span style="color:#ff4949; margin-right:4px;">*</span>过期时间</div>
            <el-date-picker
              :disabled="disabled"
              v-model="form.timeEnd"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerTimeEnd">
            </el-date-picker>
          </el-form-item >

          <el-form-item prop="term"  v-show="form.dateType === 2">
            <div slot="label"><span style="color:#ff4949; margin-right:4px;">*</span>有效天数</div>
            <el-input class="w m-r-sm" :disabled="disabled" v-model="form.term" placeholder="领取后多少天内有效"></el-input><span>天</span>
          </el-form-item>

          <el-form-item label="使用说明">
            <el-input class="w-xxl" type="textarea" v-model.trim="form.detail"></el-input>
          </el-form-item>

          <el-form-item label="发布套餐" required>
            <div class="package b-a">
              <div class="package-item" v-for="(item , index) in packageList" :key="index">
                <div class="package-title">
                  <span class="btn">{{item.name}}</span>
                  <i v-if="!disabled" class="package-close el-icon-circle-cross" @click="removePackage(index)"></i>
                </div>
                <div class="spec clearfix" v-for="(spec,j) in item.list">
                  <div class="pull-left">
                    <span class="spec-label" :class="{'text-danger':spec.errId}">商品规格</span>
                    <el-select :disabled="disabled" class="spec-select" v-model="spec.goodsGroupId" @change="changeSpec(spec)" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in groupsList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="pull-right">
                    <span class="spec-label" :class="{'text-danger':spec.errPrice}">金额</span>
                    <el-input class="spec-ipt" :disabled="disabled" @blur="changeSpecPrice(spec)" v-model="spec.modifyPrice"></el-input>
                    <span class="m-l-xs">元</span>
                  </div>
                </div>
                <div class="spec l-h"  v-if="!disabled">
                  <el-button type="text" size="small" @click="addPackageSpec(index)">+添加</el-button>
                </div>
              </div>
              <div class="package-item" v-if="!disabled && packageList.length < 3">
                <div class="package-title">
                  <el-button size="small" @click="addPackage">添加套餐</el-button>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>  
  </div>
  
</template>

<script>
import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import timeLite from "@/utils/helpers/timeLite";
import msg from "@/utils/msg";
export default {
  data() {
    return {
      disabled: false, //禁止输入
      loading: false,
      form: {
        id: "",
        name: "",
        cnt: "",
        dateType: 1,
        timeStart: "",
        timeEnd: "",
        term: "",
        detail: ""
      },
      // 规格列表
      groupsList: [],
      // 套餐列表
      packageList: [],
      packageName: ["套餐一", "套餐二", "套餐三"],
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: "请输入礼券名称", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
        ],
        cnt: [
          {
            validator(rule, value, callback) {
              value
                ? validate.amount(value, 0, 1, 10000)
                  ? callback()
                  : callback(new Error("请输入1 ~ 10000的整数"))
                : callback(new Error("请输入优惠券数量"));
            }
          }
        ],
        timeStart: [
          {
            validator: (rule, value, callback) => {
              this.form.dateType == 1
                ? value ? callback() : callback(new Error("请选择生效时间"))
                : callback();
            }
          }
        ],
        timeEnd: [
          {
            validator: (rule, value, callback) => {
              this.form.dateType == 1
                ? value ? callback() : callback(new Error("请选择过期时间"))
                : callback();
            }
          }
        ],
        term: [
          {
            validator: (rule, value, callback) => {
              if (this.form.dateType === 2) {
                value
                  ? validate.amount(value, 0, 1, 10000)
                    ? callback()
                    : callback(new Error("天数格式错误"))
                  : callback(new Error("请输入有效天数"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // 限制生效时间
      pickerTimeStart: {
        disabledDate: time => {
          if (this.form.timeEnd) {
            return time.getTime() >= this.form.timeEnd;
          } else {
            return false;
          }
        }
      },
      // 限制过期时间
      pickerTimeEnd: {
        disabledDate: time => {
          if (this.form.timeStart) {
            return time.getTime() <= this.form.timeStart;
          } else {
            return false;
          }
        }
      }
    };
  },
  created() {
    if (this.$route.params.id && this.$route.path.indexOf("edit") > 0) {
      this.getDetail();
    }
    this.getGroups();
  },
  methods: {
    getDetail() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "mall/coupon/detail",
          data: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          this.disabled = true;
          let data = res.data.data;
          this.form.id = data.id;
          this.form.name = data.name;
          this.form.detail = data.detail;
          this.form.cnt = data.cnt;
          this.form.dateType = data.dateType;
          this.form.timeStart = data.timeStart;
          this.form.timeEnd = data.timeEnd;
          this.form.term = data.term;
          let names = [];
          let arr = [];
          data.combos.forEach(item => {
            let len = names.indexOf(item.name);
            if (len < 0) {
              names.push(item.name);
              arr.push({
                name: item.name,
                groupCode: item.groupCode,
                list: []
              });
              len = names.length - 1;
            }
            arr[len].list.push({
              goodsGroupId: item.goodsGroupId, //规格id
              modifyPrice: calculation.accDiv(item.modifyPrice, 100), //金额
              errId: false, //ID格式是否错误
              errPrice: false //金额格式是是否错误
            });
          });
          this.packageList = arr;
          this.loading = false;
        });
    },
    // 添加套餐
    addPackage() {
      let len = this.packageList.length;
      let name = this.packageName[len];
      this.packageList.push({
        name,
        groupCode: len + 1,
        list: []
      });
    },
    // 删除套餐
    removePackage(i) {
      this.packageList.splice(i, 1);
      this.packageList.forEach((item, index) => {
        item.name = this.packageName[index];
        item.groupCode = index + 1;
      });
    },
    // 添加套餐规格
    addPackageSpec(i) {
      this.packageList[i].list.push({
        goodsGroupId: "", //规格id
        modifyPrice: "", //金额
        errId: false, //ID格式是否错误
        errPrice: false //金额格式是是否错误
      });
    },
    // 套餐规格改变
    changeSpec(item) {
      item.errId = false;
    },
    // 套餐规格金额改变
    changeSpecPrice(item) {
      item.errPrice =
        !item.modifyPrice ||
        !validate.amount(item.modifyPrice, 2, 0.01, 9999999);
    },
    // 获取套餐规格数据
    getSpecData() {
      let arr = [];
      let rigthId = true;
      let rigthPrice = true;
      let sort = 0;
      this.packageList.forEach((item, index) => {
        let name = item.name;
        item.list.forEach((value, j) => {
          sort++;
          value.errId = !value.goodsGroupId;
          value.errPrice = !validate.amount(
            value.modifyPrice,
            2,
            0.01,
            9999999
          );
          if (value.errId) {
            rigthId = false;
          }
          if (value.errPrice) {
            rigthPrice = false;
          }
          if (rigthId && rigthPrice) {
            arr.push({
              name,
              groupCode: index + 1,
              goodsGroupId: value.goodsGroupId,
              modifyPrice: calculation.accMul(value.modifyPrice, 100),
              sort
            });
          }
        });
      });
      if (sort) {
        let err = "";
        if (!rigthId) {
          err += "请选择商品规格";
        }
        if (!rigthPrice) {
          if (err) err += ",";
          err += "金额格式错误";
        }
        if (err) {
          msg.error(err, 2000);
          return null;
        } else {
          return arr;
        }
      } else {
        msg.warning("请添加套餐");
        return null;
      }
    },
    // 提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = null;
          let methods = "update";
          // 禁止输入 - 编辑状态
          if (this.disabled) {
            data = {
              id: this.form.id,
              name: this.form.name,
              detail: this.form.detail
            };
          } else {
            let combos = this.getSpecData();
            if (combos) {
              methods = "add";
              data = {
                ...this.form,
                combos: JSON.stringify(combos)
              };
              data.cnt = parseInt(data.cnt);
              if (data.dateType === 1) {
                data.timeStart = timeLite.getDate(data.timeStart);
                data.timeEnd = timeLite.getDate(data.timeEnd);
                data.term = 0;
              } else {
                data.timeStart = "";
                data.timeEnd = "";
              }
            }
            // 新建状态
          }
          if (data) {
            this.postCoupon(methods, data);
          }
        }
      });
    },
    // 获取规格分组
    getGroups() {
      this.$store
        .dispatch("post", {
          uri: "goodsGroup/list"
        })
        .then(res => {
          this.groupsList = res.data.data.list;
        });
    },
    // 提交礼券 methods:方式,data：数据
    postCoupon(methods, data) {
      let uri = methods == "add" ? "mall/coupon/add" : "mall/coupon/update";
      return this.$store
        .dispatch("post", {
          uri,
          data
        })
        .then(res => {
          msg.success(this.disabled ? "修改成功" : "新建成功");
          setTimeout(() => {
            this.$router.push("/shops/coupon");
          }, 1000);
        });
    }
  },
  computed: {
    // 有效期
    validity() {
      if (this.form.dateType == 2) {
        if (validate.amount(this.form.term, 0, 1, 10000)) {
          let start = timeLite.getDate(new Date());
          let end = timeLite.getDate(
            timeLite.add(start, this.form.term, "days")
          );
          return `有效期：${start} - ${end}`;
        } else {
          return "";
        }
      } else if (this.form.dateType == 1) {
        let start = timeLite.getDate(this.form.timeStart);
        let end = timeLite.getDate(this.form.timeEnd);
        if (start && end) {
          return `有效期：${start} - ${end}`;
        } else {
          return "";
        }
      } else {
        return "";
      }
    }
  }
};
</script>