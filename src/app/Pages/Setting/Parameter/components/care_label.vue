<style lang="less" scoped>
  .width_one_hundred{
    width: 100px
  }
</style>
<template>
  <div>
    <div class="m-b-md printbox" style="padding-top: 30px"><img
      :src="phone == 1 && money == 1 ? '/static/img/setting/show_care_label.png' :
      phone == 1 && money == 0 ? '/static/img/setting/show_phone_care_label.png' :
      phone == 0 && money == 1 ? '/static/img/setting/show_money_care_label.png' : '/static/img/setting/hide_care_label.png'
    " /></div>
    <div class="m-b-md">
      <div>手机号</div>
      <div>
        <el-radio v-model="phone" :label="1" class="width_one_hundred">显示全部手机号</el-radio>
        <el-radio v-model="phone" :label="0" class="width_one_hundred">隐藏手机号中间四位</el-radio>
      </div>
    </div>
    <div class="m-b-md">
      <div>金额</div>
      <div>
        <el-radio v-model="money" :label="1" class="width_one_hundred">显示金额</el-radio>
        <el-radio v-model="money" :label="0" class="width_one_hundred">隐藏金额</el-radio>
      </div>
    </div>
    <div  class="">
      <auth perm="setting.parameter.protocol">
        <el-button type="primary"
                   @click="updateDetail" >保存</el-button>
      </auth>
    </div>

  </div>
</template>
<script>
  import consts from "@/utils/consts";
  import msg from "@/utils/msg";
  export default {
    data() {
      return {
        phone: '0',
        money: '0'
      };
    },
    created() {
      this.getContent();
    },
    methods: {
      getContent() {
        this.$store
          .dispatch("post", {
            uri: "mercCityParam/detail",
            data: {}
          })
          .then(res => {
            let washLabelConfig = res.data.data.washLabelConfig || '00'
            this.phone = parseInt(washLabelConfig.split('')[0]);
            this.money = parseInt(washLabelConfig.split('')[1] || 0);
          });
      },
      updateDetail(){
        this.$store
          .dispatch("post", {
            uri: "mercCityParam/update",
            data: {
              washLabelConfig: this.phone+''+this.money
            }
          })
          .then(res => {
            this.getContent();
            msg.success();
          });
      }
    }
  };
</script>
<style></style>
