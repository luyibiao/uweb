<template>
  <div>
    <el-form :model="ruleForm"
             ref="ruleForm"
             label-width="160px"
             class="demo-ruleForm">
      <el-form-item label="姓名"
                    prop="name"
                    :rules="[
			    { required: true, message: '姓名不能为空'},
			  ]">
        <div class="dis-inline w-xl">
          <el-input v-model="ruleForm.name"
                    auto-complete="off"
                    placeholder="请输入姓名"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="手机号"
                    prop="wkPhone"
                    :rules="[
						{ required: true, message: '请填写手机号'},
						{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'},
             { validator: checkPhone, message: '请输入正确的手机号', trigger: 'blur' }
					]">
        <div class="dis-inline w-lg">
          <el-input v-model="ruleForm.wkPhone"
                    auto-complete="off"
                    placeholder="请输入手机号"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="性别"
                    prop="sex">
        <template>
          <el-radio v-model="sex.radio"
                    label="1">男</el-radio>
          <el-radio v-model="sex.radio"
                    label="2">女</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="会员卡"
                    prop="cardId"
                    :rules="[{ required: true, message: '请选择会员卡'}]">
        <el-select placeholder="普通会员卡"
                   v-model="ruleForm.cardId"
                   @change="cardChange">
          <el-option v-for="item in cardList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
            {{item.name}}({{item.level}}级，{{item.discount | cardDiscount(item.discountType)}})
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary"
                     @click="submitForm('ruleForm')"
                     :loading="btnstatu">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";
import base from "@/utils/helpers/base";
import recharge from "@/components/Recharge/index";
import storeSelect from "@/components/DropDownList/store";
import auth from "@/utils/auth";
import regional from "@/utils/regional";
import md5 from "@/utils/md5";
import validate from "@/utils/helpers/validate";
export default {
  data: function() {
    return {
      btnstatu: false,
      ruleForm: {
        name: "",
        wkPhone: this.$route.params.wkPhone,
        cardId: "",
        def: ""
      },
      sex: {
        radio: "1"
      },
      cardList: []
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    getCardList() {
      this.$store
        .dispatch("post", {
          uri: "userCard/listForSelect"
        })
        .then(res => {
          this.cardList = res.data.data.list;
          this.getCardDfault();
        });
    },
    getCardDfault() {
      for (let index = 0; index < this.cardList.length; index++) {
        let item = this.cardList[index];
        if (item.def === 1) {
          this.ruleForm.cardId = item.id;
          break;
        }
      }
    },
    checkPhone(rule, value, callback) {
      if (!validate.tel(value)) {
        callback(new Error());
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //this.ruleForm.cardIdz = this.ruleForm.cardId;
          this.btnstatu = true;
          this.$store
            .dispatch("post", {
              uri: "userInfo/add",
              data: {
                name: this.ruleForm.name,
                phone: this.ruleForm.wkPhone,
                sex: this.sex.radio,
                cardId: this.ruleForm.cardId
              }
            })
            .then(res => {
              this.btnstatu = false;
              msg.success();
              this.$router.push({
                path: "/client/recharge/search?n=" + this.ruleForm.wkPhone
              });
            });
        }
      });
    },
    cardChange() {
      this.ruleForm.cardIdz = this.ruleForm.cardId;
    }
  }
};
</script>
>
